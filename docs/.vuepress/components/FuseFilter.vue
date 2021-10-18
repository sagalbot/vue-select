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
