<template>
  <QuestionCard title="¿Qué obstáculos encuentras al utilizar IA en tu trabajo? (Selecciona los principales)"
    buttonText="CONTINUAR" :disabled="!model.length" @next="$emit('next')">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
      <div v-for="option in aiObstacleOptions" :key="option.value"
        class="border rounded-lg p-3 cursor-pointer border-[#5D49F6]"
        :class="model.includes(option.value) ? 'bg-[#5D49F6] bg-opacity-10 dark:bg-opacity-20' : 'border-[#5D49F6]'"
        @click="toggleOption(option.value)">
        <div class="flex items-center space-x-3 p-3 sm:p-4 w-full">
          <div class="flex-shrink-0 text-2xl">{{ option.label.split(' ')[0] }}</div>
          <div class="flex-1">
            <span class="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
              {{ option.label.substring(option.label.indexOf(' ') + 1) }}
            </span>
          </div>
          <div v-if="model.includes(option.value)" class="flex-shrink-0 text-indigo-600 dark:text-indigo-400">
            <UIcon name="heroicons-check-circle" class="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="model.includes('other')" class="mt-4">
      <UFormGroup label="Otro obstáculo (especificar)" class="mb-0">
        <UInput v-model="otherValue" placeholder="Describe el obstáculo" size="lg" class="w-full" />
      </UFormGroup>
    </div>
  </QuestionCard>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import useOptionsData from "~/composables/useOptionsData";
import type { AIObstacle } from "~/types/questionnaire";
import QuestionCard from "../ui/QuestionCard.vue";

const props = defineProps<{
  modelValue: AIObstacle[] | undefined;
  otherValue?: string;
}>();
const emit = defineEmits(["update:modelValue", "update:otherValue", "next"]);

const model = ref<AIObstacle[]>(props.modelValue || []);
const otherValue = ref(props.otherValue || "");

watch(
  () => props.modelValue,
  (val) => {
    model.value = val || [];
  }
);

watch(
  () => model.value,
  (val) => {
    emit("update:modelValue", val);
  }
);

watch(
  () => otherValue.value,
  (val) => {
    emit("update:otherValue", val);
  }
);

const { aiObstacleOptions } = useOptionsData();

function toggleOption(value: AIObstacle) {
  if (model.value.includes(value)) {
    model.value = model.value.filter((v) => v !== value);
  } else {
    model.value = [...model.value, value];
  }
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