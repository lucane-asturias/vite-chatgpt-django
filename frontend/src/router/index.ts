import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/modules/auth/store/userStore'

import ChatView from '@/modules/chatgpt/views/ChatView.vue'
import ChatItemView from '@/modules/chatgpt/views/ChatItemView.vue'
import AuthView from '@/modules/auth/views/AuthView.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    redirect: { name: 'chat' }
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView,
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatView,
    // meta: { requiresAuth: true },
    children: [
      {
        path: ':id',
        name: 'chat-item',
        component: ChatItemView,
        // meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/:any(.*)',
    component: { name: 'home' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // scroll to top when navigating to a new route
    return { top: 0 }
  }
})

// router.beforeEach((to, from, next) => {
//   if (!to.meta.requiresAuth) {
//     next()
//     return
//   }

//   const authStore = useUserStore()
  
//   if (authStore.isAuthenticated) {
//     next()
//   } else {
//     next({ name: 'auth', query: { mode: 'login' } })
//   }
// })

export default router
