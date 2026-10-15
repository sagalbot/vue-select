<script setup lang="ts">

import { useComboBoxContext } from '../../keys'

const ctx = useComboBoxContext('ComboBoxClear')
</script>

<template>
  <button
    v-show="!ctx.isValueEmpty.value && ctx.clearable.value"
    type="button"
    aria-label="Clear selection"
    @click="ctx.clearSelection(), ctx.focusInput()"
    @mousedown.prevent
  >
    <slot />
  </button>
</template>
