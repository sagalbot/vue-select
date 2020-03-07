<template>
  <v-select
    multiple
    placeholder="Choose up to 3 books!"
    label="title"
    v-model="selected"
    :options="books"
    :selectable="() => selected.length < 3"
  />
</template>
<script>
import books from '../data/books';
export default {
  data() {
    return { selected: [] }
  },
  computed: {
    books: () => books,
  }
}
</script>
