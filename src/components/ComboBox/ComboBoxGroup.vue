<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  label: string
}>()

const labelId = `vs-group-${useId()}`
</script>

<template>
  <div role="group" :aria-labelledby="labelId">
    <div :id="labelId" role="presentation">
      <slot name="label" :label="label">{{ label }}</slot>
    </div>
    <slot />
  </div>
</template>
