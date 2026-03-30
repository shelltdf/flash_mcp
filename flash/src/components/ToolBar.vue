<script setup lang="ts">
import { useEditorStore } from '../stores/editor'
import type { ToolId } from '../types/document'

const editor = useEditorStore()

const tools: { id: ToolId; label: string; hint: string }[] = [
  { id: 'select', label: '↖', hint: '选择工具 (V)' },
  { id: 'hand', label: '✋', hint: '手型工具 (H)' },
  { id: 'zoom', label: '🔍', hint: '缩放工具 (Z)' },
  { id: 'rect', label: '▭', hint: '矩形工具 (R)' },
  { id: 'oval', label: '○', hint: '椭圆工具 (O)' },
  { id: 'line', label: '╱', hint: '线条工具 (N)' },
  { id: 'text', label: 'T', hint: '文本工具 (T)' },
  { id: 'pencil', label: '✎', hint: '铅笔工具 (Y)' },
  { id: 'brush', label: '🖌', hint: '画笔工具 (B)' },
  { id: 'bucket', label: '⬛', hint: '颜料桶工具 (K)' },
  { id: 'eraser', label: '⌫', hint: '橡皮擦工具 (E)' },
]
</script>

<template>
  <div class="tool-bar">
    <div class="tool-group">
      <button
        v-for="t in tools"
        :key="t.id"
        type="button"
        class="tool-btn"
        :class="{ active: editor.activeTool === t.id }"
        :title="t.hint"
        @click="editor.setTool(t.id)"
      >
        {{ t.label }}
      </button>
    </div>
    <div class="zoom-group">
      <label>
        <span class="sr-only">缩放</span>
        <input
          type="range"
          min="25"
          max="400"
          step="5"
          :value="editor.zoomPercent"
          @input="editor.setZoom(Number(($event.target as HTMLInputElement).value))"
        />
      </label>
      <span class="zoom-label">{{ editor.zoomPercent }}%</span>
    </div>
  </div>
</template>

<style scoped>
.tool-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 36px;
  padding: 0 8px;
  background: var(--bar-bg);
  border-bottom: 1px solid var(--border);
}

.tool-group {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.tool-btn {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 2px;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

.tool-btn:hover {
  background: var(--hover-bg);
}

.tool-btn.active {
  border-color: var(--accent);
  background: rgba(20, 115, 230, 0.25);
}

.zoom-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.zoom-group input[type='range'] {
  width: 120px;
}

.zoom-label {
  font-size: 11px;
  color: var(--muted);
  min-width: 40px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
