<script setup lang="ts">
import Prose from '~/components/Prose.vue'
import type { PageCollections } from '@nuxt/content'

type PageCollectionItem = PageCollections[keyof PageCollections]

defineProps<{
  page: PageCollectionItem
}>()
</script>

<template>
  <article>
    <PageContentHeader :page />
    <Prose>
      <ContentRenderer :value="page" :path="$route.path" />
    </Prose>
  </article>
  <PageContentFooterNavigation :page />
  <PageTableOfContents :toc="page.body.toc" />
</template>
