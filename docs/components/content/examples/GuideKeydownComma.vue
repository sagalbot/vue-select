<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const tags = ref([])
</script>

<template>
  <VueSelect
    v-model="tags"
    taggable
    multiple
    placeholder="Type a tag, then press comma or Enter"
    :map-keydown="(map) => ({ ...map, ',': map.Enter })"
  />
</template>
