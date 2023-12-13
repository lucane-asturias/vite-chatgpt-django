<script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import ChatContent from '../components/ChatContent.vue'

  import Skeleton from '../components/Skeleton.vue'

  import { useChatStore } from '../store/chatStore'

  const route = useRoute()
  const chatStore = useChatStore()

  const messages = computed(() => {
    if (!route.params.id) return

    if (chatStore.chats?.length > 0) {
      const chat = chatStore.getChatById(route.params.id)
      // if (!chat.messages) return // to-do: make something user friendly
      return chat.messages
    }
  })

  const showSkeleton = computed(() => chatStore.showSkeleton)
</script>

<template>
  <div class="w-full flex text-white">
    <div class="w-full flex justify-center">
      <div class="w-full pb-36 mt-3" ref="chatContainer">
        <template v-for="message in messages" :key="message.id">
          <ChatContent :content="message" />
        </template>
        <template v-if="showSkeleton"><Skeleton /></template>
      </div>
    </div>
  </div>
</template>