<script setup lang="ts">
import type { PageCollections } from '@nuxt/content'

type PageCollectionItem = PageCollections[keyof PageCollections]

defineProps<{
  page: PageCollectionItem
}>()
</script>

<template>
  <header class="mb-9 space-y-1">
    <p v-if="page?.section" class="font-display text-sm font-bold text-sky-500">
      {{ page?.section }}
    </p>
    <h1
      class="font-display font-bold text-3xl tracking-tight text-slate-900 dark:text-white"
    >
      {{ page?.title }}
    </h1>
  </header>
</template>
