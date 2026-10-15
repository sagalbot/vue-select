<script setup>
import VueSelect from '@/index'
import { countries } from '~/assets/static/data'
</script>

<template>
  <div class="cards">
    <div class="card">
      <p>Default</p>
      <VueSelect :options="countries" placeholder="Clipped by the card" />
    </div>
    <div class="card">
      <p><code>append-to="#teleports"</code></p>
      <VueSelect :options="countries" append-to="#teleports" placeholder="Escapes the card" />
    </div>
  </div>
</template>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 1rem;
}
.card {
  height: 7rem;
  padding: 0.75rem 1rem;
  overflow: hidden;
  border: 1px dashed #94a3b8;
  border-radius: 0.5rem;
}
.card p {
  margin: 0 0 0.5rem;
  font-size: 0.85em;
}
</style>
