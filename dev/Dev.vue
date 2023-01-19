<template>
  <div id="app">
    <button v-if="config.appendToBody" @click="hide">Hide</button>
    <v-select v-if="!hidden" v-model="selected" v-bind="config" />
  </div>
</template>

<script>
import vSelect from '@/components/Select.vue'
import countries from '../docs/.vuepress/data/countryCodes.js'

export default {
  components: { vSelect },
  data: () => ({
    hidden: false,
    selected: null,
    config: {
      options: countries,
      appendToBody: true,
    },
  }),
  methods: {
    hide() {
      this.hidden = true
      setTimeout(() => {
        this.hidden = false
      }, 2000)
    },
  },
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
