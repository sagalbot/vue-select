<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const selected = ref(['Canada'])
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="['Canada', 'Mexico', 'United States']"
    multiple
  >
    <template #header>
      <strong>Countries</strong>
    </template>
    <template #footer="{ deselect }">
      <small>
        {{ selected.length }} selected
        <button
          v-if="selected.length"
          type="button"
          @click="deselect(selected[selected.length - 1])"
        >
          Remove last
        </button>
      </small>
    </template>
  </VueSelect>
</template>

<style scoped>
button {
  margin: 0.5rem 0.5rem 0.5rem 0;
  padding: 0.125rem 0.75rem;
  border: 1px solid currentColor;
  border-radius: 4px;
}
</style>
