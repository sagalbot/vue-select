<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const options = [
  { id: 1, label: 'Canada' },
  { id: 2, label: 'Mexico' },
  { id: 3, label: 'United States' },
]
const selected = ref([options[0], options[1]])
</script>

<template>
  <VueSelect v-model="selected" :options="options" multiple>
    <template #selected-option-container="{ option, deselect, disabled }">
      <span class="vs__selected">
        {{ option.label }}
        <button
          type="button"
          class="vs__deselect"
          :disabled="disabled"
          :aria-label="`Remove ${option.label}`"
          @click="deselect(option)"
        >
          (remove)
        </button>
      </span>
    </template>
  </VueSelect>
</template>
