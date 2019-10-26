<template>
  <div id="app">
    <v-select
      :options="options"
      :reduce="opt => opt.ContactID"
      label="summary_text"
      v-model="selected"
    >
      <template slot="option" slot-scope="option">
        <span v-html="option.summary_short"></span>
      </template>
    </v-select>
    <button @click="options = []">reset options</button>
    <button @click="selected = 3">select 3</button>
    <pre>options: {{ options }}</pre>
    <pre>selected: {{ selected }}</pre>
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
    selected: 1,
    options: [
      {
        ContactID: 1,
        Firstname: 'John',
        Lastname: 'Connor',
        summary_short: '<b>John Connor</b><br><small>* 28. February 1985<br/>Los Angeles</small>',
        summary_text: 'John Connor, Los Angeles, 28. Februar 1985',
      },
      {
        ContactID: 2,
        Firstname: 'Sarah',
        Lastname: 'Connor',
        summary_short: '<b>Sarah Connor</b><br><small>* 1965<br/>Los Angeles</small>',
        summary_text: 'Sarah Connor, Los Angeles, 1965',
      },
      {
        ContactID: 3,
        Firstname: 'Kyle',
        Lastname: 'Reese (Connor)',
        summary_short: '<b>Kyle Reese</b><br><small>* 2002<br/>Los Angeles</small>',
        summary_text: 'Kyle Reese, Los Angeles, 2002',
      },
    ],
  }),
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
    width: 50%;
    margin: 5rem auto;
  }

  hr {
    border: none;
    border-bottom: 1px solid #cacaca;
    margin-bottom: 1em;
    padding-top: 1em;
    width: 90%;
  }
</style>
