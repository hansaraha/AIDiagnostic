<template>
    <div class="container mx-auto px-4 pt-4">
      <div class="h-2.5 w-full bg-slate-200 rounded">
        <div class="h-2.5 bg-indigo-900 rounded" :style="{ width: `${progress}%` }"></div>
      </div>
      <div class="text-right text-sm text-gray-500 mt-1">
        {{ sectionText }}
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