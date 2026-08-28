<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

onMounted(() => {
  const isAuthPage = route.path === '/user/login' || route.path === '/user/register'
  if (!isAuthPage) {
    userStore.fetchLoginUser()
  }
})
</script>

<template>
  <router-view />
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
</style>
