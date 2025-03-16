<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'

import LightIcon from '~/assets/svg/light-icon.svg'
import DarkIcon from '~/assets/svg/dark-icon.svg'
import SystemIcon from '~/assets/svg/system-icon.svg'

const themes = [
  { name: 'Light', value: 'light', icon: LightIcon },
  { name: 'Dark', value: 'dark', icon: DarkIcon },
  { name: 'System', value: 'system', icon: SystemIcon },
]

const colorMode = useColorMode()
</script>

<template>
  <div class="relative z-10">
    <Listbox as="div" v-model="colorMode.preference">
      <ListboxLabel class="sr-only">Theme</ListboxLabel>
      <ListboxButton
        class="flex h-6 w-6 items-center justify-center rounded-lg shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5"
      >
        <LightIcon
          v-show="colorMode.value === 'light'"
          class="h-4 w-4 fill-sky-400"
        />
        <DarkIcon
          v-show="colorMode.value === 'dark'"
          class="h-4 w-4 fill-sky-400"
        />
      </ListboxButton>
      <ListboxOptions
        class="absolute top-full left-1/2 mt-3 w-36 -translate-x-1/2 space-y-1 rounded-xl bg-white p-3 text-sm font-medium shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/5"
      >
        <ListboxOption
          as="template"
          v-slot="{ active, selected }"
          v-for="{ name, value, icon } in themes"
          :key="value"
          :value="value"
        >
          <li
            :class="[
              'flex cursor-pointer select-none items-center rounded-[0.625rem] p-1',
              {
                'text-sky-500': selected,
                'text-slate-900 dark:text-white': active && !selected,
                'text-slate-700 dark:text-slate-400': !active && !selected,
                'bg-slate-100 dark:bg-slate-900/40': active,
              },
            ]"
          >
            <div
              class="rounded-md bg-white p-1 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5"
            >
              <Component
                :is="icon"
                :class="[
                  'h-4 w-4',
                  selected
                    ? 'fill-sky-400 dark:fill-sky-400'
                    : 'fill-slate-400',
                ]"
              />
            </div>
            <div class="ml-3">{{ name }}</div>
          </li>
        </ListboxOption>
      </ListboxOptions>
    </Listbox>
  </div>
</template>
