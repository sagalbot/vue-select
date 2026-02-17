<script setup lang="ts">
import { ref, watch } from 'vue'
import ComboBox from '@/components/ComboBox/ComboBox.vue'
import ComboBoxInput from '@/components/ComboBox/ComboBoxInput.vue'
import ComboBoxMenu from '@/components/ComboBox/ComboBoxMenu.vue'
import ComboBoxButton from '@/components/ComboBox/ComboBoxButton.vue'
import type { VueSelectOption } from '@/types'

const props = defineProps<{
  modelValue: unknown
  label: (value: VueSelectOption) => string
}>()

const emits = defineEmits(['update:modelValue'])

const value = ref(props.modelValue)

watch(value, (newValue) => emits('update:modelValue', newValue))
</script>

<template>
  <ComboBox v-model="value" class="w-64 relative">
    <div class="flex border border-gray-500 rounded">
      <ComboBoxInput v-bind="{ label }" class="pl-2 py-1 border-none rounded" />
      <ComboBoxButton as="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
          />
        </svg>
      </ComboBoxButton>
    </div>

    <ComboBoxMenu
      class="absolute z-50 bg-white inset-0 top-12 w-full h-64 overflow-y-scroll space-y-1 border rounded"
    >
      <slot></slot>
    </ComboBoxMenu>
  </ComboBox>
</template>
