<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'
import { books } from '~/assets/static/data'

const selected = ref([])
</script>

<template>
  <VueSelect
    v-model="selected"
    multiple
    placeholder="Choose up to 3 books!"
    label="title"
    :options="books"
    :selectable="() => selected.length < 3"
  />
</template>
