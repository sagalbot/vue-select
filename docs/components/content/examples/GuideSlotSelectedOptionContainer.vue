<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const options = [
  { label: 'Canada', code: 'CA' },
  { label: 'United States', code: 'US' },
  { label: 'Mexico', code: 'MX' },
]

const selected = ref([options[0], options[2]])
</script>

<template>
  <VueSelect v-model="selected" multiple :options="options">
    <template #selected-option-container="{ option, deselect, disabled }">
      <span class="pill">
        {{ option.label }}
        <button
          type="button"
          :disabled="disabled"
          :aria-label="`Remove ${option.label}`"
          @click="deselect(option)"
        >
          remove
        </button>
      </span>
    </template>
  </VueSelect>
</template>

<style scoped>
.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin: 4px 2px 0;
  padding: 0 0.5rem;
  border-radius: 999px;
  background: #e0f2fe;
  color: #075985;
}
.pill button {
  border: 0;
  background: none;
  color: inherit;
  font-size: 0.75em;
  text-decoration: underline;
  cursor: pointer;
}
</style>
