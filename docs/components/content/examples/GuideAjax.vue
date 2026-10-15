<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'
import { countriesAndCodes } from '~/assets/static/data'

// Stands in for a real API: resolves with matching countries after 500ms.
function fetchCountries(query) {
  return new Promise((resolve) => {
    const q = query.toLocaleLowerCase()
    const results = countriesAndCodes.filter(({ label }) =>
      label.toLocaleLowerCase().includes(q)
    )
    setTimeout(() => resolve(results.slice(0, 20)), 500)
  })
}

const options = ref([])
const country = ref(null)
let timer
let latest = 0

function onSearch(search, loading) {
  clearTimeout(timer)
  if (!search) {
    latest++ // discard a request that's still in flight
    loading(false)
    return
  }
  loading(true)
  // Wait until the user pauses typing
  timer = setTimeout(async () => {
    const request = ++latest
    const results = await fetchCountries(search)
    // Ignore responses that arrive after a newer request
    if (request !== latest) return
    options.value = results
    loading(false)
  }, 300)
}
</script>

<template>
  <VueSelect
    v-model="country"
    :options="options"
    :filterable="false"
    placeholder="Search for a country"
    @search="onSearch"
  >
    <template #no-options="{ search }">
      {{ search ? `No countries match "${search}".` : 'Start typing to search.' }}
    </template>
  </VueSelect>
  <pre>v-model value: {{ JSON.stringify(country) }}</pre>
</template>

<style scoped>
pre {
  margin: 0.5rem 0 0;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
}
</style>
