<template>
  <v-select
    placeholder="Choose a book to read"
    label="title"
    :options="books"
    :selectable="option => ! option.author.lastName.includes('Woodhouse')"
  />
</template>
<script>
import books from '../data/books';
export default {
  computed: {
    books: () => books,
  }
}
</script>
