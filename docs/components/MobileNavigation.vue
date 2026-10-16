<script setup lang="ts">
import { Dialog, DialogPanel } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import NavigationList from '~/components/NavigationList.vue'
import VersionSwitcher from '~/components/VersionSwitcher.vue'

const isOpen = ref(false)

// Close the drawer once a link has been followed.
const route = useRoute()
watch(() => route.fullPath, () => (isOpen.value = false))
</script>

<template>
  <button
    type="button"
    class="relative"
    aria-label="Open navigation"
    @click="isOpen = true"
  >
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      class="h-6 w-6 stroke-slate-500"
    >
      <path d="M4 7h16M4 12h16M4 17h16"></path>
    </svg>
  </button>
  <Dialog
    :open="isOpen"
    class="fixed inset-0 z-50 flex items-start overflow-y-auto bg-slate-900/50 pr-10 backdrop-blur-sm lg:hidden"
    aria-label="Navigation"
    @close="isOpen = false"
  >
    <DialogPanel
      class="min-h-full w-full max-w-xs bg-white px-4 pt-5 pb-12 sm:px-6 dark:bg-slate-900"
    >
      <div class="flex items-center justify-between">
        <NuxtLink
          to="/"
          class="font-display font-bold tracking-tight text-sky-900 dark:text-sky-50"
        >
          Vue Select
        </NuxtLink>
        <button
          type="button"
          aria-label="Close navigation"
          @click="isOpen = false"
        >
          <XMarkIcon class="h-6 w-6 stroke-slate-500" aria-hidden="true" />
        </button>
      </div>
      <VersionSwitcher class="mt-6" />
      <NavigationList class="mt-8 text-base" />
    </DialogPanel>
  </Dialog>
</template>
