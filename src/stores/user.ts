import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { currentUserUsingGet, loginOutUsingGet } from '@/api/userController'
import { TOKEN_STORAGE_KEY } from '@/globalconfig/auth'

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
  const token = ref<string>(localStorage.getItem(TOKEN_STORAGE_KEY) || '')

  function setLoginToken(currentToken: string | null) {
    const value = currentToken ?? ''
    token.value = value
    if (value) {
      localStorage.setItem(TOKEN_STORAGE_KEY, value)
    }
    else {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }

  async function fetchLoginUser() {
    if (!token.value) {
      loginUser.value = null
      return null
    }

    loading.value = true
    try {
      const result = await currentUserUsingGet()
      if (result.code === 0 && result.data) {
        loginUser.value = result.data as LoginUser
        return loginUser.value
      }
      loginUser.value = null
      setLoginToken(null)
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
      setLoginToken(null)
    }
  }

  return {
    loginUser,
    loading,
    isLoggedIn,
    setLoginToken,
    fetchLoginUser,
    logout,
    token,
  }
})
