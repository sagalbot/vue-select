<script lang="ts" setup>
const { path, navigation } = useDocsVersion()
</script>

<template>
  <nav aria-label="Documentation">
    <ul role="list" class="space-y-9">
      <li v-for="section in navigation" :key="section.title">
        <h2 class="font-display font-medium text-slate-900 dark:text-white">
          {{ section.title }}
        </h2>
        <ul
          role="list"
          class="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200"
        >
          <li
            v-for="link in section?.links"
            :key="link.href"
            class="relative"
          >
            <NuxtLink
              :to="link.href"
              :aria-current="link.href === path ? 'page' : undefined"
              :class="[
                'block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full',
                link.href === path
                  ? 'font-semibold text-sky-500 before:bg-sky-500'
                  : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300',
              ]"
            >
              {{ link.title }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
