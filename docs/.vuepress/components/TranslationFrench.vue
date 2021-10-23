<template>
  <v-select
    :locale="locale"
    :options="['un', 'deux', 'trois', 'quatre']"
  ></v-select>
</template>

<script>
import { locale as french } from 'vue-select/locales/fr.js'

export default {
  computed: {
    locale() {
      return () => french
    },
  },
}
</script>
