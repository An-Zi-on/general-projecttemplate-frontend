<script setup lang="ts">
import { ref } from 'vue'

const circleUrl
  = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const isLoggedIn = ref(false)
const cardVisible = ref(false)

const userInfo = {
  name: '张三',
  role: '系统管理员',
  phone: '138****8888',
  lastLogin: '2026-08-27 09:30',
}

const handleLogin = () => {
  // 后续接入登录逻辑
  isLoggedIn.value = true
}
</script>

<template>
  <div class="header-page">
    <el-button v-if="!isLoggedIn" type="primary" @click="handleLogin">
      登录
    </el-button>

    <el-popover
      v-else
      v-model:visible="cardVisible"
      placement="bottom-end"
      :width="260"
      trigger="click"
      popper-class="user-card-popover"
    >
      <template #reference>
        <el-avatar
          class="user-avatar"
          :size="40"
          :src="circleUrl"
        />
      </template>

      <el-card class="user-card" shadow="never">
        <div class="user-card-header">
          <el-avatar :size="48" :src="circleUrl" />
          <div class="user-card-title">
            <p class="user-name">
              {{ userInfo.name }}
            </p>
            <p class="user-role">
              {{ userInfo.role }}
            </p>
          </div>
        </div>

        <ul class="user-info-list">
          <li class="info-item">
            <span class="info-label">手机号</span>
            <span class="info-value">{{ userInfo.phone }}</span>
          </li>
          <li class="info-item">
            <span class="info-label">上次登录</span>
            <span class="info-value">{{ userInfo.lastLogin }}</span>
          </li>
          <li class="info-item">
            <span class="info-label">所属校区</span>
            <span class="info-value">东校区</span>
          </li>
          <li class="info-item">
            <span class="info-label">账号状态</span>
            <span class="info-value status-normal">正常</span>
          </li>
        </ul>
      </el-card>
    </el-popover>
  </div>
</template>

<style scoped>
.header-page {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
}

.user-avatar {
  cursor: pointer;
}

.user-card {
  border: none;
}

.user-card :deep(.el-card__body) {
  padding: 12px 14px;
}

.user-card-header {
  display: flex;
  gap: 10px;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.user-name {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.user-role {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.user-info-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.info-item {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 0;
  font-size: 13px;
}

.info-label {
  flex-shrink: 0;
  color: var(--el-text-color-secondary);
}

.info-value {
  text-align: right;
  color: var(--el-text-color-primary);
}

.status-normal {
  color: var(--el-color-success);
}
</style>
