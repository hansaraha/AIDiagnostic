<template>
  <div class="w-full">
    <div class="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div 
        class="h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all duration-300 ease-in-out" 
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
    <div class="flex justify-between items-center mt-1">
      <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        {{ sectionText }}
      </div>
      <div class="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400">
        {{ Math.round(progress) }}%
      </div>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  defineProps({
    progress: {
      type: Number,
      required: true
    },
    sectionText: {
      type: String,
      required: true
    }
  });
  </script>