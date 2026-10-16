---
title: Pagination
section: Use Cases
description: Render a page of options at a time, with previous and next buttons in the list-footer slot.
---

Pagination helps with large sets of options. If you have 1,000 options, the component renders
1,000 DOM nodes, and chances are your user is only interested in a few of them.

To paginate, render one page of options at a time and put the controls in the `list-footer`
slot, which appears below the options in the dropdown.

Pagination has to work together with filtering, so the filtering moves into your component: turn
off Vue Select's own filtering with `:filterable="false"`, keep track of the search text with the
`search` event, and filter before you slice out the current page.

::guide-pagination
::

```vue
<script setup>
import { computed, ref } from 'vue'
import VueSelect from 'vue-select'
import { countries } from './data'

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
```

Clicking the buttons doesn't move focus out of the search input, so the dropdown stays open while
the user pages through the results.
