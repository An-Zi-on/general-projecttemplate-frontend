import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getActivePinia } from 'pinia'
import { TOKEN_STORAGE_KEY } from '@/globalconfig/auth'

function getToken(): string {
  return localStorage.getItem(TOKEN_STORAGE_KEY) || ''
}

function clearAuthState() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  const pinia = getActivePinia()
  const userState = pinia?.state.value?.user as { token?: string, loginUser?: unknown } | undefined
  if (userState) {
    userState.token = ''
    userState.loginUser = null
  }
}

function syncTokenToStore(newToken: string) {
  localStorage.setItem(TOKEN_STORAGE_KEY, newToken)
  const pinia = getActivePinia()
  const userState = pinia?.state.value?.user as { token?: string } | undefined
  if (userState) {
    userState.token = newToken
  }
}

// 创建 Axios 实例
const myAxios = axios.create({
  baseURL: 'http://localhost:8123',
  timeout: 60000,
  withCredentials: true,
})

// 全局请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    const token = getToken()
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.token = token
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

// 全局响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    const { data } = response
    const refreshedToken = response.headers?.token as string | undefined
    if (refreshedToken) {
      syncTokenToStore(refreshedToken)
    }
    // 未登录
    if (data.code === 40100) {
      clearAuthState()
      // 不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
      if (
        !response.request.responseURL.includes('user/current')
        && !window.location.pathname.includes('/user/login')
      ) {
        ElMessage.warning('请先登录')
        window.location.href = `/user/login?redirect=${window.location.href}`
      }
    }
    return response
  },
  function (error) {
    return Promise.reject(error)
  },
)

export default myAxios
