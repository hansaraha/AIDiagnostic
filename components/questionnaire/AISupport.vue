<template>
  <QuestionCard title="¿Qué tipo de apoyo necesitas ahora mismo?" buttonText="CONTINUAR" :disabled="!model"
    @next="$emit('next')">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
      <div v-for="option in aiSupportNeedOptions" :key="option.value"
        class="border rounded-lg p-3 cursor-pointer border-[#5D49F6]"
        :class="model === option.value ? 'bg-[#5D49F6] bg-opacity-10 dark:bg-opacity-20' : 'border-[#5D49F6]'"
        @click="selectOption(option.value)">
        <div class="flex items-center space-x-3 p-3 sm:p-4 w-full">
          <div class="flex-shrink-0 text-2xl">{{ option.label.split(' ')[0] }}</div>
          <div class="flex-1">
            <span class="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
              {{ option.label.substring(option.label.indexOf(' ') + 1) }}
            </span>
          </div>
          <div v-if="model === option.value" class="flex-shrink-0 text-indigo-600 dark:text-indigo-400">
            <UIcon name="heroicons-check-circle" class="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  </QuestionCard>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import useOptionsData from "~/composables/useOptionsData";
import type { AISupportNeed } from "~/types/questionnaire";
import QuestionCard from "../ui/QuestionCard.vue";

const props = defineProps<{
  modelValue: AISupportNeed | undefined;
}>();
const emit = defineEmits(["update:modelValue", "next"]);

const model = ref<AISupportNeed | undefined>(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    model.value = val;
  }
);

watch(
  () => model.value,
  (val) => {
    emit("update:modelValue", val);
  }
);

const { aiSupportNeedOptions } = useOptionsData();

function selectOption(value: AISupportNeed) {
  model.value = value;
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid>div {
  animation: fadeIn 0.3s ease-out;
}

.grid>div:nth-child(2n) {
  animation-delay: 0.05s;
}

.grid>div:nth-child(3n) {
  animation-delay: 0.1s;
}

.grid>div:nth-child(4n) {
  animation-delay: 0.15s;
}
</style>