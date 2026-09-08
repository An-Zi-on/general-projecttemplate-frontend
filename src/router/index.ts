import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/components/layout/ContainerPage.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/components/layout/MainPage.vue'),
          meta: { title: '首页' },
        },
        {
          path: 'user/profile',
          name: 'UserProfile',
          component: () => import('@/components/user/UserProfilePage.vue'),
          meta: { title: '个人中心', requireAuth: true },
        },
      ],
    },
    {
      path: '/user/login',
      name: 'UserLogin',
      component: () => import('@/components/user/UserLoginPage.vue'),
      meta: { title: '用户登录' },
    },
    {
      path: '/user/register',
      name: 'UserRegister',
      component: () => import('@/components/user/UserRegisterPage.vue'),
      meta: { title: '用户注册' },
    },
  ],
})

router.beforeEach(async (to) => {
  if (to.meta.requireAuth) {
    const { useUserStore } = await import('@/stores/user')
    const userStore = useUserStore()
    if (!userStore.token) {
      return {
        path: '/user/login',
        query: { redirect: to.fullPath },
      }
    }
    if (!userStore.loginUser) {
      await userStore.fetchLoginUser()
      if (!userStore.loginUser) {
        return {
          path: '/user/login',
          query: { redirect: to.fullPath },
        }
      }
    }
  }
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  if (title) {
    document.title = title
  }
})

export default router
