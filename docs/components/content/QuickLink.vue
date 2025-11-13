<script setup lang="ts">
defineProps<{
  icon: string
  href: string
  title: string
}>()
</script>

<template>
  <div
    class="group relative rounded-xl border border-slate-200 dark:border-slate-800"
  >
    <div
      class="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,var(--color-sky-50)),var(--quick-links-hover-bg,var(--color-sky-50)))_padding-box,linear-gradient(to_top,var(--color-indigo-400),var(--color-cyan-400),var(--color-sky-500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:var(--color-slate-800)]"
    />
    <div class="relative overflow-hidden rounded-xl p-6">
      <slot name="icon" />
      <h2
        class="mt-4 font-display font-bold text-base text-slate-900 dark:text-white"
      >
        <NuxtLink :to="href">
          <span class="absolute -inset-px rounded-xl" />
          {{ title }}
        </NuxtLink>
      </h2>
      <p class="mt-1 text-sm text-slate-700 dark:text-slate-400">
        <slot mdc-unwrap="p" />
      </p>
    </div>
  </div>
</template>
