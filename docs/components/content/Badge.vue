<script setup lang="ts">
withDefaults(defineProps<{ text: string; type?: 'tip' | 'primary' | 'warning' }>(), {
  type: 'tip',
})
</script>

<template>
  <span
    :class="[
      'ml-1 inline-block rounded-full px-2 py-0.5 align-middle font-sans text-xs font-medium',
      type === 'warning'
        ? 'bg-amber-100 text-amber-900 dark:bg-amber-400/10 dark:text-amber-400'
        : 'bg-sky-100 text-sky-900 dark:bg-sky-400/10 dark:text-sky-400',
    ]"
    >{{ text }}</span
  >
</template>
