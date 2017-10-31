# Install and Usage

Install from GitHub via NPM
```shell
npm install sagalbot/vue-select
```
To use the vue-select component in your templates, simply import it, and register it with your component.
```html
<template>
  <div id="myApp">
    <v-select :value.sync="selected" :options="options"></v-select>
  </div>
</template>
<script>
import vSelect from "vue-select"
  export default {
    components: {vSelect},

    data() {
      return {
        selected: null,
        options: ['foo','bar','baz']
      }
    }
  }
</script>
```