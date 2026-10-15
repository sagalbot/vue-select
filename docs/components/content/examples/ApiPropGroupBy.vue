<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const options = [
  { label: 'Apple', type: 'Fruit' },
  { label: 'Banana', type: 'Fruit' },
  { label: 'Carrot', type: 'Vegetable' },
  { label: 'Cherry', type: 'Fruit' },
  { label: 'Potato', type: 'Vegetable' },
  { label: 'Water' },
]
const selected = ref(null)
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="options"
    :group-by="(option) => option.type"
  />
</template>
