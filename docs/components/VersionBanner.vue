<script setup lang="ts">
const { path, version } = useDocsVersion()

const latestHref = computed(() => {
  const page = unversionedPath(path.value)
  return versionHasPage(latestVersion, page) ? page : '/'
})
</script>

<template>
  <div
    v-if="!version.latest"
    role="note"
    class="border-b border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400"
  >
    You're viewing the docs for Vue Select {{ version.release }} ({{ version.vue }}).
    <NuxtLink
      :to="latestHref"
      class="ml-1 whitespace-nowrap font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400"
    >
      Go to {{ latestVersion.id }} <span aria-hidden="true">→</span>
    </NuxtLink>
  </div>
</template>
