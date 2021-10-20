<template>
  <v-select :options="countries" append-to="body" />
</template>

<script>
import countries from '../data/countries.js'

export default {
  data() {
    return {
      countries,
    }
  },
}
</script>
