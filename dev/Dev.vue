<template>
  <div id="app">
    <sandbox hide-help>
      <template slot-scope="config">

      <v-select v-bind="config" />

      <v-select v-model="value" :multiple="true" :options="['ca', 'ab']" />

      </template>
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
  data: () => ({
    value: ['ca']
  }),
  watch: {
    value(newVal) {
      console.log('value was changed to: ', newVal);
    }
  }
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
</style>
