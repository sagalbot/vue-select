<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const selected = ref(['Canada', 'Mexico'])
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="['Canada', 'Mexico', 'United States']"
    multiple
  >
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
