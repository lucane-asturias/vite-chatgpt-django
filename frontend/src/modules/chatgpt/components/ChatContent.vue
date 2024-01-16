<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useChatStore } from '../store/chatStore'
  import type { ChatMessagesType } from '../interfaces/ChatType'

  const route = useRoute()
  const chatStore = useChatStore()

  const props = defineProps<{ content: ChatType }>()

  const user = ref(true)
  const showCheckSVG = ref(false)
  const editInSubmission = ref(false)

  const isEditing = ref(false)
  const editedMessage = ref(props.content.message)

  const copyResponse = () => {
    if (showCheckSVG.value) return
    showCheckSVG.value = true
    const responseToCopy = props.content.response

    navigator.clipboard.writeText(responseToCopy)
      .then(() => console.log('Text copied to clipboard:', responseToCopy))
      .catch((error) => console.error('Unable to copy text to clipboard', error))

    setTimeout(() => showCheckSVG.value = false, 3000)
  }

  const startEditing = () => isEditing.value = true
  const cancelEditing = () => {
    editedMessage.value = props.content.message
    isEditing.value = false
  }
  const toggleSubmission = () => editInSubmission.value = !editInSubmission.value

  const saveEditedChatMessage = async () => {
    if (props.content.message === editedMessage.value) return

    toggleSubmission()
  
    await chatStore.editChatMessage(
      route.params.id, 
      props.content.message.id, 
      editedMessage.value
    )
    cancelEditing()
    toggleSubmission()
  }
</script>

<template>
  <div class="w-full flex py-6" style="background-color: #343541;">
    <!-- User Message SVG -->
    <div class="w-1/6 flex flex-col items-end pr-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-10 h-10 text-indigo-400"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 
          0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" 
        />
      </svg>
    </div>
    <div class="w-4/6 flex flex-col pl-4">
      <!-- User Message -->
      <section class="message-container tracking-wide">
        <div class="message pl-1.5" v-if="!isEditing" v-text="content.message" />
        <!-- Edit mode -->
        <div v-else>
          <div class="flex flex-row my-2">
            <textarea 
              rows="4" cols="63"
              class="border-0 rounded px-3 ml-2 focus:outline-none"
              v-model="editedMessage"
              style="background-color: #485261;"
            />
            <div class="ml-auto flex flex-col">
              <button @click="cancelEditing" class="bg-red-500 text-white mb-3 px-2 py-1 mr-2">Cancel</button>
              <button 
                class="bg-green-600 text-white mb-4 px-2 py-1 mr-2"
                @click="saveEditedChatMessage"
                :disabled="editInSubmission"
              >Save</button>
            </div>
          </div>
        </div>
      </section>
    </div>
    <!-- Edit icon for User 1 -->
    <div class="flex flex-row justify-end mt-2 ml-5" v-if="!isEditing">
      <span class="cursor-pointer mr-2" @click="startEditing">
        <!-- Edit SVG icon for User 1  -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 hover:text-yellow-500">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      </span>
    </div>
  </div>
  <div class="w-full flex py-6" style="background-color: #444654;">
    <div class="w-1/6 flex flex-col items-end pr-4">
      <!-- Response SVG -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-10 h-10 text-amber-500"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 
          0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a 5.969 5.969 
          0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" 
        />
      </svg>
    </div>
    <div class="w-4/6 flex flex-col pl-4">
      <!-- Response Message -->
      <section class="message-container tracking-wide">
        <div class="message pl-1.5" v-text="content.response" />
      </section>
    </div>
    <!-- Copy Response Message -->
    <div class="flex flex-row justify-end mt-2 ml-5">
      <span 
        class="mr-2" 
        :class="{ 'cursor-pointer': !showCheckSVG }" 
        @click="copyResponse"
      >
        <!-- Copy SVG icon -->
        <svg
          v-if="!showCheckSVG" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="1.5" 
          stroke="currentColor" 
          class="w-4 h-4 hover:text-gray-400"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" 
          />
        </svg>
        <!-- Check SVG -->
        <svg 
          v-else
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" viewBox="0 0 24 24" 
          stroke-width="1.5" 
          stroke="currentColor" 
          class="w-4 h-4 hover:text-gray-400"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M4.5 12.75l6 6 9-13.5" 
          />
        </svg>
      </span>
    </div>
  </div>
</template>


<style scoped>
.message-container {
  background-color: #485261; /* Background color for messages */
  color: white; /* Text color for messages */
  padding: 8px; /* Adjust padding as needed */
  border-radius: 8px; /* Rounded corners for messages */
  margin-bottom: 8px; /* Spacing between messages */
}
</style>
