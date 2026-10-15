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
    class="mb-9 rounded-2xl bg-amber-50 p-5 text-sm leading-6 text-amber-900 dark:bg-slate-800/60 dark:text-slate-300 dark:ring-1 dark:ring-slate-300/10"
  >
    <p>
      You're reading the archived docs for <strong>Vue Select {{ version.release }}</strong>,
      which supports {{ version.vue }}. Examples on these pages are shown as code only.
    </p>
    <p class="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-semibold">
      <NuxtLink :to="latestHref" class="text-amber-900 underline dark:text-sky-400">
        Go to the {{ latestVersion.id }} docs →
      </NuxtLink>
      <NuxtLink to="/guide/upgrade" class="text-amber-900 underline dark:text-sky-400">
        Upgrade to {{ latestVersion.id }} →
      </NuxtLink>
    </p>
  </div>
</template>
