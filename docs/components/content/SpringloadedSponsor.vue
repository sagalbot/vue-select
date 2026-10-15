<script setup lang="ts">
import SpringloadedLogo from '~/assets/svg/springloaded-logo.svg'
</script>

<template>
  <a
    href="https://springloaded.co?ref=vue-select"
    class="not-prose flex items-center gap-6 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-800/60 dark:ring-slate-300/10 dark:hover:bg-slate-800"
  >
    <SpringloadedLogo
      class="h-14 w-14 flex-none fill-slate-900 dark:fill-white"
      role="img"
      aria-label="Springloaded"
    />
    <span class="text-slate-600 dark:text-slate-400">
      <slot />
    </span>
  </a>
</template>
