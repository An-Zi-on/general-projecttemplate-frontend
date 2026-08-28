import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { currentUserUsingGet, loginOutUsingGet } from '@/api/userController'

export type LoginUser = {
  id?: number
  userAccount?: string
  userName?: string
  userAvatar?: string
  userProfile?: string
  userRole?: string
  createTime?: string
  updateTime?: string
}

export const useUserStore = defineStore('user', () => {
  const loginUser = ref<LoginUser | null>(null)
  const loading = ref(false)

  const isLoggedIn = computed(() => loginUser.value !== null)

  function setLoginUser(user: LoginUser | null) {
    loginUser.value = user
  }

  async function fetchLoginUser() {
    loading.value = true
    try {
      const result = await currentUserUsingGet()
      if (result.code === 0 && result.data) {
        loginUser.value = result.data as LoginUser
        return loginUser.value
      }
      loginUser.value = null
      return null
    }
    catch {
      loginUser.value = null
      return null
    }
    finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await loginOutUsingGet()
    }
    finally {
      loginUser.value = null
    }
  }

  return {
    loginUser,
    loading,
    isLoggedIn,
    setLoginUser,
    fetchLoginUser,
    logout,
  }
})
