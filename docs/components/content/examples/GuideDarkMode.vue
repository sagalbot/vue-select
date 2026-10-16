<script setup>
import { ref } from 'vue'
import VueSelect from '@/index'

const options = ['Canada', 'Mexico', 'United States']
const light = ref(['Canada'])
const dark = ref(['Canada'])
</script>

<template>
  <div class="schemes">
    <div class="scheme" style="color-scheme: light">
      <p>color-scheme: light</p>
      <VueSelect v-model="light" :options="options" multiple />
    </div>
    <div class="scheme" style="color-scheme: dark">
      <p>color-scheme: dark</p>
      <VueSelect v-model="dark" :options="options" multiple />
    </div>
  </div>
</template>

<style scoped>
.schemes {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
}
.scheme {
  padding: 1rem 1rem 1.5rem;
  border-radius: 0.5rem;
  background: light-dark(#fff, #09090b);
  color: light-dark(#18181b, #e4e4e7);
  border: 1px solid light-dark(#e4e4e7, #27272a);
}
.scheme p {
  margin: 0 0 0.75rem;
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  opacity: 0.7;
}
</style>
