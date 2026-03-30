import JSZip from 'jszip'
import type { AnimateProjectKind, OpenedProjectMeta, TimelineLayer } from '../types/document'

const ZIP_MAGIC = 0x4b50 // "PK"

function normPath(p: string): string {
  return p.replace(/\\/g, '/')
}

function rootPrefixFromDomPath(domPath: string): string {
  const n = normPath(domPath)
  const i = n.lastIndexOf('DOMDocument.xml')
  if (i < 0) return ''
  return n.slice(0, i)
}

function findDomPathInZip(zip: JSZip): string | null {
  const names = Object.keys(zip.files).filter((n) => !zip.files[n].dir)
  for (const n of names) {
    const lower = normPath(n).toLowerCase()
    if (lower === 'domdocument.xml' || lower.endsWith('/domdocument.xml')) {
      return n
    }
  }
  return null
}

function layerFrameCount(layer: Element): number {
  const frames = layer.getElementsByTagName('DOMFrame')
  let maxIdx = 0
  for (let i = 0; i < frames.length; i++) {
    const raw = frames[i].getAttribute('index')
    const idx = raw != null ? parseInt(raw, 10) : 0
    if (!Number.isNaN(idx) && idx > maxIdx) maxIdx = idx
  }
  return Math.max(1, maxIdx + 1)
}

function parseDomDocument(xml: string): {
  layers: TimelineLayer[]
  frameRate?: number
  stageWidth?: number
  stageHeight?: number
  sceneNames?: string[]
  note?: string
} {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'application/xml')
  if (doc.querySelector('parsererror')) {
    return { layers: [], note: 'XML 解析错误' }
  }

  const root = doc.documentElement
  const fr = root.getAttribute('frameRate')
  const fw = root.getAttribute('width')
  const fh = root.getAttribute('height')
  let frameRate = fr != null ? parseFloat(fr) : undefined
  let stageWidth = fw != null ? parseFloat(fw) : undefined
  let stageHeight = fh != null ? parseFloat(fh) : undefined
  if (frameRate != null && Number.isNaN(frameRate)) frameRate = undefined
  if (stageWidth != null && Number.isNaN(stageWidth)) stageWidth = undefined
  if (stageHeight != null && Number.isNaN(stageHeight)) stageHeight = undefined

  const sceneNames: string[] = []
  const timelines = Array.from(doc.getElementsByTagName('DOMTimeline'))
  for (const t of timelines) {
    const nm = t.getAttribute('name')?.trim()
    if (nm) sceneNames.push(nm)
  }

  const layerEls = Array.from(doc.getElementsByTagName('DOMLayer'))
  const layers: TimelineLayer[] = layerEls.map((el) => {
    const name = el.getAttribute('name')?.trim() || 'Layer'
    return { name, frameCount: layerFrameCount(el) }
  })

  if (layers.length === 0) {
    return {
      layers: [{ name: 'Layer 1', frameCount: 1 }],
      frameRate,
      stageWidth,
      stageHeight,
      sceneNames: sceneNames.length ? sceneNames : undefined,
      note: '未解析到 DOMLayer，已使用占位',
    }
  }

  return {
    layers,
    frameRate,
    stageWidth,
    stageHeight,
    sceneNames: sceneNames.length ? sceneNames : undefined,
  }
}

function libraryNamesFromRoot(
  listPaths: (cb: (relPath: string, isDir: boolean) => void) => void,
): string[] {
  const names: string[] = []
  listPaths((rel, isDir) => {
    if (isDir) return
    const p = normPath(rel)
    const lower = p.toLowerCase()
    if (!lower.startsWith('library/')) return
    const rest = p.slice('library/'.length)
    if (rest) names.push(rest.replace(/\.xml$/i, ''))
  })
  return [...new Set(names)].sort()
}

function stripProjectRoot(path: string, rootPrefix: string): string {
  const p = normPath(path)
  const r = normPath(rootPrefix)
  if (!r) return p
  if (p.toLowerCase().startsWith(r.toLowerCase())) return p.slice(r.length)
  return p
}

function libraryNamesFromZip(zip: JSZip, domPath: string): string[] {
  const root = rootPrefixFromDomPath(normPath(domPath))
  return libraryNamesFromRoot((cb) => {
    for (const path of Object.keys(zip.files)) {
      const z = zip.files[path]
      if (z.dir) continue
      const rel = stripProjectRoot(path, root)
      cb(rel, false)
    }
  })
}

function findDomInFolderFiles(files: File[]): { file: File; rootPrefix: string } | null {
  for (const f of files) {
    const p = normPath(f.webkitRelativePath || f.name)
    const lower = p.toLowerCase()
    if (lower === 'domdocument.xml' || lower.endsWith('/domdocument.xml')) {
      const idx = p.toLowerCase().lastIndexOf('domdocument.xml')
      const rootPrefix = idx >= 0 ? p.slice(0, idx) : ''
      return { file: f, rootPrefix }
    }
  }
  return null
}

