<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '../stores/editor'

const editor = useEditorStore()
const fileInputRef = ref<HTMLInputElement | null>(null)
const folderInputRef = ref<HTMLInputElement | null>(null)

function triggerOpen() {
  fileInputRef.value?.click()
}

function triggerOpenFolder() {
  folderInputRef.value?.click()
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  void editor.openFile(file)
  input.value = ''
}

function onFolderChange(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  void editor.openFolder(files)
  input.value = ''
}

function publish() {
  alert(
    '发布 SWF：当前版本尚未集成 SWF 编译器。\n后续可接入外部工具链或运行时预览（如 Ruffle）。',
  )
}
</script>

<template>
  <header class="menu-bar">
    <nav class="menus">
      <div class="menu">
        <span class="menu-title">文件</span>
        <div class="menu-dropdown">
          <button type="button" @click="editor.newDocument">新建</button>
          <button type="button" @click="triggerOpen">打开…</button>
          <button type="button" title="选择 Animate 另存为的未压缩 XFL 文件夹" @click="triggerOpenFolder">
            打开 XFL 文件夹…
          </button>
          <button type="button" disabled>保存</button>
          <hr />
          <button type="button" @click="publish">发布…</button>
        </div>
      </div>
      <div class="menu">
        <span class="menu-title">编辑</span>
        <div class="menu-dropdown">
          <button type="button" disabled>撤销</button>
          <button type="button" disabled>重做</button>
        </div>
      </div>
      <div class="menu">
        <span class="menu-title">视图</span>
        <div class="menu-dropdown">
          <button type="button" @click="editor.setZoom(editor.zoomPercent + 10)">放大</button>
          <button type="button" @click="editor.setZoom(editor.zoomPercent - 10)">缩小</button>
        </div>
      </div>
      <div class="menu">
        <span class="menu-title">帮助</span>
        <div class="menu-dropdown">
          <button type="button" disabled>关于 Flash 编辑器</button>
        </div>
      </div>
    </nav>
    <input
      ref="fileInputRef"
      class="file-input"
      type="file"
      accept=".fla,.zip,.xfl,application/zip,application/x-fla"
      @change="onFileChange"
    />
    <input
      ref="folderInputRef"
      class="file-input"
      type="file"
      webkitdirectory
      multiple
      @change="onFolderChange"
    />
  </header>
</template>

<style scoped>
.menu-bar {
  display: flex;
  align-items: center;
  height: 28px;
  background: var(--bar-bg);
  border-bottom: 1px solid var(--border);
  font-size: 12px;
  user-select: none;
}

.menus {
  display: flex;
  gap: 2px;
}

.menu {
  position: relative;
}

.menu-title {
  display: inline-block;
  padding: 4px 10px;
  cursor: default;
}

.menu:hover .menu-title {
  background: var(--hover-bg);
}

.menu-dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 160px;
  background: var(--panel-bg);
  border: 1px solid var(--border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
  z-index: 200;
}

.menu:hover .menu-dropdown {
  display: flex;
  flex-direction: column;
}

.menu-dropdown button {
  text-align: left;
  padding: 6px 12px;
  border: none;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  font-size: 12px;
}

.menu-dropdown button:hover:not(:disabled) {
  background: var(--accent);
  color: #fff;
}

.menu-dropdown button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.file-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 4px 0;
}
</style>
