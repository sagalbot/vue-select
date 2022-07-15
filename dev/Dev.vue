<template>
  <div id="app">
    <v-select v-model="selected" v-bind="config" />
  </div>
</template>

<script>
import vSelect from '../src/components/Select'
import countries from '../docs/.vuepress/data/countryCodes'
import books from '../docs/.vuepress/data/books'

export default {
  components: { vSelect },
  data: () => ({
    selected: null,
    config: {
      options: countries,
    },
  }),
}
</script>

<style>
html,
body {
  margin: 0;
  height: 100%;
  font-family: -apple-system, sans-serif;
}

#app {
  height: 100%;
  max-width: 20rem;
  margin: 10rem auto 0;
}

hr {
  border: none;
  border-bottom: 1px solid #cacaca;
  margin-bottom: 1em;
  padding-top: 1em;
  width: 90%;
}
</style>
