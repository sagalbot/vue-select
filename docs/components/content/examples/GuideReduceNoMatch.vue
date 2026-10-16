<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const options = [
  { label: 'One', id: 1 },
  { label: 'Two', id: 2 },
]

// There is no option with the id 3
const selected = ref(3)
</script>

<template>
  <VueSelect v-model="selected" :options="options" :reduce="(option) => option.id" />
</template>
