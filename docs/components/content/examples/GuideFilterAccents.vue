<script setup>
import VueSelect from '@/index'

const cities = ['Québec', 'Montréal', 'Trois-Rivières', 'Zürich', 'São Paulo', 'Kraków']

// "Québec" -> "quebec"
const fold = (text) =>
  text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase()

const filter = (options, search) =>
  options.filter((option) => fold(option).includes(fold(search)))
</script>

<template>
  <VueSelect :options="cities" :filter="filter" placeholder="Try typing quebec or zurich" />
</template>
