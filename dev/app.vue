<template>
  <div id="app">
    <div class="section">
      <h2 class="title">Basic</h2>
      <v-select v-model="selected" :options="options" />
    </div>

    <div class="section">
      <h2 class="title">Custom</h2>
      <ul>
        <li>searchable: false</li>
        <li>clearable: false</li>
      </ul>
      <v-select
        v-model="selected"
        :options="options"
        :clearable="false"
        :searchable="false"
      />
    </div>

    <div class="section">
      <h2 class="title">BaseSelect</h2>
      <BaseSelect class="" v-model="selected" :options="baseSelectOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import countries from '../docs/.vuepress/data/countryCodes.js'
import BaseSelect from './BaseSelect.vue'

const selected = ref(null)
const options = ref(countries)
const baseSelectOptions = ref(
  countries.map((country) => ({
    name: country.label,
    value: country.value,
  }))
)
</script>

<style lang="scss">
html,
body {
  margin: 0;
  height: 1000px;
  font-family: -apple-system, sans-serif;
}

.title {
  @apply text-lg;
}

.section {
  @apply p-5;
}
</style>
