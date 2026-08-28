<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const defaultAvatar
  = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const router = useRouter()
const userStore = useUserStore()
const { loginUser, isLoggedIn } = storeToRefs(userStore)

const cardVisible = ref(false)
const loggingOut = ref(false)

const avatarUrl = computed(() => loginUser.value?.userAvatar || defaultAvatar)

const handleLogin = () => {
  router.push('/user/login')
}

const handleLogout = async () => {
  loggingOut.value = true
  try {
    await userStore.logout()
    cardVisible.value = false
    ElMessage.success('已退出登录')
    router.push('/user/login')
  }
  catch {
    ElMessage.error('退出登录失败')
  }
  finally {
    loggingOut.value = false
  }
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
          :src="avatarUrl"
        />
      </template>

      <el-card class="user-card" shadow="never">
        <div class="user-card-header">
          <el-avatar :size="48" :src="avatarUrl" />
          <div class="user-card-title">
            <p class="user-name">
              {{ loginUser?.userName || '未命名用户' }}
            </p>
            <p class="user-role">
              {{ loginUser?.userRole || '普通用户' }}
            </p>
          </div>
        </div>

        <ul class="user-info-list">
          <li class="info-item">
            <span class="info-label">账号</span>
            <span class="info-value">{{ loginUser?.userAccount || '-' }}</span>
          </li>
          <li class="info-item">
            <span class="info-label">个人简介</span>
            <span class="info-value">{{ loginUser?.userProfile || '暂无' }}</span>
          </li>
          <li class="info-item">
            <span class="info-label">上次更新</span>
            <span class="info-value">{{ loginUser?.updateTime || '-' }}</span>
          </li>
        </ul>

        <el-button
          class="logout-btn"
          type="danger"
          plain
          size="small"
          :loading="loggingOut"
          @click="handleLogout"
        >
          退出登录
        </el-button>
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

.logout-btn {
  width: 100%;
  margin-top: 10px;
}
</style>
