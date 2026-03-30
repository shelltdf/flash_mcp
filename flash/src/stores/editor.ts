import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { OpenedProjectMeta, ToolId } from '../types/document'
import { openAnimateFromFile, openAnimateFromFolderFiles } from '../io/openAnimateProject'

const DEFAULT_FPS = 24
const DEFAULT_STAGE_W = 550
const DEFAULT_STAGE_H = 400

export const useEditorStore = defineStore('editor', () => {
  const activeTool = ref<ToolId>('select')
  const zoomPercent = ref(100)
  const stagePan = ref({ x: 0, y: 0 })
  const currentFrame = ref(1)
  const playing = ref(false)
  const fps = ref(DEFAULT_FPS)
  const stageWidth = ref(DEFAULT_STAGE_W)
  const stageHeight = ref(DEFAULT_STAGE_H)

  const project = ref<OpenedProjectMeta | null>(null)
  const statusMessage = ref('就绪')

  const timelineLayers = computed(() => project.value?.layers ?? [{ name: 'Layer 1', frameCount: 120 }])
  const maxFrame = computed(() => {
    const layers = timelineLayers.value
    let m = 1
    for (const l of layers) m = Math.max(m, l.frameCount)
    return m
  })

  const libraryItems = computed(() => project.value?.libraryItems ?? [])

  function setTool(id: ToolId) {
    activeTool.value = id
  }

  function setZoom(pct: number) {
    zoomPercent.value = Math.min(400, Math.max(25, Math.round(pct)))
  }

  function nudgeFrame(delta: number) {
    const next = currentFrame.value + delta
    currentFrame.value = Math.min(maxFrame.value, Math.max(1, next))
  }

  function applyMeta(meta: OpenedProjectMeta) {
    project.value = meta
    currentFrame.value = 1
    if (meta.frameRate != null && meta.frameRate > 0) fps.value = meta.frameRate
    if (meta.stageWidth != null && meta.stageWidth > 0) stageWidth.value = Math.round(meta.stageWidth)
    if (meta.stageHeight != null && meta.stageHeight > 0) stageHeight.value = Math.round(meta.stageHeight)
  }

  async function openFile(file: File | null) {
    if (!file) return
    statusMessage.value = '正在读取…'
    const meta = await openAnimateFromFile(file)
    applyMeta(meta)
    statusMessage.value = meta.xflDetected
      ? `已打开：${meta.fileName}${meta.parseNote ? `（${meta.parseNote}）` : ''}`
      : meta.parseNote ?? `已选择：${meta.fileName}`
  }

  async function openFolder(files: FileList | null) {
    if (!files?.length) return
    statusMessage.value = '正在读取 XFL 文件夹…'
    const meta = await openAnimateFromFolderFiles(files)
    applyMeta(meta)
    statusMessage.value = meta.xflDetected
      ? `已打开 XFL：${meta.fileName}${meta.parseNote ? `（${meta.parseNote}）` : ''}`
      : meta.parseNote ?? '未能打开该文件夹'
  }

  function newDocument() {
    project.value = null
    currentFrame.value = 1
    fps.value = DEFAULT_FPS
    stageWidth.value = DEFAULT_STAGE_W
    stageHeight.value = DEFAULT_STAGE_H
    statusMessage.value = '新建文档（占位）'
  }

  return {
    activeTool,
    zoomPercent,
    stagePan,
    currentFrame,
    playing,
    fps,
    stageWidth,
    stageHeight,
    project,
    statusMessage,
    timelineLayers,
    maxFrame,
    libraryItems,
    setTool,
    setZoom,
    nudgeFrame,
    openFile,
    openFolder,
    newDocument,
  }
})
