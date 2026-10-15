<script setup>
import { computed, ref } from 'vue'
import VueSelect from '@/index'
import { countries } from '~/assets/static/data'

// v3: :dropdown-should-open="({ open, search }) => open && search.length >= 2"
const wantsOpen = ref(false)
const search = ref('')
const open = computed(() => wantsOpen.value && search.value.length >= 2)
</script>

<template>
  <div class="not-prose" style="margin: 1.5rem 0">
    <VueSelect
      :options="countries"
      :open="open"
      placeholder="Type two letters"
      @update:open="(value) => (wantsOpen = value)"
      @search="(text) => (search = text)"
    />
  </div>
</template>
