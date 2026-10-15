<script setup lang="ts">
import type { Sponsor } from '~/server/utils/github'

const props = defineProps<{ status: 'current' | 'past' }>()

const { data: sponsors } = await useFetch<Sponsor[]>('/api/github/sponsors', {
  key: 'github-sponsors',
  default: () => [],
})

const current = computed(() => sponsors.value.filter((s) => s.isActive))
// most recent first
const past = computed(() => sponsors.value.filter((s) => !s.isActive).reverse())

const month = new Intl.DateTimeFormat('en', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})
const since = (date: string) => month.format(new Date(date))
</script>

<template>
  <div class="not-prose mt-6">
    <template v-if="props.status === 'current'">
      <ul
        v-if="current.length"
        role="list"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        <li v-for="sponsor in current" :key="sponsor.login">
          <a
            :href="sponsor.url"
            class="flex items-center gap-4 rounded-2xl p-3 ring-1 ring-slate-200 hover:bg-slate-50 dark:ring-slate-800 dark:hover:bg-slate-800/60"
          >
            <img
              :src="`${sponsor.avatarUrl}&s=128`"
              alt=""
              width="64"
              height="64"
              class="h-16 w-16 rounded-full"
            />
            <span>
              <span class="block font-semibold text-slate-900 dark:text-white">
                {{ sponsor.name || sponsor.login }}
              </span>
              <span class="block text-sm text-slate-500 dark:text-slate-400">
                @{{ sponsor.login }} · since {{ since(sponsor.since) }}
              </span>
            </span>
          </a>
        </li>
      </ul>
      <p v-else class="text-slate-500 dark:text-slate-400">
        No current sponsors yet. You could be the first!
      </p>
    </template>

    <ul v-else role="list" class="flex flex-wrap gap-3">
      <li v-for="sponsor in past" :key="sponsor.login">
        <a
          :href="sponsor.url"
          :title="`${sponsor.name || sponsor.login}, sponsor since ${since(sponsor.since)}`"
          class="block rounded-full ring-2 ring-transparent hover:ring-sky-300"
        >
          <img
            :src="`${sponsor.avatarUrl}&s=96`"
            :alt="sponsor.name || sponsor.login"
            width="48"
            height="48"
            class="h-12 w-12 rounded-full"
          />
        </a>
      </li>
    </ul>
  </div>
</template>
