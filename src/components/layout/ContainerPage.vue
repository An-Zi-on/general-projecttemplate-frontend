<script setup lang="ts">
import { computed, ref } from 'vue'
import FooterPage from '@/components/layout/FooterPage.vue'
import HeaderPage from '@/components/layout/HeaderPage.vue'
import AsidePage from '@/components/layout/AsidePage.vue'
import MainPage from '@/components/layout/MainPage.vue'

const isCollapse = ref(true)
const asideWidth = computed(() => (isCollapse.value ? '64px' : '200px'))
</script>

<template>
  <div class="common-layout">
    <el-container class="layout-root">
      <el-aside :width="asideWidth" class="layout-aside">
        <AsidePage v-model="isCollapse" />
      </el-aside>

      <el-container class="layout-content">
        <el-header class="layout-header">
          <HeaderPage />
        </el-header>
        <el-main class="layout-main">
          <MainPage />
        </el-main>
        <el-footer class="layout-footer">
          <FooterPage />
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout,
.layout-root {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.layout-aside {
  position: relative;
  z-index: 2;
  height: 100%;
  overflow: visible;
  transition: width 0.3s ease;
}

.layout-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.layout-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid var(--el-border-color-light);
}

.layout-main {
  flex: 1;
  min-height: 0;
  padding: 20px;
  overflow: hidden auto;
  background-color: var(--el-bg-color-page);
}

.layout-footer {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 48px;
  padding: 0 20px;
  background-color: #fff;
  border-top: 1px solid var(--el-border-color-light);
}
</style>
