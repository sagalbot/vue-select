<script setup lang="ts">
import { computed, useAttrs } from '#imports'
import { NuxtLink } from '#components'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary'
  }>(),
  {
    variant: 'primary',
  }
)

const styles = computed(
  () =>
    ({
      primary:
        'rounded-full bg-sky-300 py-2 px-4 text-sm font-semibold text-slate-900 hover:bg-sky-200 focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/50 active:bg-sky-500',
      secondary:
        'rounded-full bg-slate-800 py-2 px-4 text-sm font-medium text-white hover:bg-slate-700 focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 active:text-slate-400',
    }[props.variant])
)

const hasTo = computed<boolean>(() => Object.keys(useAttrs()).includes('to'))

const component = computed(() => (hasTo.value ? NuxtLink : 'button'))
</script>

<template>
  <Component :is="component" :class="styles"><slot></slot></Component>
</template>
