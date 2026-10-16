<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'
import { countries } from '~/assets/static/data'

const people = ref([
  { name: 'John', country: null },
  { name: 'Jane', country: null },
])

const log = ref('')

function updateCountry(person, country) {
  person.country = country
  log.value = `${person.name}: ${country ?? 'cleared'}`
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Country</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="person in people" :key="person.name">
        <td>{{ person.name }}</td>
        <td>
          <VueSelect
            :model-value="person.country"
            :options="countries"
            :input-attrs="{ 'aria-label': `Country for ${person.name}` }"
            @update:model-value="(country) => updateCountry(person, country)"
          />
        </td>
      </tr>
    </tbody>
  </table>
  <pre>Last change: {{ log || 'none' }}</pre>
</template>

<style scoped>
table {
  display: table;
  width: 100%;
}
td:last-child {
  width: 70%;
}
pre {
  margin: 0.5rem 0 0;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
}
</style>
