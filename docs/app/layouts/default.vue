<script setup lang="ts">
defineProps<{
  hero?: boolean
}>()

useHead({
  bodyAttrs: { class: 'bg-white dark:bg-slate-900' },
})
</script>

<template>
  <div>
    <ApplicationHeader />
    <Hero v-if="hero" />
    <div
      class="relative mx-auto flex max-w-8xl justify-center sm:px-2 lg:px-8 xl:px-12"
    >
      <SidebarNavigation />
      <div
        class="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
