<script setup>
import { computed, ref } from 'vue'
import VueSelect from '@/index'
import { countries } from '~/assets/static/data'

const search = ref('')
const offset = ref(0)
const limit = 10

const filtered = computed(() =>
  countries.filter((country) =>
    country.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())
  )
)
const paginated = computed(() => filtered.value.slice(offset.value, offset.value + limit))
const hasPrevPage = computed(() => offset.value > 0)
const hasNextPage = computed(() => offset.value + limit < filtered.value.length)

function onSearch(query) {
  search.value = query
  offset.value = 0
}
</script>

<template>
  <VueSelect :options="paginated" :filterable="false" @search="onSearch">
    <template #list-footer>
      <li class="pagination">
        <button type="button" :disabled="!hasPrevPage" @click="offset -= limit">Prev</button>
        <button type="button" :disabled="!hasNextPage" @click="offset += limit">Next</button>
      </li>
    </template>
  </VueSelect>
</template>

<style scoped>
.pagination {
  display: flex;
  gap: 0.25rem;
  margin: 0.25rem 0.25rem 0;
}
.pagination button {
  flex-grow: 1;
  padding: 0.25rem;
  border: 1px solid var(--vs-border-color);
  border-radius: var(--vs-border-radius);
  cursor: pointer;
}
.pagination button:disabled {
  cursor: default;
  opacity: 0.5;
}
</style>
