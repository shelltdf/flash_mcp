<script setup lang="ts">
import MenuBar from './components/MenuBar.vue'
import ToolBar from './components/ToolBar.vue'
import LibraryPanel from './components/LibraryPanel.vue'
import StageView from './components/StageView.vue'
import PropertiesPanel from './components/PropertiesPanel.vue'
import TimelinePanel from './components/TimelinePanel.vue'
</script>

<template>
  <div class="flash-app">
    <MenuBar />
    <ToolBar />
    <div class="main-row">
      <LibraryPanel />
      <StageView />
      <PropertiesPanel />
    </div>
    <TimelinePanel />
  </div>
</template>

<style scoped>
.flash-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--app-bg);
  color: var(--text);
}

.main-row {
  display: flex;
  flex: 1;
  min-height: 0;
}
</style>
