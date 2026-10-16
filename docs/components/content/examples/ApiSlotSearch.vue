<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const selected = ref(null)
const submitted = ref(false)
</script>

<template>
  <form @submit.prevent="submitted = true">
    <VueSelect v-model="selected" :options="['Canada', 'Mexico', 'United States']">
      <template #search="{ attributes, events }">
        <input
          class="vs__search"
          :required="!selected"
          v-bind="attributes"
          v-on="events"
        />
      </template>
    </VueSelect>
    <button type="submit">Submit</button>
    <span v-if="submitted"> Submitted {{ selected }}</span>
  </form>
</template>

<style scoped>
button {
  margin: 0.5rem 0.5rem 0.5rem 0;
  padding: 0.125rem 0.75rem;
  border: 1px solid currentColor;
  border-radius: 4px;
}
</style>
