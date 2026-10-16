---
title: "Option Filtering"
section: "v3 · Customizing"
version: v3
---

Vue Select provides two props accepting `functions` that can be used to implement custom filtering
algorithms.

- `filter` :badge{text="v2.5.0+"}
- `filterBy` :badge{text="v2.5.0+"}

By default, the component will perform a very basic check to see if an options label includes
the current search text. If you're using scoped slots, you might have information within the
option templates that should be searchable. Or maybe you just want a better search algorithm that
can do fuzzy search matching.

## Filtering with Fuse.js

You can use the `filter` and `filterBy` props to hook right into something like
[Fuse.js](https://fusejs.io/) that can handle searching multiple object keys with fuzzy matchings.

```vue
<template>
  <v-select
    :filter="fuseSearch"
    :options="books"
    :get-option-label="(option) => option.title"
  >
    <template #option="{ author, title }">
      {{ title }}
      <br />
      <cite>{{ author.firstName }} {{ author.lastName }}</cite>
    </template>
  </v-select>
</template>

<script>
import Fuse from 'fuse.js'
import books from '../data/books'

export default {
  computed: {
    books: () => books,
  },
  methods: {
    fuseSearch(options, search) {
      const fuse = new Fuse(options, {
        keys: ['title', 'author.firstName', 'author.lastName'],
        shouldSort: true,
      })
      return search.length
        ? fuse.search(search).map(({ item }) => item)
        : fuse.list
    },
  },
}
</script>
```
