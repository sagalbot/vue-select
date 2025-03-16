<script setup lang="ts">
import { NuxtLink } from '#components'
import ColorThemeSwitcher from '~/components/ThemeSwitcher.vue'
import { useWindowScroll } from '@vueuse/core'
import SpringloadedLogo from '~/assets/svg/springloaded-logo.svg'

const { y } = useWindowScroll()

const isScrolled = computed(() => y.value !== 0)
</script>

<template>
  <header
    :class="[
      'sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-none sm:px-6 lg:px-8',
      isScrolled
        ? 'dark:bg-slate-900/95 dark:backdrop-blur-sm dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75'
        : 'dark:bg-transparent',
    ]"
  >
    <div class="mr-6 flex lg:hidden">
      <button type="button" class="relative" aria-label="Open navigation">
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
      <div
        style="
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
          display: none;
        "
      ></div>
    </div>
    <div class="relative flex grow basis-0 items-center">
      <NuxtLink
        aria-label="Home page"
        href="/"
        class="flex items-center space-x-2"
      >
        <svg
          fill="none"
          class="h-9 w-9"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 87 68"
        >
          <path
            class="fill-[#0EE2FF] dark:fill-sky-900"
            fill-rule="evenodd"
            d="M62.1429 6.1818H24.8571c-10.2961 0-18.6428 8.3031-18.6428 18.5455v18.5454c0 10.2424 8.3467 18.5455 18.6428 18.5455h37.2858c10.2961 0 18.6428-8.3031 18.6428-18.5455V24.7273c0-10.2424-8.3467-18.5455-18.6428-18.5455ZM24.8571 0C11.1289 0 0 11.0708 0 24.7273v18.5454C0 56.9292 11.1289 68 24.8571 68h37.2858C75.8711 68 87 56.9292 87 43.2727V24.7273C87 11.0708 75.8711 0 62.1429 0H24.8571Z"
            clip-rule="evenodd"
          />
          <path
            class="fill-[#111112] dark:fill-[#0EE2FF]"
            fill-rule="evenodd"
            d="M60.1875 9.125h-33.375c-9.2163 0-16.6875 7.4712-16.6875 16.6875V42.5c0 9.2162 7.4712 16.6875 16.6875 16.6875h33.375c9.2162 0 16.6875-7.4713 16.6875-16.6875V25.8125c0-9.2163-7.4713-16.6875-16.6875-16.6875Zm-33.375-5.5625c-12.2883 0-22.25 9.9617-22.25 22.25V42.5c0 12.2883 9.9617 22.25 22.25 22.25h33.375c12.2883 0 22.25-9.9617 22.25-22.25V25.8125c0-12.2883-9.9617-22.25-22.25-22.25h-33.375Z"
            clip-rule="evenodd"
          />
          <path
            class="fill-[#000] dark:fill-sky-50"
            fill-rule="evenodd"
            d="M55.0064 22.7105a2.2807 2.2807 0 0 1 .6676 1.6127v9.6758a2.2808 2.2808 0 0 1-2.2803 2.241 2.2802 2.2802 0 0 1-2.2802-2.241v-7.3956h-7.3956a2.2804 2.2804 0 0 1-1.587-3.8788 2.2808 2.2808 0 0 1 1.587-.6817h9.6758a2.2805 2.2805 0 0 1 1.6127.6676ZM34.042 31.7188a2.2807 2.2807 0 0 1 2.2803 2.2802v7.3956h7.3956a2.2804 2.2804 0 0 1 2.241 2.2803 2.2806 2.2806 0 0 1-2.241 2.2803H34.042a2.2808 2.2808 0 0 1-2.2803-2.2803V33.999a2.2807 2.2807 0 0 1 2.2803-2.2802Z"
            clip-rule="evenodd"
          />
        </svg>

        <span
          class="font-bold font-display tracking-tight text-sky-900 dark:text-sky-50"
          >Vue Select</span
        >
      </NuxtLink>
    </div>
    <div class="-my-5 mr-6 sm:mr-8 md:mr-0">
      <button
        type="button"
        class="group flex h-6 w-6 items-center justify-center sm:justify-start md:h-auto md:w-80 md:flex-none md:rounded-lg md:py-2.5 md:pl-4 md:pr-3.5 md:text-sm md:ring-1 md:ring-slate-200 md:hover:ring-slate-300 dark:md:bg-slate-800/75 dark:md:ring-inset dark:md:ring-white/5 dark:md:hover:bg-slate-700/40 dark:md:hover:ring-slate-500 lg:w-96"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          class="h-5 w-5 flex-none fill-slate-400 group-hover:fill-slate-500 dark:fill-slate-500 md:group-hover:fill-slate-400"
        >
          <path
            d="M16.293 17.707a1 1 0 0 0 1.414-1.414l-1.414 1.414ZM9 14a5 5 0 0 1-5-5H2a7 7 0 0 0 7 7v-2ZM4 9a5 5 0 0 1 5-5V2a7 7 0 0 0-7 7h2Zm5-5a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7v2Zm8.707 12.293-3.757-3.757-1.414 1.414 3.757 3.757 1.414-1.414ZM14 9a4.98 4.98 0 0 1-1.464 3.536l1.414 1.414A6.98 6.98 0 0 0 16 9h-2Zm-1.464 3.536A4.98 4.98 0 0 1 9 14v2a6.98 6.98 0 0 0 4.95-2.05l-1.414-1.414Z"
          ></path>
        </svg>
        <span
          class="sr-only md:not-sr-only md:ml-2 md:text-slate-500 md:dark:text-slate-400"
        >
          Search docs</span
        >
        <kbd
          class="ml-auto hidden font-medium text-slate-400 dark:text-slate-500 md:block"
        >
          <kbd class="font-sans">⌘</kbd>
          <kbd class="font-sans">K</kbd>
        </kbd>
      </button>
    </div>
    <div class="relative flex basis-0 justify-end gap-6 sm:gap-8 md:grow">
      <ColorThemeSwitcher />
      <a
        class="group"
        aria-label="GitHub"
        target="_blank"
        href="https://github.com/sagalbot/vue-select"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          class="h-6 w-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300"
        >
          <path
            d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
          ></path>
        </svg>
      </a>
      <a
        class="group"
        aria-label="Springloaded"
        target="_blank"
        href="https://springloaded.co"
      >
        <SpringloadedLogo
          class="h-6 w-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300"
        />
      </a>
    </div>
  </header>
</template>
