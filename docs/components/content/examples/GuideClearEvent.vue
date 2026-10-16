<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const selected = ref(['Canada', 'Mexico'])
const log = ref([])

function record(entry) {
  log.value = [entry, ...log.value].slice(0, 5)
}
</script>

<template>
  <VueSelect
    v-model="selected"
    multiple
    :options="['Canada', 'United States', 'Mexico']"
    @option:deselected="(option) => record(`option:deselected ${option}`)"
    @clear="record('clear')"
  />
  <pre>{{ log.length ? log.join('\n') : 'Remove a value or press the clear button' }}</pre>
</template>

<style scoped>
pre {
  margin: 0.5rem 0 0;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  min-height: 2.5rem;
}
</style>
