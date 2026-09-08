<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { FormInstance, FormRules, UploadRequestOptions } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import {
  updateMyProfileUsingPost,
  uploadAvatarUsingPost,
} from '@/api/userController'

const defaultAvatar
  = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const API_ORIGIN = 'http://localhost:8123'

const userStore = useUserStore()
const { loginUser } = storeToRefs(userStore)

const formRef = ref<FormInstance>()
const saving = ref(false)
const uploading = ref(false)

const form = reactive({
  userName: '',
  userAvatar: '',
  userProfile: '',
})

const rules: FormRules = {
  userName: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 1, max: 20, message: '昵称长度 1-20 字', trigger: 'blur' },
  ],
  userProfile: [
    { max: 200, message: '简介最多 200 字', trigger: 'blur' },
  ],
}

const avatarPreview = computed(() => {
  const url = form.userAvatar || loginUser.value?.userAvatar
  if (!url) {
    return defaultAvatar
  }
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }
  return `${API_ORIGIN}${url}`
})

const syncFormFromStore = () => {
  form.userName = loginUser.value?.userName || ''
  form.userAvatar = loginUser.value?.userAvatar || ''
  form.userProfile = loginUser.value?.userProfile || ''
}

onMounted(async () => {
  if (!loginUser.value) {
    await userStore.fetchLoginUser()
  }
  syncFormFromStore()
})

const handleUploadAvatar = async (options: UploadRequestOptions) => {
  uploading.value = true
  try {
    const result = await uploadAvatarUsingPost(options.file as File)
    if (result.code !== 0 || !result.data) {
      ElMessage.error(result.message || '头像上传失败')
      return
    }
    form.userAvatar = result.data
    ElMessage.success('头像上传成功，请保存资料')
  }
  catch {
    ElMessage.error('头像上传失败')
  }
  finally {
    uploading.value = false
  }
}

const handleSave = async () => {
  if (!formRef.value) {
    return
  }
  await formRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    saving.value = true
    try {
      const result = await updateMyProfileUsingPost({
        userName: form.userName,
        userAvatar: form.userAvatar,
        userProfile: form.userProfile,
      })
      if (result.code !== 0) {
        ElMessage.error(result.message || '保存失败')
        return
      }
      await userStore.fetchLoginUser()
      syncFormFromStore()
      ElMessage.success('资料已保存')
    }
    catch {
      ElMessage.error('保存失败，请稍后重试')
    }
    finally {
      saving.value = false
    }
  })
}
</script>

<template>
  <div class="profile-page">
    <div class="profile-hero">
      <h1 class="profile-title">
        个人中心
      </h1>
      <p class="profile-subtitle">
        管理头像与基本资料
      </p>
    </div>

    <div class="profile-panel">
      <div class="avatar-block">
        <el-avatar
          :size="96"
          :src="avatarPreview"
          class="profile-avatar"
        />
        <el-upload
          :show-file-list="false"
          :http-request="handleUploadAvatar"
          accept="image/png,image/jpeg,image/webp,image/gif"
        >
          <el-button
            type="primary"
            plain
            :loading="uploading"
          >
            更换头像
          </el-button>
        </el-upload>
        <p class="avatar-tip">
          支持 jpg / png / webp / gif，不超过 2MB
        </p>
      </div>

      <el-form
        ref="formRef"
        class="profile-form"
        :model="form"
        :rules="rules"
        label-position="top"
        size="large"
      >
        <el-form-item label="账号">
          <el-input
            :model-value="loginUser?.userAccount || '-'"
            disabled
          />
        </el-form-item>

        <el-form-item label="角色">
          <el-input
            :model-value="loginUser?.userRole || '-'"
            disabled
          />
        </el-form-item>

        <el-form-item
          label="昵称"
          prop="userName"
        >
          <el-input
            v-model="form.userName"
            maxlength="20"
            show-word-limit
            placeholder="请输入昵称"
          />
        </el-form-item>

        <el-form-item
          label="个人简介"
          prop="userProfile"
        >
          <el-input
            v-model="form.userProfile"
            type="textarea"
            :rows="5"
            maxlength="200"
            show-word-limit
            placeholder="介绍你的身份、技能与兴趣，建议 2～4 句"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="saving"
            @click="handleSave"
          >
            保存修改
          </el-button>
          <el-button @click="syncFormFromStore">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 720px;
  margin: 0 auto;
}

.profile-hero {
  margin-bottom: 20px;
}

.profile-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.profile-subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.profile-panel {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 28px;
  padding: 24px;
  background: #fff;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
}

.avatar-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  padding-top: 8px;
}

.profile-avatar {
  border: 1px solid var(--el-border-color-lighter);
}

.avatar-tip {
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
  color: var(--el-text-color-secondary);
  text-align: center;
}

.profile-form {
  min-width: 0;
}

@media (max-width: 720px) {
  .profile-panel {
    grid-template-columns: 1fr;
  }
}
</style>
