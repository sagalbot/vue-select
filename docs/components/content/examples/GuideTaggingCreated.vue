<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const options = ref(['Vue', 'React', 'Svelte'])
const selected = ref([])
</script>

<template>
  <VueSelect
    v-model="selected"
    taggable
    multiple
    :options="options"
    placeholder="Type a framework and press Enter"
    @option:created="(tag) => options.push(tag)"
  />
  <pre>options: {{ JSON.stringify(options) }}</pre>
</template>

<style scoped>
pre {
  margin: 0.5rem 0 0;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  white-space: pre-wrap;
}
</style>
