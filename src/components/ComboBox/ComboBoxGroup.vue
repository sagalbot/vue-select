<script setup lang="ts">
import { useId } from 'vue'

withDefaults(
  defineProps<{
    label: string
    /** Element to render for the group, e.g. 'ul'. */
    as?: string
    /** Element to render for the header, e.g. 'li'. */
    labelAs?: string
  }>(),
  { as: 'div', labelAs: 'div' }
)

const labelId = `vs-group-${useId()}`
</script>

<template>
  <component :is="as" role="group" :aria-labelledby="labelId">
    <component :is="labelAs" :id="labelId" role="presentation">
      <slot name="label" :label="label">{{ label }}</slot>
    </component>
    <slot />
  </component>
</template>
