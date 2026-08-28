import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/components/layout/ContainerPage.vue'),
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

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  if (title) {
    document.title = title
  }
})

export default router
