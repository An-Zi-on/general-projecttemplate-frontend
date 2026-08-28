<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { userLoginUsingPost } from '@/api/userController'
import { useUserStore, type LoginUser } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  userAccount: '',
  userPassword: '',
})

const rules: FormRules = {
  userAccount: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 8, message: '账号长度不能少于 8 位', trigger: 'blur' },
  ],
  userPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, message: '密码长度不能少于 8 位', trigger: 'blur' },
  ],
}

const handleSubmit = async () => {
  if (!formRef.value) {
    return
  }

  await formRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }

    loading.value = true
    try {
      const result = await userLoginUsingPost({
        userAccount: form.userAccount,
        userPassword: form.userPassword,
      })

      if (result.code !== 0) {
        ElMessage.error(result.message || '登录失败')
        return
      }

      ElMessage.success('登录成功')
      userStore.setLoginUser(result.data as LoginUser)
      const redirect = route.query.redirect as string | undefined
      await router.push(redirect || '/')
    }
    catch {
      ElMessage.error('登录请求失败，请稍后重试')
    }
    finally {
      loading.value = false
    }
  })
}

const goRegister = () => {
  router.push('/user/register')
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title">
          用户登录
        </h1>
        <p class="auth-subtitle">
          欢迎回来，请登录您的账号
        </p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        size="large"
        @keyup.enter="handleSubmit"
      >
        <el-form-item label="账号" prop="userAccount">
          <el-input
            v-model="form.userAccount"
            placeholder="请输入账号（至少 8 位）"
            clearable
          />
        </el-form-item>

        <el-form-item label="密码" prop="userPassword">
          <el-input
            v-model="form.userPassword"
            type="password"
            placeholder="请输入密码（至少 8 位）"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="submit-btn"
            :loading="loading"
            @click="handleSubmit"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="auth-footer">
        <span>还没有账号？</span>
        <el-link type="primary" :underline="false" @click="goRegister">
          立即注册
        </el-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #eef5ff 0%, #f8fbff 45%, #ffffff 100%);
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 36px 32px 28px;
  background: #fff;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgb(64 158 255 / 12%);
}

.auth-header {
  margin-bottom: 28px;
}

.auth-title {
  margin: 0;
  font-size: 26px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.auth-subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.submit-btn {
  width: 100%;
}

.auth-footer {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
</style>
