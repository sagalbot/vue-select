<script setup lang="ts">
import { inject } from 'vue'
import { ComboBoxKey } from '@/keys'

const ctx = inject(ComboBoxKey)
if (!ctx) throw new Error('ComboBoxClear must be used inside a ComboBox component')
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
