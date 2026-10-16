<script setup>
import VueSelect from '@/index'

const options = ['Canada', 'Mexico', 'United States', 'Brazil', 'Argentina']
</script>

<template>
  <VueSelect :options="options">
    <template #list-header="{ searching, filteredOptions }">
      <li class="vs__dropdown-option" style="opacity: 0.7">
        <template v-if="searching">
          {{ filteredOptions.length }} of {{ options.length }} match
        </template>
        <template v-else>Type to filter</template>
      </li>
    </template>
    <template #list-footer>
      <li class="vs__dropdown-option" style="opacity: 0.7">End of the list</li>
    </template>
  </VueSelect>
</template>
