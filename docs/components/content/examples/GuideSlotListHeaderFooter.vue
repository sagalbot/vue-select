<script setup>
import VueSelect from '@/index'
import { countries } from '~/assets/static/data'
</script>

<template>
  <VueSelect :options="countries">
    <template #list-header="{ filteredOptions }">
      <li class="note">{{ filteredOptions.length }} countries</li>
    </template>
    <template #list-footer>
      <li class="note">Can't find yours? Contact us.</li>
    </template>
  </VueSelect>
</template>

<style scoped>
.note {
  padding: 0.25rem 1.25rem;
  font-size: 0.85em;
  opacity: 0.7;
  text-align: center;
}
</style>
