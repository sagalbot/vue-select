<script setup>
import { useTemplateRef } from 'vue'
import VueSelect from '@/index'
import { countries } from '~/assets/static/data'

const select = useTemplateRef('select')

function openSelect() {
  select.value.focus()
  select.value.open = true
}
</script>

<template>
  <div class="row">
    <VueSelect ref="select" :options="countries" class="grow" />
    <button type="button" @click="openSelect">Choose a country</button>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.grow {
  flex: 1;
}
button {
  padding: 0.35rem 0.75rem;
  border: 1px solid currentColor;
  border-radius: 4px;
  font-size: 0.9em;
  white-space: nowrap;
}
</style>
