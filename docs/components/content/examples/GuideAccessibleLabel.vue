<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'
import { countries } from '~/assets/static/data'

const country = ref(null)
</script>

<template>
  <div class="field">
    <label for="guide-country">Country</label>
    <VueSelect
      v-model="country"
      :options="countries"
      :input-attrs="{ id: 'guide-country', 'aria-describedby': 'guide-country-hint' }"
    />
    <p id="guide-country-hint" class="hint">Where you live today.</p>
  </div>
</template>

<style scoped>
.field label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 600;
}
.hint {
  margin: 0.25rem 0 0;
  font-size: 0.85em;
  opacity: 0.7;
}
</style>
