<script setup lang="ts">
import { computed } from '#imports'

const props = withDefaults(
  defineProps<{
    type?: 'note' | 'warning'
    title?: string
  }>(),
  {
    type: 'note',
  },
)

const styles = computed(() => {
  return {
    note: {
      container: 'border-sky-400 bg-sky-50/60 dark:border-sky-500 dark:bg-slate-800/60',
      title: 'text-sky-900 dark:text-sky-400',
      body: 'text-sky-800 [--tw-prose-background:var(--color-sky-50)] prose-a:text-sky-900 prose-code:text-sky-900 dark:text-slate-300 dark:prose-code:text-slate-300',
    },
    warning: {
      container: 'border-amber-400 bg-amber-50/60 dark:border-amber-500 dark:bg-slate-800/60',
      title: 'text-amber-900 dark:text-amber-500',
      body: 'text-amber-800 [--tw-prose-underline:var(--color-amber-400)] [--tw-prose-background:var(--color-amber-50)] prose-a:text-amber-900 prose-code:text-amber-900 dark:text-slate-300 dark:[--tw-prose-underline:var(--color-sky-700)] dark:prose-code:text-slate-300',
    },
  }[props.type]
})
</script>

<template>
  <div :class="['my-6 rounded-r-lg border-l-4 px-4 py-3', styles.container]">
    <p v-if="title" :class="['not-prose m-0 text-sm font-semibold', styles.title]">
      {{ title }}
    </p>
    <div
      :class="[
        'prose prose-sm max-w-none [&>:first-child]:mt-0 [&>:last-child]:mb-0',
        title && 'mt-1',
        styles.body,
      ]"
    >
      <slot />
    </div>
  </div>
</template>
