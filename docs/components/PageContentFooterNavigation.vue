<script setup lang="ts">
const { path, navigation } = useDocsVersion()

// Previous/next pages follow the sidebar order of the current version.
const pager = computed(() => {
  const links = navigation.value.flatMap((section) => section.links)
  const index = links.findIndex((link) => link.href === path.value)
  // Pages outside the sidebar (like the home page) point at the first guide page.
  if (index === -1) {
    return { previous: undefined, next: links.find((l) => l.href.includes('/guide/')) }
  }
  return { previous: links[index - 1], next: links[index + 1] }
})
</script>

<template>
  <dl
    v-if="pager.previous || pager.next"
    class="mt-12 flex border-t border-slate-200 pt-6 dark:border-slate-800"
  >
    <div v-if="pager.previous">
      <dt class="font-display text-sm font-medium text-slate-900 dark:text-white">
        Previous
      </dt>
      <dd class="mt-1">
        <NuxtLink
          :to="pager.previous.href"
          class="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
        >
          <span aria-hidden="true">←</span> {{ pager.previous.title }}
        </NuxtLink>
      </dd>
    </div>
    <div v-if="pager.next" class="ml-auto text-right">
      <dt class="font-display text-sm font-medium text-slate-900 dark:text-white">
        Next
      </dt>
      <dd class="mt-1">
        <NuxtLink
          :to="pager.next.href"
          class="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
        >
          {{ pager.next.title }} <span aria-hidden="true">→</span>
        </NuxtLink>
      </dd>
    </div>
  </dl>
</template>
