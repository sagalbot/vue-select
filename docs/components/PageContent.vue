<script setup lang="ts">
import ContentFooterNavigation from '~/components/PageContentFooterNavigation.vue'
import PageContentHeader from '~/components/PageContentHeader.vue'
import PageTableOfContents from '~/components/PageTableOfContents.vue'
</script>

<template>
  <div
    class="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16"
  >
    <article>
      <PageContentHeader />
      <div
        :class="[
          'prose prose-slate max-w-none dark:prose-invert dark:text-slate-400',
          // headings
          'prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-bold lg:prose-headings:scroll-mt-[8.5rem]',
          // lead
          'prose-lead:text-slate-500 dark:prose-lead:text-slate-400',
          // links
          'prose-a:font-semibold dark:prose-a:text-sky-400',
          // link underline
          'prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,var(--color-sky-300))] prose-a:hover:[--tw-prose-underline-size:6px] dark:[--tw-prose-background:var(--color-slate-900)] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,var(--color-sky-800))] dark:prose-a:hover:[--tw-prose-underline-size:6px]',
          // pre
          'prose-pre:rounded-xl prose-pre:border-2 prose-pre:bg-white dark:prose-pre:border-0 dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-lg dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10',
          // hr
          'dark:prose-hr:border-slate-800',
        ]"
      >
        <ContentDoc :path="$route.path" />
      </div>
    </article>
    <ContentFooterNavigation />
  </div>
  <PageTableOfContents />
</template>
