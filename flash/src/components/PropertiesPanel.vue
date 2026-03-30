<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '../stores/editor'

const editor = useEditorStore()

const docLabel = computed(() => editor.project?.fileName ?? '未命名')

const kindLabel = computed(() => {
  const k = editor.project?.kind
  if (!k || k === 'unknown') return '—'
  const map: Record<string, string> = {
    'xfl-folder': 'Animate 未压缩 XFL',
    'xfl-zip': 'ZIP / XFL 包',
    'fla-zip': 'FLA（ZIP 容器）',
  }
  return map[k] ?? k
})

const scenesLabel = computed(() => editor.project?.sceneNames?.join('，') ?? '—')
</script>

<template>
  <aside class="props">
    <div class="panel-header">属性</div>
    <div class="panel-body">
      <dl class="grid">
        <dt>文档</dt>
        <dd>{{ docLabel }}</dd>
        <dt>格式</dt>
        <dd>{{ kindLabel }}</dd>
        <dt>场景</dt>
        <dd class="wrap">{{ scenesLabel }}</dd>
        <dt>工具</dt>
        <dd>{{ editor.activeTool }}</dd>
        <dt>舞台</dt>
        <dd>{{ editor.stageWidth }} × {{ editor.stageHeight }}</dd>
        <dt>帧</dt>
        <dd>{{ editor.currentFrame }} / {{ editor.maxFrame }}</dd>
        <dt>FPS</dt>
        <dd>{{ editor.fps }}</dd>
      </dl>
    </div>
  </aside>
</template>

<style scoped>
.props {
  display: flex;
  flex-direction: column;
  min-width: 220px;
  max-width: 320px;
  background: var(--panel-bg);
  border-left: 1px solid var(--border);
}

.panel-header {
  padding: 6px 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted);
  border-bottom: 1px solid var(--border);
}

.panel-body {
  padding: 8px;
  font-size: 12px;
}

.grid {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 6px 8px;
  margin: 0;
}

.grid dt {
  margin: 0;
  color: var(--muted);
}

.grid dd {
  margin: 0;
}

.grid dd.wrap {
  word-break: break-word;
}
</style>
