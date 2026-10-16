<script setup>
import VueSelect from '@/index'
</script>

<template>
  <VueSelect :options="['Canada', 'Mexico', 'United States']">
    <template #no-options="{ search }">
      No countries match <em>{{ search }}</em>.
    </template>
  </VueSelect>
</template>
