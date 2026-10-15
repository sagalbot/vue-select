<script setup>
import VueSelect from '@/index'
import { books } from '~/assets/static/data'
</script>

<template>
  <VueSelect
    placeholder="Choose a book to read"
    label="title"
    :options="books"
    :selectable="(book) => book.author.lastName !== 'Woodhouse'"
  >
    <template #option="{ title, author }">
      {{ title }} <em style="opacity: 0.7">({{ author.lastName }})</em>
    </template>
  </VueSelect>
</template>
