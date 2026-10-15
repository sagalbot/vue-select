---
title: "Infinite Scroll"
section: "v3 · Use Cases"
version: v3
---

Vue Select doesn't ship with first party support for infinite scroll, but it's possible to implement
by hooking into the `open`, `close`, and `search` events, along with the `filterable` prop, and the
`list-footer` slot.

Let's break down the example below, starting with the `data`.

- `observer` - a new `IntersectionObserver` with `infiniteScroll` set as the callback
- `limit` - the number of options to display
- `search` - since we've disabled Vue Selects filtering, we'll need to filter options ourselves

When Vue Select opens, the `open` event is emitted and `onOpen` will be called. We wait for
`$nextTick()` so that the `$ref` we need will exist, then begin observing it for intersection.

The observer is set to call `infiniteScroll` when the `<li>` is completely visible within the list.
Some fancy destructuring is done here to get the first `ObservedEntry`, and specifically the
`isIntersecting` & `target` properties. If the `<li>` is intersecting, we increase the `limit`, and
ensure that the scroll position remains where it was before the list size changed. Again, it's
important to wait for `$nextTick` here so that the DOM elements have been inserted before setting
the scroll position.

```vue
<template>
  <v-select
    :options="paginated"
    :filterable="false"
    @open="onOpen"
    @close="onClose"
    @search="(query) => (search = query)"
  >
    <template #list-footer>
      <li v-show="hasNextPage" ref="load" class="loader">
        Loading more options...
      </li>
    </template>
  </v-select>
</template>

<script>
import countries from '../data/countries'

export default {
  name: 'InfiniteScroll',
  data: () => ({
    observer: null,
    limit: 10,
    search: '',
  }),
  computed: {
    filtered() {
      return countries.filter((country) => country.includes(this.search))
    },
    paginated() {
      return this.filtered.slice(0, this.limit)
    },
    hasNextPage() {
      return this.paginated.length < this.filtered.length
    },
  },
  mounted() {
    /**
     * You could do this directly in data(), but since these docs
     * are server side rendered, IntersectionObserver doesn't exist
     * in that environment, so we need to do it in mounted() instead.
     */
    this.observer = new IntersectionObserver(this.infiniteScroll)
  },
  methods: {
    async onOpen() {
      if (this.hasNextPage) {
        await this.$nextTick()
        this.observer.observe(this.$refs.load)
      }
    },
    onClose() {
      this.observer.disconnect()
    },
    async infiniteScroll([{ isIntersecting, target }]) {
      if (isIntersecting) {
        const ul = target.offsetParent
        const scrollTop = target.offsetParent.scrollTop
        this.limit += 10
        await this.$nextTick()
        ul.scrollTop = scrollTop
      }
    },
  },
}
</script>

<style scoped>
.loader {
  text-align: center;
  color: #bbbbbb;
}
</style>
```
