<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'
import { countries } from '~/assets/static/data'

const country = ref(null)

// No preventDefault, so focus still moves to the next field
const selectOnTab = (map, ctx) => ({
  ...map,
  Tab: () => {
    if (ctx.open.value) ctx.typeAheadSelect()
  },
})
</script>

<template>
  <VueSelect
    v-model="country"
    :options="countries"
    :map-keydown="selectOnTab"
    placeholder="Type, then press Tab"
  />
</template>
