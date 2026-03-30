export type ToolId =
  | 'select'
  | 'hand'
  | 'zoom'
  | 'rect'
  | 'oval'
  | 'line'
  | 'text'
  | 'pencil'
  | 'brush'
  | 'bucket'
  | 'eraser'

/** Adobe Animate 工程识别方式（XFL 未压缩目录 或 基于 ZIP 的包含 .fla） */
export type AnimateProjectKind = 'xfl-folder' | 'xfl-zip' | 'fla-zip' | 'unknown'

export interface TimelineLayer {
  name: string
  frameCount: number
}

export interface OpenedProjectMeta {
  fileName: string
  /** 如何识别为 Animate 工程 */
  kind: AnimateProjectKind
  /** 是否与 XFL/DOMDocument 对齐成功 */
  xflDetected: boolean
  layers: TimelineLayer[]
  libraryItems: string[]
  /** 自 DOMDocument 读取（若存在） */
  frameRate?: number
  stageWidth?: number
  stageHeight?: number
  sceneNames?: string[]
  parseNote?: string
}
