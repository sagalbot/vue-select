<script setup>
import VueSelect from '@/index'
</script>

<template>
  <VueSelect loading>
    <template #spinner="{ loading }">
      <span v-if="loading" class="loading">Loading…</span>
    </template>
  </VueSelect>
</template>

<style scoped>
.loading {
  align-self: center;
  margin-right: 0.25rem;
  font-size: 0.8em;
  opacity: 0.7;
}
</style>
