<template>
  <div class="aside-page">
    <button
      type="button"
      class="collapse-trigger"
      :title="isCollapse ? '展开' : '收起'"
      @click="toggleCollapse"
    >
      <el-icon>
        <DArrowRight v-if="isCollapse" />
        <DArrowLeft v-else />
      </el-icon>
    </button>

    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><location /></el-icon>
          <span>Navigator One</span>
        </template>
        <el-menu-item-group>
          <template #title><span>Group One</span></template>
          <el-menu-item index="1-1">item one</el-menu-item>
          <el-menu-item index="1-2">item two</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Group Two">
          <el-menu-item index="1-3">item three</el-menu-item>
        </el-menu-item-group>
        <el-sub-menu index="1-4">
          <template #title><span>item four</span></template>
          <el-menu-item index="1-4-1">item one</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
      <el-menu-item index="2">
        <el-icon><icon-menu /></el-icon>
        <template #title>Navigator Two</template>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <el-icon><document /></el-icon>
        <template #title>Navigator Three</template>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><setting /></el-icon>
        <template #title>Navigator Four</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import {
  DArrowLeft,
  DArrowRight,
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

const isCollapse = defineModel<boolean>({ default: true })

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped>
.aside-page {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.collapse-trigger {
  position: absolute;
  top: 50%;
  right: -12px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 48px;
  padding: 0;
  color: #606266;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-left: none;
  border-radius: 0 6px 6px 0;
  box-shadow: 2px 0 8px rgb(0 0 0 / 8%);
  transform: translateY(-50%);
  transition: color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.collapse-trigger:hover {
  color: #409eff;
  border-color: #c6e2ff;
  box-shadow: 2px 0 10px rgb(64 158 255 / 20%);
}

.collapse-trigger .el-icon {
  font-size: 12px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}

.el-menu-vertical-demo {
  flex: 1;
  min-height: 0;
  overflow: hidden auto;
  border-right: none;
}
</style>
