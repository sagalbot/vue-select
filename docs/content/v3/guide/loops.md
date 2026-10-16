---
title: "Using in Loops"
section: "v3 · Use Cases"
version: v3
---

### Using Vue Select in v-for Loops
---

There may be times that you are including Vue Select within loops of data, such as a table. This can
pose some challenges when emitting events from the component, as you won't know which Vue Select 
instance emitted it. This can make it difficult to wire up with things like Vuex. 

Fortunately, you can solve this problem with an anonymous function. The example below doesn't use
Vuex just to keep things succinct, but the same solution would apply. The `@input` is handled 
with an inline anonymous function, allowing the selected country to be passed to the `updateCountry`
method with the `country` and the `person` object.  

```vue
<template>
  <table>
    <tr>
      <th>Name</th>
      <th>Country</th>
    </tr>
    <tr v-for="person in people" :key="person.name">
      <td>{{ person.name }}</td>
      <td>
        <v-select
          :options="options"
          :value="person.country"
          @input="(country) => updateCountry(person, country)"
        />
      </td>
    </tr>
  </table>
</template>

<script>
import countries from '../data/countries'

export default {
  data: () => ({
    people: [
      { name: 'John', country: '' },
      { name: 'Jane', country: '' },
    ],
  }),
  computed: {
    options: () => countries,
  },
  methods: {
    updateCountry(person, country) {
      person.country = country
    },
  },
}
</script>

<style scoped>
table {
  display: table;
  width: 100%;
}
</style>
```
