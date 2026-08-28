<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { userRegisterUsingPost } from '@/api/userController'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})

const validateCheckPassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('请再次输入密码'))
    return
  }
  if (value !== form.userPassword) {
    callback(new Error('两次输入的密码不一致'))
    return
  }
  callback()
}

const rules: FormRules = {
  userAccount: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 8, message: '账号长度不能少于 8 位', trigger: 'blur' },
  ],
  userPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, message: '密码长度不能少于 8 位', trigger: 'blur' },
  ],
  checkPassword: [
    { required: true, validator: validateCheckPassword, trigger: 'blur' },
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
      const result = await userRegisterUsingPost({
        userAccount: form.userAccount,
        userPassword: form.userPassword,
        checkPassword: form.checkPassword,
      })

      if (result.code !== 0) {
        ElMessage.error(result.message || '注册失败')
        return
      }

      ElMessage.success('注册成功，请登录')
      router.push('/user/login')
    }
    catch {
      ElMessage.error('注册请求失败，请稍后重试')
    }
    finally {
      loading.value = false
    }
  })
}

const goLogin = () => {
  router.push('/user/login')
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title">
          用户注册
        </h1>
        <p class="auth-subtitle">
          创建一个新账号，开始使用系统
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

        <el-form-item label="确认密码" prop="checkPassword">
          <el-input
            v-model="form.checkPassword"
            type="password"
            placeholder="请再次输入密码"
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
            注册
          </el-button>
        </el-form-item>
      </el-form>

      <div class="auth-footer">
        <span>已有账号？</span>
        <el-link type="primary" :underline="false" @click="goLogin">
          立即登录
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
