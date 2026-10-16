<script setup>
import VueSelect from '@/index'
</script>

<template>
  <VueSelect :options="['A', 'B', 'C', 'D']">
    <template #search="{ attributes, events }">
      <input maxlength="1" v-bind="attributes" v-on="events" />
    </template>
  </VueSelect>
</template>
