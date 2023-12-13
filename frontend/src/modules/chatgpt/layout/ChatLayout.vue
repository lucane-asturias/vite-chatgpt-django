<template>
  <div class="sm:flex"> <!-- Flex for small screens and above -->
    <!-- Chat List (Drawer) on the left (1/5 width on large screens) -->
    <aside class="w-full w-1/6 sm:w-1/3 md:w-1/4 p-3" style="background-color: #202123">
      <div>
        <slot name="aside" />
      </div>
    </aside>

    <!-- Chat Content -->
    <main class="w-full relative flex flex-col">
      <!-- Chat List (messages) -->
      <div style="background-color: #343541;">
        <slot name="chat" />
      </div>

      <!-- Chat Form at the Bottom -->
      <div class="absolute bottom-0 left-0 right-0 flex items-center justify-center shadow-2xl sm:h-28 bg-transparent">
        <slot name="form" />
      </div>
    </main>
  </div>
</template>
