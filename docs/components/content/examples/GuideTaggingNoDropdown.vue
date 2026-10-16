<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const tags = ref(['vue', 'select'])
</script>

<template>
  <VueSelect
    v-model="tags"
    taggable
    multiple
    :open="false"
    :map-keydown="(map) => ({ ...map, ',': map.Enter })"
    placeholder="Type a tag, then press Enter or comma"
  />
  <pre>v-model value: {{ JSON.stringify(tags) }}</pre>
</template>

<style scoped>
pre {
  margin: 0.5rem 0 0;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
}
</style>
