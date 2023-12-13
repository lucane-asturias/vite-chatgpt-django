import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/userStore'

type ResponseType = { data: { refresh: string, access: string } }

export const useLogin = () => {
  const userStore = useUserStore()
  const router = useRouter()

  const login_alert_color = ref('bg-blue-500') 
  const login_alert_msg = ref('') 
  const login_show_alert = ref(false) 
  const login_in_submission = ref(false) 

  const onLogin = async (values: { 
    email: string, 
    password: string
  }, { resetForm }: { 
    resetForm: Function 
  }) => {
    login_alert_color.value = 'bg-blue-500'
    login_alert_msg.value = 'Please wait! We are logging you in.'
    login_show_alert.value = true
    login_in_submission.value = true

    try {
      const { data } = await axios.post('/api/login/', values) as { data: ResponseType }

      login_alert_color.value = 'bg-green-500'
      login_alert_msg.value = 'Success! You are now logged in.'

      userStore.setToken(data)

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`
    } catch (error: any) {
      console.error(error)
      login_alert_color.value = 'bg-red-500'
      login_alert_msg.value =  error.response?.data.detail || 'Invalid login details.'
      login_in_submission.value = false
      return
    }

    try {
      const { data } = await axios.get('/api/me')

      userStore.setUserInfo(data)
    } catch (error: any) {
      console.error(error)
      login_alert_color.value = 'bg-red-500'
      login_alert_msg.value = error.response?.data.detail || 'Something went wrong!'
      login_in_submission.value = false
      return
    }

    setTimeout(() => {
      login_in_submission.value = false
      router.push({ name: 'chat' })
      resetForm()
    }, 1000)
  }

  return {
    login_in_submission, login_show_alert,
    login_alert_color, login_alert_msg,
    onLogin
  }
}