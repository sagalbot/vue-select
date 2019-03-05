<template>
  <div id="app">
    <sandbox hide-help>
      <template slot-scope="config">
      
      <p>Value managed by `v-model`:</p>
      <v-select v-model="vModelValue" v-bind="config" />
      <pre><code>`v-model` value: {{ vModelValueStringified }}</code></pre>
      <hr />

      <p>Value managed by `:value` and `@input`:</p>
      <v-select :value="valueProp" @input="changeValueProp" v-bind="config" />
      <pre><code>value passed to `@input`: {{ valuePropStringified }}</code></pre>
      <hr />

      <p>Value managed by Vue Select internally:</p>
      <v-select v-bind="config" />

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
    vModelValue: {
      value: 'CA',
      label: 'Canada'
    },
    valueProp: {
      value: 'US',
      label: 'United States'
    }
  }),
  methods: {
    changeValueProp(value) {
      this.valueProp = value;
    }
  },
  computed: {
    vModelValueStringified() {
      return JSON.stringify(this.vModelValue, null, 2);
    },

    valuePropStringified() {
      return JSON.stringify(this.valueProp, null, 2);
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

  hr {
    border: none;
    border-bottom: 1px solid #cacaca;
    margin-bottom: 1em;
    padding-top: 1em;
    width: 90%;
  }
</style>
