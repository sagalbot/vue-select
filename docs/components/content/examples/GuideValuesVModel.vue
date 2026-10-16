<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const options = [
  { label: 'Canada', code: 'CA' },
  { label: 'United States', code: 'US' },
  { label: 'Mexico', code: 'MX' },
]

const single = ref(null)
const multiple = ref([])
</script>

<template>
  <div class="guide-demo-grid">
    <div>
      <VueSelect v-model="single" :options="options" placeholder="Single" />
      <pre>single: {{ JSON.stringify(single) }}</pre>
    </div>
    <div>
      <VueSelect v-model="multiple" multiple :options="options" placeholder="Multiple" />
      <pre>multiple: {{ JSON.stringify(multiple) }}</pre>
    </div>
  </div>
</template>

<style scoped>
.guide-demo-grid {
  display: grid;
  gap: 1rem;
}
pre {
  margin: 0.5rem 0 0;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  white-space: pre-wrap;
}
</style>
