<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const options = [
  { country: 'Canada', meta: { code: 'CA', provinces: 13 } },
  { country: 'United States', meta: { code: 'US', provinces: 50 } },
]

const selected = ref(null)
</script>

<template>
  <VueSelect
    v-model="selected"
    label="country"
    :options="options"
    :reduce="(country) => country.meta.code"
  />
  <pre>v-model value: {{ JSON.stringify(selected) }}</pre>
</template>

<style scoped>
pre {
  margin: 0.5rem 0 0;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
}
</style>
