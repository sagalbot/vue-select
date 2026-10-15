<script setup>
import { ref, useTemplateRef } from 'vue'
import VueSelect from '@/index'

const select = useTemplateRef('select')
const selected = ref(null)

function open() {
  select.value.focus()
  select.value.open = true
}
</script>

<template>
  <p>
    <!-- mousedown.prevent keeps focus in the select while clicking -->
    <button type="button" @mousedown.prevent @click="open">Open</button>
    <button type="button" @mousedown.prevent @click="select.select('Mexico')">
      Select Mexico
    </button>
    <button type="button" @mousedown.prevent @click="select.clearSelection()">
      Clear
    </button>
  </p>
  <VueSelect
    ref="select"
    v-model="selected"
    :options="['Canada', 'Mexico', 'United States']"
  />
</template>

<style scoped>
button {
  margin: 0.5rem 0.5rem 0.5rem 0;
  padding: 0.125rem 0.75rem;
  border: 1px solid currentColor;
  border-radius: 4px;
}
</style>
