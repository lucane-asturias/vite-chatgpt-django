<script setup>
  import { reactive } from 'vue'
  import { useLogin } from '../composables/useLogin'

  const loginSchema = reactive({
    email: 'required|email',
    password: 'required|min:3|max:60',
  })

  const { 
    login_in_submission, login_show_alert,
    login_alert_color, login_alert_msg,
    onLogin
  } = useLogin()
  </script>

<template>
  <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">

    <div class="main-left">
      <div class="p-12 bg-white border border-gray-200 rounded-lg">
        <h1 class="mb-6 text-2xl">Log in</h1>

        <p class="mb-6 text-gray-500">
          Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate.
          Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate.
        </p>

        <p class="font-semibold">
          Don't have an account?
          <router-link 
            :to="{ name: 'auth', query: { mode: 'register' } }"
            class="font-bold hover:text-gray-700 underline inline-block">
            Click here
          </router-link> to create one!
        </p>
      </div>
    </div>

    <div class="main-right">
      <div class="p-12 bg-white border border-gray-200 rounded-lg">
        <div class="text-white text-center font-bold p-4 mb-6 rounded" v-if="login_show_alert" :class="login_alert_color">
          {{ login_alert_msg }}
        </div>
        <vee-form class="space-y-6" :validation-schema="loginSchema" @submit="onLogin">
          <div id="email">
            <label>E-mail</label><br>
            <vee-field type="email" name="email" placeholder="Your e-mail address" class="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg" />
            <ErrorMessage class="text-lg text-red-500" name="email" />
          </div>

          <div id="password">
            <label>Password</label><br>
            <vee-field type="password" name="password" placeholder="Your password" class="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg" />
            <ErrorMessage class="text-lg text-red-500" name="password" />
          </div>

          <div>
            <button type="submit" :disabled="login_in_submission" class="py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">Log in</button>
          </div>
        </vee-form>
      </div>
    </div>

  </div>
</template>