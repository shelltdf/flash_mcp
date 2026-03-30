<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '../stores/editor'

const editor = useEditorStore()

const frameNumbers = computed(() => {
  const n = Math.min(editor.maxFrame, 48)
  return Array.from({ length: n }, (_, i) => i + 1)
})

function selectFrame(f: number) {
  editor.currentFrame = f
}
</script>

<template>
  <footer class="timeline">
    <div class="tl-controls">
      <button type="button" class="ctl" title="跳到第一帧" @click="editor.currentFrame = 1">⏮</button>
      <button
        type="button"
        class="ctl"
        :title="editor.playing ? '停止' : '播放'"
        @click="editor.playing = !editor.playing"
      >
        {{ editor.playing ? '⏸' : '▶' }}
      </button>
      <span class="fps">{{ editor.fps }} fps</span>
    </div>
    <div class="tl-scroll">
      <div class="tl-corner" />
      <div class="tl-frame-ruler">
        <button
          v-for="f in frameNumbers"
          :key="f"
          type="button"
          class="frame-head"
          :class="{ active: f === editor.currentFrame }"
          @click="selectFrame(f)"
        >
          {{ f }}
        </button>
      </div>
      <div class="tl-rows">
        <div v-for="(layer, li) in editor.timelineLayers" :key="li" class="tl-row">
          <div class="layer-name" :title="layer.name">{{ layer.name }}</div>
          <div class="layer-cells">
            <button
              v-for="f in frameNumbers"
              :key="f"
              type="button"
              class="cell"
              :class="{
                active: f === editor.currentFrame,
                key: f === 1 || f % 5 === 0,
              }"
              @click="selectFrame(f)"
            />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
  min-height: 140px;
  max-height: 220px;
  background: var(--panel-bg);
  border-top: 1px solid var(--border);
  font-size: 11px;
}

.tl-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-bottom: 1px solid var(--border);
  background: var(--bar-bg);
}

.ctl {
  width: 26px;
  height: 22px;
  border: 1px solid var(--border);
  background: var(--panel-bg);
  color: var(--text);
  cursor: pointer;
  border-radius: 2px;
}

.ctl:hover {
  background: var(--hover-bg);
}

.fps {
  margin-left: 8px;
  color: var(--muted);
}

.tl-scroll {
  flex: 1;
  overflow: auto;
  display: grid;
  grid-template-columns: 120px 1fr;
  grid-template-rows: auto 1fr;
}

.tl-corner {
  grid-row: 1;
  grid-column: 1;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  min-height: 22px;
}

.tl-frame-ruler {
  grid-row: 1;
  grid-column: 2;
  display: flex;
  border-bottom: 1px solid var(--border);
  overflow: hidden;
}

.frame-head {
  flex: 0 0 18px;
  width: 18px;
  padding: 0;
  border: none;
  border-right: 1px solid var(--border);
  background: var(--bar-bg);
  color: var(--muted);
  font-size: 9px;
  cursor: pointer;
}

.frame-head.active {
  background: var(--accent);
  color: #fff;
}

.tl-rows {
  grid-column: 1 / -1;
  grid-row: 2;
  display: flex;
  flex-direction: column;
}

.tl-row {
  display: flex;
  min-height: 22px;
  border-bottom: 1px solid #2a2a2a;
}

.layer-name {
  width: 120px;
  flex-shrink: 0;
  padding: 2px 6px;
  border-right: 1px solid var(--border);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: #353535;
}

.layer-cells {
  display: flex;
  flex: 1;
}

.cell {
  flex: 0 0 18px;
  width: 18px;
  height: 20px;
  padding: 0;
  border: none;
  border-right: 1px solid #2a2a2a;
  background: #3a3a3a;
  cursor: pointer;
}

.cell.key {
  background: #404040;
}

.cell.active {
  outline: 1px solid var(--accent);
  outline-offset: -1px;
}
</style>
