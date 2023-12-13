import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { createPinia } from 'pinia'
import VeeValidatePlugin from './includes/validation'
import { useUserStore } from '@/modules/auth/store/userStore'

import './tailwind.css'

axios.defaults.baseURL = 'http://127.0.0.1:8000'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Initialize the user store and get the authentication token
const userStore = useUserStore()
userStore.initStore().then(() => {
  const authToken = userStore.user?.access || ''

  axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`

  // Mount the app once everything is set up
  app.use(router)
  app.use(VeeValidatePlugin)
  app.mount('#app')
})