function libraryNamesFromFolderFiles(files: File[], rootPrefix: string): string[] {
  return libraryNamesFromRoot((cb) => {
    for (const f of files) {
      const p = normPath(f.webkitRelativePath || f.name)
      const rel = stripProjectRoot(p, rootPrefix)
      cb(rel, false)
    }
  })
}

function mergeLayerFrameCounts(layers: TimelineLayer[]): TimelineLayer[] {
  let maxFrames = 1
  for (const l of layers) maxFrames = Math.max(maxFrames, l.frameCount)
  return layers.map((l) => ({ ...l, frameCount: Math.max(l.frameCount, maxFrames) }))
}

function unsupportedMeta(
  fileName: string,
  parseNote: string,
  kind: AnimateProjectKind = 'unknown',
): OpenedProjectMeta {
  return {
    fileName,
    kind,
    xflDetected: false,
    layers: [{ name: 'Layer 1', frameCount: 1 }],
    libraryItems: [],
    parseNote,
  }
}

function isLikelyZip(buf: ArrayBuffer): boolean {
  if (buf.byteLength < 4) return false
  const v = new DataView(buf)
  return v.getUint16(0, true) === ZIP_MAGIC
}

/**
 * 从单个文件打开：支持 Animate 另存的 **未压缩 XFL 打成的 zip**、**扩展名为 .fla 但实为 ZIP 的包**（Animate 常见）、以及任意含 DOMDocument.xml 的 zip。
 */
export async function openAnimateFromFile(file: File): Promise<OpenedProjectMeta> {
  const buf = await file.arrayBuffer()
  const lowerName = file.name.toLowerCase()
  const kindGuess: AnimateProjectKind =
    lowerName.endsWith('.fla') && isLikelyZip(buf) ? 'fla-zip' : lowerName.endsWith('.zip') ? 'xfl-zip' : 'xfl-zip'

  if (!isLikelyZip(buf)) {
    return unsupportedMeta(
      file.name,
      '该文件不是 ZIP 容器。Adobe Animate 若保存为**二进制 .fla**，请使用菜单「另存为」→ **Animate 未压缩文档（XFL）**，再选择「打开 XFL 文件夹…」打开该文件夹；或将 XFL 文件夹打包为 ZIP 后使用「打开…」。',
      'unknown',
    )
  }

  try {
    const zip = await JSZip.loadAsync(buf)
    const domPath = findDomPathInZip(zip)
    if (!domPath) {
      return unsupportedMeta(
        file.name,
        'ZIP 内未找到 DOMDocument.xml。请确认为 Animate XFL 工程（含 DOMDocument.xml 与 LIBRARY 等目录）。',
        kindGuess,
      )
    }

    const xml = await zip.file(domPath)!.async('string')
    const parsed = parseDomDocument(xml)
    const libraryItems = libraryNamesFromZip(zip, domPath)
    const layers = mergeLayerFrameCounts(parsed.layers)

    return {
      fileName: file.name,
      kind: lowerName.endsWith('.fla') ? 'fla-zip' : 'xfl-zip',
      xflDetected: true,
      layers,
      libraryItems,
      frameRate: parsed.frameRate,
      stageWidth: parsed.stageWidth,
      stageHeight: parsed.stageHeight,
      sceneNames: parsed.sceneNames,
      parseNote: parsed.note,
    }
  } catch {
    return unsupportedMeta(file.name, '无法读取 ZIP。文件可能损坏或不是 Animate 工程包。', kindGuess)
  }
}

/**
 * 从用户选择的 **文件夹**（webkitdirectory）打开未压缩 XFL：需包含 DOMDocument.xml。
 */
export async function openAnimateFromFolderFiles(files: FileList | File[]): Promise<OpenedProjectMeta> {
  const arr = Array.from(files)
  if (arr.length === 0) {
    return unsupportedMeta('(空)', '未选择任何文件。')
  }

  const found = findDomInFolderFiles(arr)
  if (!found) {
    const hint = arr[0]?.webkitRelativePath?.split(/[/\\]/)[0] ?? '工程'
    return unsupportedMeta(
      hint,
      '所选文件夹中未找到 DOMDocument.xml。请选择 Animate「另存为」生成的 **XFL 文件夹**（内含 DOMDocument.xml、LIBRARY 等）。',
      'unknown',
    )
  }

  const xml = await found.file.text()
  const parsed = parseDomDocument(xml)
  const libraryItems = libraryNamesFromFolderFiles(arr, found.rootPrefix)
  const layers = mergeLayerFrameCounts(parsed.layers)
  const rootLabel = found.rootPrefix
    ? normPath(found.rootPrefix).replace(/\/$/, '').split('/').pop() || 'XFL'
    : 'XFL'

  return {
    fileName: `${rootLabel}/`,
    kind: 'xfl-folder',
    xflDetected: true,
    layers,
    libraryItems,
    frameRate: parsed.frameRate,
    stageWidth: parsed.stageWidth,
    stageHeight: parsed.stageHeight,
    sceneNames: parsed.sceneNames,
    parseNote: parsed.note,
  }
}
