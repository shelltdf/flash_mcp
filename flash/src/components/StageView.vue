<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEditorStore } from '../stores/editor'

const editor = useEditorStore()
const dragging = ref(false)
const last = ref({ x: 0, y: 0 })

const stageStyle = computed(() => ({
  transform: `translate(${editor.stagePan.x}px, ${editor.stagePan.y}px) scale(${editor.zoomPercent / 100})`,
}))

const canvasClass = computed(() => ({
  hand: editor.activeTool === 'hand',
  grabbing: dragging.value && editor.activeTool === 'hand',
}))

function onPointerDown(e: PointerEvent) {
  if (editor.activeTool !== 'hand') return
  dragging.value = true
  last.value = { x: e.clientX, y: e.clientY }
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value || editor.activeTool !== 'hand') return
  const dx = e.clientX - last.value.x
  const dy = e.clientY - last.value.y
  last.value = { x: e.clientX, y: e.clientY }
  editor.stagePan.x += dx
  editor.stagePan.y += dy
}

function onPointerUp(e: PointerEvent) {
  dragging.value = false
  try {
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  } catch {
    /* ignore */
  }
}
</script>

<template>
  <div class="stage-wrap">
    <div class="tabs">
      <span class="tab active">场景 1</span>
    </div>
    <div
      class="stage-canvas"
      :class="canvasClass"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointerleave="onPointerUp"
    >
      <div class="stage-inner" :style="stageStyle">
        <div
          class="stage-doc"
          :style="{
            width: editor.stageWidth + 'px',
            height: editor.stageHeight + 'px',
          }"
        >
          <span class="stage-label">舞台</span>
        </div>
      </div>
    </div>
    <p class="status">{{ editor.statusMessage }}</p>
  </div>
</template>

<style scoped>
.stage-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  background: var(--stage-outer);
}

.tabs {
  display: flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  background: var(--bar-bg);
  border-bottom: 1px solid var(--border);
  font-size: 11px;
}

.tab {
  padding: 4px 10px;
  border-radius: 2px 2px 0 0;
  color: var(--muted);
}

.tab.active {
  background: var(--stage-outer);
  color: var(--text);
}

.stage-canvas {
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
}

.stage-canvas.hand {
  cursor: grab;
}

.stage-canvas.hand.grabbing {
  cursor: grabbing;
}

.stage-inner {
  transform-origin: center center;
}

.stage-doc {
  position: relative;
  background: #ffffff;
  box-shadow: 0 0 0 1px #333, 0 8px 32px rgba(0, 0, 0, 0.45);
}

.stage-label {
  position: absolute;
  right: 6px;
  bottom: 4px;
  font-size: 10px;
  color: #888;
  user-select: none;
}

.status {
  margin: 0;
  padding: 4px 8px;
  font-size: 11px;
  color: var(--muted);
  border-top: 1px solid var(--border);
  background: var(--bar-bg);
}
</style>
