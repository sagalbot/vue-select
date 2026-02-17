<script setup lang="ts">
import { inject } from 'vue'
import { ComboBoxKey } from '@/keys'

const ctx = inject(ComboBoxKey)
if (!ctx) throw new Error('ComboBoxButton must be used inside a ComboBox component')
</script>

<template>
  <button
    type="button"
    aria-haspopup="listbox"
    :aria-expanded="String(ctx.open.value)"
    :aria-controls="`vs-${ctx.uid.value}-listbox`"
    :disabled="ctx.disabled.value || undefined"
    @click="ctx.toggleOpen()"
    @mousedown.prevent
  >
    <slot />
  </button>
</template>
