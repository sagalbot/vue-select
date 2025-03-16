<script lang="ts" setup>
const navigation = [
  {
    title: 'Community',
    links: [
      { title: 'Sponsors 🎉', href: '/sponsors' },
      { title: 'Contributors', href: '/contributors' },
    ],
  },
  {
    title: 'Getting Started',
    links: [
      { href: '/guide/install', title: 'Installation' },
      { href: '/guide/options', title: 'Dropdown Options' },
      { href: '/guide/values', title: 'Selecting Values' },
      { href: '/guide/upgrading', title: 'Upgrade Guide' },
    ],
  },
  {
    title: 'Templating & Styling',
    links: [
      { href: '/guide/components', title: 'Child Components' },
      { href: '/guide/css', title: 'CSS & Selectors' },
      { href: '/guide/slots', title: 'Slots' },
    ],
  },
  {
    title: 'Accessibility',
    links: [
      { href: '/guide/accessibility', title: 'WAI-ARIA Spec' },
      { href: '/guide/localization', title: 'Localization' },
    ],
  },
  {
    title: 'Use Cases',
    links: [
      { href: '/guide/validation', title: 'Validation' },
      { href: '/guide/selectable', title: 'Limiting Selections' },
      { href: '/guide/pagination', title: 'Pagination' },
      { href: '/guide/infinite-scroll', title: 'Infinite Scroll' },
      { href: '/guide/vuex', title: 'Vuex' },
      { href: '/guide/ajax', title: 'AJAX' },
      { href: '/guide/loops', title: 'Using in Loops' },
    ],
  },
  {
    title: 'Customizing',
    links: [
      { href: '/guide/keydown', title: 'Keydown Events' },
      { href: '/guide/positioning', title: 'Dropdown Position' },
      { href: '/guide/opening', title: 'Dropdown Opening' },
      { href: '/guide/filtering', title: 'Option Filtering' },
    ],
  },
  {
    title: 'API',
    links: [
      { href: '/api/props', title: 'Props' },
      { href: '/api/slots', title: 'Slots' },
      { href: '/api/events', title: 'Events' },
    ],
  },
]
const router = { pathname: '' }
</script>

<template>
  <div class="hidden lg:relative lg:block lg:flex-none">
    <div
      class="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden"
    ></div>
    <div
      class="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto py-16 pl-0.5"
    >
      <div
        class="absolute top-16 bottom-0 right-0 hidden h-12 w-px bg-linear-to-t from-slate-800 dark:block"
      ></div>
      <div
        class="absolute top-28 bottom-0 right-0 hidden w-px bg-slate-800 dark:block"
      ></div>
      <nav class="w-64 pr-8 text-base lg:text-sm xl:w-72 xl:pr-16">
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
                  :href="link.href"
                  :class="[
                    'block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full',
                    link.href === router.pathname
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
    </div>
  </div>
</template>
