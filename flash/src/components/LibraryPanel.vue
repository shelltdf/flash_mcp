<script setup lang="ts">
import { useEditorStore } from '../stores/editor'

const editor = useEditorStore()
</script>

<template>
  <aside class="library">
    <div class="panel-header">库</div>
    <div class="panel-body">
      <ul v-if="editor.libraryItems.length" class="item-list">
        <li v-for="name in editor.libraryItems" :key="name">{{ name }}</li>
      </ul>
      <p v-else class="placeholder">无符号（打开 XFL 后将列出 LIBRARY）</p>
    </div>
  </aside>
</template>

<style scoped>
.library {
  display: flex;
  flex-direction: column;
  min-width: 200px;
  max-width: 280px;
  background: var(--panel-bg);
  border-right: 1px solid var(--border);
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
  flex: 1;
  overflow: auto;
  padding: 8px;
  font-size: 12px;
}

.item-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.item-list li {
  padding: 4px 6px;
  border-radius: 2px;
  cursor: default;
}

.item-list li:hover {
  background: var(--hover-bg);
}

.placeholder {
  margin: 0;
  color: var(--muted);
  line-height: 1.5;
}
</style>
