<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const emails = ref([])

const handlers = (map, ctx) => ({
  ...map,
  '@': (e) => {
    if (!ctx.search.value || ctx.search.value.includes('@')) return
    e.preventDefault()
    ctx.setSearch(`${ctx.search.value}@gmail.com`)
  },
})
</script>

<template>
  <VueSelect
    v-model="emails"
    taggable
    multiple
    placeholder="Type a name, then @"
    :map-keydown="handlers"
  />
</template>
