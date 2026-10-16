<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const options = [
  { label: 'Small', inStock: true },
  { label: 'Medium', inStock: false },
  { label: 'Large', inStock: true },
  { label: 'Extra Large', inStock: false },
]
const size = ref(null)
</script>

<template>
  <VueSelect
    v-model="size"
    :options="options"
    :selectable="(option) => option.inStock"
  />
</template>
