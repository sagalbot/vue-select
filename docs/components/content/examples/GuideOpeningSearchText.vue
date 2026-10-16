<script setup>
import { ref, useTemplateRef } from 'vue'
import VueSelect from '@/index'
import { countries } from '~/assets/static/data'

const select = useTemplateRef('select')
const country = ref(null)

// Whether the component asked to open: typing, arrow keys, the toggle button...
const requested = ref(false)
</script>

<template>
  <VueSelect
    ref="select"
    v-model="country"
    :options="countries"
    :open="requested && (country !== null || !!select?.search)"
    placeholder="Start typing a country"
    @update:open="(value) => (requested = value)"
    @search:blur="requested = false"
  />
</template>
