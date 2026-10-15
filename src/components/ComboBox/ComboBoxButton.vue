<script setup lang="ts">

import { useComboBoxContext } from '@/keys'

const ctx = useComboBoxContext('ComboBoxButton')
</script>

<!--
  Toggle button for the dropdown. Out of the tab order (the input handles
  the keyboard), but available to pointer, touch and assistive tech, as in
  the WAI-ARIA APG editable combobox example. Focus moves to the input.
-->
<template>
  <button
    type="button"
    tabindex="-1"
    aria-haspopup="listbox"
    :aria-expanded="ctx.open.value"
    :aria-controls="`vs-${ctx.uid.value}-listbox`"
    :disabled="ctx.disabled.value || undefined"
    @click="ctx.toggleOpen(), ctx.focusInput()"
    @mousedown.prevent
  >
    <slot />
  </button>
</template>
