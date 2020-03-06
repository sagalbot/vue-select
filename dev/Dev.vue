<template>
  <!--  <div id="app">-->
  <!--    <sandbox hide-help v-slot="config">-->
  <!--      <v-select v-bind="config"/>-->
  <!--    </sandbox>-->
  <!--  </div>-->
  <form>
    <label for="name">Name</label>
    <input type="text" id="name" autofocus>

    <label for="email">eMail</label>
    <input type="email" id="email">

    <label for="emails">eMail</label>
    <select id="emails">
      <option value="one">one</option>
      <option value="two">two</option>
    </select>

    <label for="country">Country</label>
    <v-select :options="countries" id="country" :filterable="false" />

    <label for="hello">Hello</label>
    <input type="text" id="hello">
  </form>
</template>

<script>
import vSelect from '../src/components/Select';
import Sandbox from '../docs/.vuepress/components/Sandbox';
import countries from '../docs/.vuepress/data/countryCodes';
import books from '../docs/.vuepress/data/books';

export default {
  components: {Sandbox, vSelect},
  computed: {
    countries: () => countries,
    books: () => books,
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

  form {
    width: 500px;
    margin: 0 auto;
    padding-top: 5rem;
  }

  label {
    width:100%;
    display: block;
    margin-top:1rem;
  }

  input {
    width: 100%;
  }
</style>
