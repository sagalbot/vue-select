<script setup>
import VueSelect from '@/index'
import { countries } from '~/assets/static/data'
</script>

<template>
  <div class="purple-theme">
    <VueSelect :options="countries" placeholder="Choose a country" />
  </div>
</template>

<style scoped>
.purple-theme {
  padding: 1rem;
  border-radius: 0.5rem;
  background: #282c34;

  --vs-controls-color: #a78bfa;
  --vs-border-color: #664cc3;

  --vs-dropdown-bg: #282c34;
  --vs-dropdown-color: #cc99cd;
  --vs-dropdown-option-color: #cc99cd;

  --vs-selected-bg: #664cc3;
  --vs-selected-color: #eeeeee;

  --vs-search-input-color: #eeeeee;
  --vs-search-input-bg: #282c34;

  --vs-dropdown-option--active-bg: #664cc3;
  --vs-dropdown-option--active-color: #eeeeee;
}
</style>
