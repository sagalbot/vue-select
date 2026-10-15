<script setup lang="ts">
import type { Sponsor } from '~/server/utils/github'
import SpringloadedLogo from '~/assets/svg/springloaded-logo.svg'

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
      <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <!-- Springloaded supports Vue Select directly, outside GitHub Sponsors -->
        <li>
          <a
            href="https://springloaded.co?ref=vue-select"
            class="flex items-center gap-4 rounded-2xl p-3 ring-1 ring-slate-200 hover:bg-slate-50 dark:ring-slate-800 dark:hover:bg-slate-800/60"
          >
            <span
              class="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-slate-900 dark:bg-white"
            >
              <SpringloadedLogo
                class="h-8 w-8 fill-white dark:fill-slate-900"
                aria-hidden="true"
              />
            </span>
            <span>
              <span class="block font-semibold text-slate-900 dark:text-white">
                Springloaded
              </span>
              <span class="block text-sm text-slate-500 dark:text-slate-400">
                springloaded.co
              </span>
            </span>
          </a>
        </li>
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
