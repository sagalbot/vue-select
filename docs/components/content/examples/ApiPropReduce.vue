<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const options = [
  { code: 'CA', country: 'Canada' },
  { code: 'MX', country: 'Mexico' },
  { code: 'US', country: 'United States' },
]
const selected = ref('CA')
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="options"
    label="country"
    :reduce="(option) => option.code"
  />
  <p>Selected: <code>{{ JSON.stringify(selected) }}</code></p>
</template>
