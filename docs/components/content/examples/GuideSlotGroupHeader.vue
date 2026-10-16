<script setup>
import VueSelect from '@/index'

const options = [
  { label: 'Apple', type: 'Fruit' },
  { label: 'Banana', type: 'Fruit' },
  { label: 'Carrot', type: 'Vegetable' },
  { label: 'Cherry', type: 'Fruit' },
  { label: 'Broccoli', type: 'Vegetable' },
]
</script>

<template>
  <VueSelect :options="options" :group-by="(option) => option.type">
    <template #group-header="{ label, options }">
      {{ label }} ({{ options.length }})
    </template>
  </VueSelect>
</template>
