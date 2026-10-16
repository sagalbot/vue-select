<script setup>
import VueSelect from '@/index'
import { books } from '~/assets/static/data'

function filter(options, search) {
  const query = search.toLocaleLowerCase()
  return options.filter(({ title, author }) =>
    [title, author.firstName, author.lastName].some((text) =>
      text.toLocaleLowerCase().includes(query)
    )
  )
}
</script>

<template>
  <VueSelect :options="books" label="title" :filter="filter" placeholder="Search by title or author">
    <template #option="{ title, author }">
      {{ title }}
      <br />
      <cite>{{ author.firstName }} {{ author.lastName }}</cite>
    </template>
  </VueSelect>
</template>
