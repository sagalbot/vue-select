<template>
  <v-select
    v-model="country"
    :options="countries"
    :dropdown-should-open="dropdownShouldOpen"
  />
</template>

<script>
import countries from '../data/countries.js'

export default {
  data() {
    return {
      countries,
      country: null,
    }
  },
  methods: {
    dropdownShouldOpen(VueSelect) {
      if (this.country !== null) {
        return VueSelect.open
      }

      return VueSelect.search.length !== 0 && VueSelect.open
    },
  },
}
</script>
