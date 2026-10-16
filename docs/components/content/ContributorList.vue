<script setup lang="ts">
import type { Contributor } from '~/server/utils/github'

const { data: contributors } = await useFetch<Contributor[]>('/api/github/contributors', {
  key: 'github-contributors',
  default: () => [],
})
</script>

<template>
  <ul
    v-if="contributors.length"
    role="list"
    class="not-prose mt-8 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3"
  >
    <li
      v-for="contributor in contributors"
      :key="contributor.login"
      class="flex items-center gap-3"
    >
      <img
        :src="`${contributor.avatarUrl}&s=80`"
        alt=""
        width="40"
        height="40"
        loading="lazy"
        class="h-10 w-10 flex-none rounded-full"
      />
      <span class="min-w-0 text-sm">
        <a
          :href="contributor.url"
          class="block truncate font-semibold text-slate-900 hover:text-sky-600 dark:text-white dark:hover:text-sky-400"
        >
          @{{ contributor.login }}
        </a>
        <a
          :href="`https://github.com/sagalbot/vue-select/commits?author=${contributor.login}`"
          class="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
        >
          {{ contributor.contributions }}
          {{ contributor.contributions === 1 ? 'contribution' : 'contributions' }}
        </a>
      </span>
    </li>
  </ul>
  <p v-else class="text-slate-500 dark:text-slate-400">
    See everyone who has contributed
    <a href="https://github.com/sagalbot/vue-select/graphs/contributors">on GitHub</a>.
  </p>
</template>
