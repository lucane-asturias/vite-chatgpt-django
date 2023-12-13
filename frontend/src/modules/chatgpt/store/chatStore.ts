import { defineStore } from 'pinia'
import axios from 'axios'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ChatType, ChatMessagesType } from '../interfaces/ChatType'

export const useChatStore = defineStore('chatStore', () => {

  const route = useRoute()
  const router = useRouter()

  // State Properties ============================

  const chats = ref<ChatType[]>()
  const chatInSubmission = ref<boolean>(false)
  const showSkeleton = ref<boolean>(false)

  // Actions ============================

  async function onMessageSubmition(messageInput) {
    chatInSubmission.value = true
    showSkeleton.value = true

    try {
      if (!route.params.id) {
        await axios.post('/api/chat/create/', { message: messageInput })

        const detailsData = await getChatDetails()

        router.push({ name: 'chat-item', params: { id: detailsData.id } })

        chatStore.chats = detailsData
      } else {
        await addMessageInChat(messageInput, route.params.id)
      }
    } catch (error) { 
      console.error(error)
    } finally {
      chatInSubmission.value = false
      showSkeleton.value = false
    }
  }

  async function addMessageInChat(messageInput, chatId) {
    // If this ID is IN chat, then fetch
    if (chatId && chatStore.inChat(chatId)) {

      try {
        const { data: newMessageObj } = await axios.post('/api/chat/add/', {
          message: messageInput,
          chat_id: chatId
        }) as { data: ChatMessagesType }

        console.log('newMessageObj', newMessageObj)

        chatStore.getChatById(chatId).messages.push(newMessageObj)
      } catch (error) { 
        console.error(error)
      }
    } else {
      alert('A chat with this ID does not exist.')
      router.push({ name: "chat" })
    }
  }

  async function editChatMessage(chatId, messageId, newMessage) {
    if (!inChat(chatId)) return

    try {
      chatInSubmission.value = true
      await axios.post(`/api/chat/edit/${chatId}/`, {
        new_message: newMessage,
      })

      const chat = getChatById(chatId)
      const chatMessage = chat.messages.find(message => message.id === messageId)
      chat.message = newMessage
    } catch (error) {
      console.error(error)
    } finally {
      chatInSubmission.value = false
    }
  }

  async function deleteChat(chatId) {
    if (!inChat(chatId)) return

    try {
      chatInSubmission.value = true
      await axios.delete(`/api/chat/edit/${chatId}/`)
      // Create a new array without the deleted chat
      chats.value = chats.value.filter(chat => chat.id !== chatId)
    } catch (error) {
      console.error(error)
    } finally {
      chatInSubmission.value = false
    }
  }

  // Getters ============================

  function inChat(chatId: string) {
    if (!chatId) return
    return chats.value?.some(chat => chat.id === chatId)
  }

  function getChatById(chatId: string) {
    if (!inChat(chatId)) return
    return chats.value?.find(chat => chat.id === chatId)
  }

  async function getChatDetails() {
    try {
      const { data } = await axios.get('/api/chat/') as { data: ChatType }
      return data
    } catch (e) {
      console.error(e)
    }
  }

  return { 
    chats, chatInSubmission, 
    onMessageSubmition, addMessageInChat, deleteChat,
    inChat, getChatById, getChatDetails
  }
})