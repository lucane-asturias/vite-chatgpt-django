<script setup>
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import LoginForm from '../components/LoginForm.vue'
  import RegisterForm from '../components/RegisterForm.vue'

  const route = useRoute()
</script>

<template>
  <!-- style="margin: 40px; margin-top: 80px;" -->
  <div id="auth-view" class="p-6 pt-6 sm:p-14 sm:pt-20">
    <LoginForm 
      v-if="
        route.query.mode === undefined || route.query.mode === 'login'
      " 
    />

    <RegisterForm v-else />
  </div>
</template>