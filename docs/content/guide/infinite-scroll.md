---
title: Infinite Scroll
section: Use Cases
description: Load more options as the user scrolls to the end of the dropdown, with an IntersectionObserver.
---

Vue Select doesn't ship with infinite scroll, but you can build it from the `open`, `close` and
`search` events, the `filterable` prop and the `list-footer` slot.

::guide-infinite-scroll
::

How it works:

- `limit` is the number of options to render, and `paginated` is the first `limit` options that
  match the search. Vue Select's own filtering is turned off with `:filterable="false"`, because
  the component filters the full list itself before slicing it.
- The `list-footer` slot renders a "Loading more options…" item after the options, as long as
  there are more to show. It has a template ref, `load`.
- When the dropdown opens, the `open` handler waits for the next tick, so the list has rendered,
  then starts observing `load` with an `IntersectionObserver`.
- When `load` scrolls into view, `infiniteScroll` raises `limit` by 10. It saves the list's scroll
  position first and restores it after the DOM updates, so the list doesn't jump.
- When the dropdown closes, the observer is disconnected. A new search resets `limit`.

```vue
<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import VueSelect from 'vue-select'
import { countries } from './data'

const limit = ref(10)
const search = ref('')
const load = useTemplateRef('load')
let observer

const filtered = computed(() =>
  countries.filter((country) =>
    country.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())
  )
)
const paginated = computed(() => filtered.value.slice(0, limit.value))
const hasNextPage = computed(() => paginated.value.length < filtered.value.length)

async function infiniteScroll([{ isIntersecting, target }]) {
  if (!isIntersecting) return
  const list = target.offsetParent
  const scrollTop = list.scrollTop
  limit.value += 10
  await nextTick()
  list.scrollTop = scrollTop
}

// IntersectionObserver doesn't exist during server rendering, so create it on mount
onMounted(() => (observer = new IntersectionObserver(infiniteScroll)))
onBeforeUnmount(() => observer?.disconnect())

async function onOpen() {
  if (!hasNextPage.value) return
  await nextTick()
  observer.observe(load.value)
}

function onClose() {
  observer.disconnect()
}

function onSearch(query) {
  search.value = query
  limit.value = 10
}
</script>

<template>
  <VueSelect
    :options="paginated"
    :filterable="false"
    @open="onOpen"
    @close="onClose"
    @search="onSearch"
  >
    <template #list-footer>
      <li v-show="hasNextPage" ref="load" class="loader">Loading more options…</li>
    </template>
  </VueSelect>
</template>

<style scoped>
.loader {
  text-align: center;
  color: #94a3b8;
}
</style>
```

Here the options are already in memory. To fetch pages from a server instead, request the next
page in `infiniteScroll` and append the results to your options; see [AJAX](/guide/ajax).
