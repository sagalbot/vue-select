<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const selected = ref(['Canada', 'Mexico'])
</script>

<template>
  <VueSelect v-model="selected" multiple :options="['Canada', 'United States', 'Mexico']">
    <template #open-indicator="{ attributes }">
      <span v-bind="attributes">🔽</span>
    </template>
    <template #clear>🗑️</template>
    <template #deselect>❌</template>
  </VueSelect>
</template>
