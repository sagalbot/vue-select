<script setup>
import VueSelect from '@/index'
</script>

<template>
  <VueSelect
    class="style-chooser"
    placeholder="Choose a styling option"
    :options="['Slots', 'CSS variables', 'Your own CSS']"
  />
</template>

<style>
.style-chooser .vs__search::placeholder,
.style-chooser .vs__dropdown-toggle,
.style-chooser .vs__dropdown-menu {
  background: #dfe5fb;
  border: none;
  color: #394066;
  text-transform: lowercase;
  font-variant: small-caps;
}

.style-chooser .vs__clear,
.style-chooser .vs__open-indicator {
  fill: #394066;
}
</style>
