<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const recipients = ref([])

function createOption(text) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
    throw new Error('Not an email address')
  }
  return text.toLowerCase()
}
</script>

<template>
  <VueSelect
    v-model="recipients"
    taggable
    multiple
    :create-option="createOption"
    placeholder="Add email addresses"
  >
    <template #no-options="{ search }">
      <template v-if="search">Keep typing: "{{ search }}" isn't an email address yet.</template>
      <template v-else>Type an email address.</template>
    </template>
  </VueSelect>
</template>
