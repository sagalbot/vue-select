<template>
  <div id="app">
    <p>searchable</p>
    <v-select v-model="selected" v-bind="config" />

    <p>unsearchable</p>
    <v-select v-model="selected" v-bind="config" :searchable="false" />
  </div>
</template>

<script>
import vSelect from '@/components/Select.vue'
import countries from '../docs/.vuepress/data/countryCodes.js'

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
  margin: 0 auto;
  padding: 10px;
}

hr {
  border: none;
  border-bottom: 1px solid #cacaca;
  margin-bottom: 1em;
  padding-top: 1em;
  width: 90%;
}
</style>
