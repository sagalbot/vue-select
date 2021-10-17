<template>
  <v-select :options="options"></v-select>
</template>

<script>
import countryCodes from '../data/countryCodes'

export default {
  name: 'CountrySelect',
  data: () => ({
    options: countryCodes,
  }),
}
</script>

<style scoped></style>
