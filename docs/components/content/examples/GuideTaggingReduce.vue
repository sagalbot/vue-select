<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const books = ref([
  { id: 1, title: "Old Man's War" },
  { id: 2, title: 'The Lock Artist' },
])

const selected = ref([1])

const createBook = (title) => ({ id: `new:${title}`, title })
</script>

<template>
  <VueSelect
    v-model="selected"
    taggable
    multiple
    label="title"
    :options="books"
    :create-option="createBook"
    :reduce="(book) => book.id"
    @option:created="(book) => books.push(book)"
  />
  <pre>v-model value: {{ JSON.stringify(selected) }}</pre>
</template>

<style scoped>
pre {
  margin: 0.5rem 0 0;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
}
</style>
