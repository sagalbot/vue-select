<template>
  <div id="app">
    <sandbox hide-help v-slot="config">
      <v-select
        label="name"
        :options="[]"
        v-model="organization"
        taggable
        :create-option="org => ({ name: org })"
      ></v-select>

      {{ organization }}
    </sandbox>
  </div>
</template>

<script>
import vSelect from '../src/components/Select';
import Sandbox from '../docs/.vuepress/components/Sandbox';
// import countries from '../docs/.vuepress/data/countryCodes';
// import books from '../docs/.vuepress/data/books';

export default {
  components: {Sandbox, vSelect},
  data: () => ({organization: null})
};
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
  }

  hr {
    border: none;
    border-bottom: 1px solid #cacaca;
    margin-bottom: 1em;
    padding-top: 1em;
    width: 90%;
  }
</style>
