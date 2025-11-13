<script setup lang="ts">
import type { MarkdownRoot } from '@nuxt/content'

defineProps<{
  toc?: MarkdownRoot['toc']
}>()
</script>

<template>
  <div
    v-if="toc"
    class="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6"
  >
    <nav aria-labelledby="on-this-page-title" class="w-56">
      <h2
        id="on-this-page-title"
        class="font-display text-sm font-medium text-slate-900 dark:text-white"
      >
        On this page
      </h2>
      <ol role="list" class="mt-4 space-y-3 text-sm">
        <li v-for="link in toc?.links" :key="link.id">
          <h3>
            <a class="text-slate-900 dark:text-white" :href="`#${link.id}`">
              {{ link.text }}
            </a>
          </h3>
          <ol
            v-if="link.children"
            role="list"
            class="mt-2 space-y-3 pl-5 text-slate-500 dark:text-slate-400"
          >
            <li v-for="childLink in link.children" :key="childLink.id">
              <a
                class="hover:text-slate-600 dark:hover:text-slate-300"
                :href="`#${childLink.id}`"
              >
                {{ childLink.text }}
              </a>
            </li>
          </ol>
        </li>
      </ol>
    </nav>
  </div>
</template>
