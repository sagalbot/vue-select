<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const options = ref(['Canada', 'Mexico', 'United States'])
const selected = ref([])
const log = ref([])
let count = 0

// Keep the 10 most recent events, newest first
function record(event, ...args) {
  const payload = args.map((arg) => JSON.stringify(arg)).join(', ')
  log.value = [{ id: count++, text: `${event}(${payload})` }, ...log.value].slice(0, 10)
}
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="options"
    multiple
    taggable
    @update:model-value="(value) => record('update:modelValue', value)"
    @update:open="(value) => record('update:open', value)"
    @open="record('open')"
    @close="record('close')"
    @clear="record('clear')"
    @search="(search) => record('search', search)"
    @search:focus="record('search:focus')"
    @search:blur="record('search:blur')"
    @search:keydown="(event) => record('search:keydown', event.key)"
    @option:created="(option) => record('option:created', option)"
    @option:selecting="(option) => record('option:selecting', option)"
    @option:selected="(option) => record('option:selected', option)"
    @option:deselecting="(option) => record('option:deselecting', option)"
    @option:deselected="(option) => record('option:deselected', option)"
  />
  <ul>
    <li v-for="entry in log" :key="entry.id">
      <code>{{ entry.text }}</code>
    </li>
  </ul>
</template>
