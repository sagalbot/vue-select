<script setup lang="ts">
import { computed } from '#imports'

const props = withDefaults(
  defineProps<{
    type?: 'note' | 'warning'
    title: string
  }>(),
  {
    type: 'note',
  },
)

const styles = computed(() => {
  return {
    note: {
      container:
        'bg-sky-50 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10',
      title: 'text-sky-900 dark:text-sky-400',
      body: 'text-sky-800 [--tw-prose-background:var(--color-sky-50)] prose-a:text-sky-900 prose-code:text-sky-900 dark:text-slate-300 dark:prose-code:text-slate-300',
    },
    warning: {
      container:
        'bg-amber-50 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10',
      title: 'text-amber-900 dark:text-amber-500',
      body: 'text-amber-800 [--tw-prose-underline:var(--color-amber-400)] [--tw-prose-background:var(--color-amber-50)] prose-a:text-amber-900 prose-code:text-amber-900 dark:text-slate-300 dark:[--tw-prose-underline:var(--color-sky-700)] dark:prose-code:text-slate-300',
    },
  }[props.type]
})
</script>

<template>
  <div :class="['my-8 flex rounded-3xl p-6', styles.container]">
    <!--    <IconComponent class="h-8 w-8 flex-none" />-->
    <div class="ml-4 flex-auto">
      <p :class="['m-0 font-display font-bold text-xl', styles.title]">
        {{ title }}
      </p>
      <div :class="['prose mt-2.5', styles.body]">
        <slot />
      </div>
    </div>
  </div>
</template>
