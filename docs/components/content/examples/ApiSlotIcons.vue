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
    <template #open-indicator="{ attributes }">
      <span v-bind="attributes">🔽</span>
    </template>
    <template #clear>🗑️</template>
    <template #deselect="{ option }">
      <span :title="option.label">✖️</span>
    </template>
  </VueSelect>
</template>
