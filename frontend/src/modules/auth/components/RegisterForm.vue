<script setup>
  import { reactive } from 'vue'
  import { useRegister } from '../composables/useRegister'
  
  const registerSchema = reactive({
    name: 'required|min:3|max:255|alpha_spaces',
    email: 'required|email',
    password1: 'required|min:3|max:60',
    password2: 'passwords_mismatch:@password1',
  })

  const { 
    reg_in_submission, reg_show_alert,
    reg_alert_color, reg_alert_msg,
    onRegister
  } = useRegister()
</script>

<template>
  <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">

    <div class="main-left">
      <div class="p-12 bg-white border border-gray-200 rounded-lg">
        <h1 class="mb-6 text-2xl">Register</h1>

          <p class="mb-6 text-gray-500">
            Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate.
            Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate.
          </p>

          <p class="font-semibold">
            Already have an account? 
            <router-link 
              :to="{ name: 'auth', query: { mode: 'login' } }"
              class="font-bold hover:text-gray-700 underline inline-block">
              Click here
            </router-link> to log in!
          </p>
      </div>
    </div>

    <div class="main-right">
      <div class="p-12 bg-white border border-gray-200 rounded-lg">
        <div class="text-white text-center font-bold p-4 mb-6 rounded" v-if="reg_show_alert" :class="reg_alert_color">
          {{ reg_alert_msg }}              
        </div>
        <vee-form class="space-y-6" :validation-schema="registerSchema" @submit="onRegister">

          <div id="name">
            <label>Name</label><br>
            <vee-field type="text" name="name" placeholder="Your full name" class="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg" />
            <ErrorMessage class="text-lg text-red-500" name="name" />
          </div>

          <div id="email">
            <label>E-mail</label><br>
            <vee-field type="email" name="email" placeholder="Your e-mail address" class="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg" />
            <ErrorMessage class="text-lg text-red-500" name="email" />
          </div>

          <div id="password">
            <label>Password</label><br>
            <vee-field type="password" name="password1" placeholder="Your password" class="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg" />
            <ErrorMessage class="text-lg text-red-500" name="password1" />
          </div>

          <div id="password2">
            <label>Repeat password</label><br>
            <vee-field type="password" name="password2" placeholder="Repeat your password" class="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg" />
            <ErrorMessage class="text-lg text-red-500" name="password2" />
          </div>

          <div>
            <button type="submit" :disabled="reg_in_submission" class="py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">Register</button>
          </div>
        </vee-form>
      </div>
    </div>

  </div>
</template>