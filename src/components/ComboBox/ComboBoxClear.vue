<script setup lang="ts">
import { inject } from 'vue'
import { ComboBoxKey } from '@/keys'

const ctx = inject(ComboBoxKey)!
</script>

<template>
  <button
    v-show="!ctx.isValueEmpty.value && ctx.clearable.value"
    type="button"
    aria-label="Clear selection"
    @click="ctx.clearSelection()"
    @mousedown.prevent
  >
    <slot />
  </button>
</template>
