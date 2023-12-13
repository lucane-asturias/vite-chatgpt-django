import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

type ResponseType = { data: { message?: string, detail?: string } }

export const useRegister = () => {
  const router = useRouter()

  const reg_alert_color = ref<string>('bg-blue-500') 
  const reg_alert_msg = ref<string>('') 
  const reg_show_alert = ref<boolean>(false) 
  const reg_in_submission = ref<boolean>(false)

  const onRegister = async (values: { 
    name: string, 
    email: string, 
    password1: string, 
    password2: string 
  }, { resetForm }: { 
    resetForm: Function 
  }) => {
    reg_alert_color.value = 'bg-blue-500'
    reg_alert_msg.value = 'Please wait! Your account is being created.'
    reg_show_alert.value = true
    reg_in_submission.value = true

    try {
      const { data } = await axios.post('/api/signup/', values) as { data: ResponseType }
      console.log('data', data)
      if (data?.message === 'success') {
        reg_alert_color.value = 'bg-green-500'
        reg_alert_msg.value = 'Success! Your account has been created.'
        reg_in_submission.value = false
      } else {
        reg_alert_color.value = 'bg-red-500'
        reg_alert_msg.value = 
          JSON.parse(data.message).email?.[0].message || 
          JSON.parse(data.message).password2?.[0].message || 
          'An unexpected error occurred. Please try again later.'

        reg_in_submission.value = false
        return
      }
    } catch (error) {
      console.error(error)
      return
    }

    setTimeout(() => {
      reg_in_submission.value = false
      router.push({ name: 'auth', query: { mode: 'login' } })
      resetForm()
    }, 1000)
  }

  return {
    reg_in_submission, reg_show_alert,
    reg_alert_color, reg_alert_msg,
    onRegister
  }
}