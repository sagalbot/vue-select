<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const options = [
  { code: 'CA', label: 'Canada', flag: '🇨🇦' },
  { code: 'MX', label: 'Mexico', flag: '🇲🇽' },
  { code: 'US', label: 'United States', flag: '🇺🇸' },
]
const selected = ref(null)
</script>

<template>
  <VueSelect v-model="selected" :options="options">
    <template #option="{ label, code, flag }">
      {{ flag }} {{ label }} <small>({{ code }})</small>
    </template>
    <template #selected-option="{ label, flag }">
      {{ flag }} {{ label }}
    </template>
  </VueSelect>
</template>
