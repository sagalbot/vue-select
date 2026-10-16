<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

const { path, version: current } = useDocsVersion()

// Link to the same page in the other version when it exists there.
const links = computed(() => {
  const page = unversionedPath(path.value)
  return versions.map((version) => ({
    version,
    href: version.prefix + (versionHasPage(version, page) ? page : '/'),
  }))
})
</script>

<template>
  <Menu as="div" class="relative">
    <MenuButton
      class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ring-1 ring-slate-200 hover:ring-slate-300 dark:ring-white/10 dark:hover:ring-slate-500"
    >
      <span class="text-slate-500 dark:text-slate-400">
        <span class="sr-only">Docs version:</span>
        <span aria-hidden="true">Version</span>
      </span>
      <span class="flex items-center gap-1 font-medium text-slate-900 dark:text-white">
        {{ current.release }}
        <span v-if="current.latest" class="font-normal text-slate-500 dark:text-slate-400">
          (latest)
        </span>
        <ChevronDownIcon class="h-4 w-4 fill-slate-400" aria-hidden="true" />
      </span>
    </MenuButton>
    <MenuItems
      class="absolute inset-x-0 top-full z-50 mt-2 space-y-1 rounded-xl bg-white p-2 text-sm shadow-md shadow-black/5 ring-1 ring-black/5 focus:outline-none dark:bg-slate-800 dark:ring-white/5"
    >
      <MenuItem
        v-for="{ version, href } in links"
        :key="version.id"
        v-slot="{ active }"
      >
        <NuxtLink
          :to="href"
          :aria-current="version.id === current.id ? 'page' : undefined"
          :class="[
            'flex items-baseline justify-between rounded-lg px-3 py-2',
            version.id === current.id
              ? 'font-semibold text-sky-500'
              : 'text-slate-700 dark:text-slate-300',
            active && 'bg-slate-100 dark:bg-slate-900/40',
          ]"
        >
          <span>
            {{ version.release }}
            <span v-if="version.latest" class="font-normal">(latest)</span>
          </span>
          <span class="text-xs font-normal text-slate-500 dark:text-slate-400">
            {{ version.vue }}
          </span>
        </NuxtLink>
      </MenuItem>
    </MenuItems>
  </Menu>
</template>
