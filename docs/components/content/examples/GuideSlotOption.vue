<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'
import { books } from '~/assets/static/data'

const selected = ref(books[0])
</script>

<template>
  <VueSelect v-model="selected" :options="books" label="title">
    <template #option="{ title, author }">
      <strong>{{ title }}</strong>
      <br />
      <em>{{ author.firstName }} {{ author.lastName }}</em>
    </template>

    <template #selected-option="{ title, author }">
      <strong>{{ title }}</strong>
      <em style="margin-left: 0.5rem">by {{ author.firstName }} {{ author.lastName }}</em>
    </template>
  </VueSelect>
</template>

<style scoped>
/* The docs site's prose styles color <strong>; let it follow the option's color */
strong {
  color: inherit;
}
</style>
