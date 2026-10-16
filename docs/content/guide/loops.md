---
title: Using in Loops
section: Use Cases
description: Render Vue Select inside v-for, know which row changed, and label each instance.
---

Vue Select works inside `v-for` like any other component. Each instance generates its own element
ids, so several selects on one page never clash.

## Binding to Each Item

The simplest case needs nothing special: bind `v-model` to a property of the loop item.

```vue
<tr v-for="person in people" :key="person.id">
  <td>{{ person.name }}</td>
  <td><VueSelect v-model="person.country" :options="countries" /></td>
</tr>
```

## Knowing Which Instance Changed

Sometimes you need to do more than assign the value: call a store action, send a request, or log
the change. The `update:modelValue` event only carries the new value, so pass the loop item along
with an inline arrow function:

::guide-loops
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'
import { countries } from './data'

const people = ref([
  { name: 'John', country: null },
  { name: 'Jane', country: null },
])

const log = ref('')

function updateCountry(person, country) {
  person.country = country
  log.value = `${person.name}: ${country ?? 'cleared'}`
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Country</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="person in people" :key="person.name">
        <td>{{ person.name }}</td>
        <td>
          <VueSelect
            :model-value="person.country"
            :options="countries"
            :input-attrs="{ 'aria-label': `Country for ${person.name}` }"
            @update:model-value="(country) => updateCountry(person, country)"
          />
        </td>
      </tr>
    </tbody>
  </table>
  <pre>Last change: {{ log || 'none' }}</pre>
</template>
```

The same pattern works for any event, for example
`@option:selected="(option) => track(person, option)"`.

## Labels in Tables and Lists

A select in a table row usually has no visible `<label>`. Give each instance an accessible name
through [`inputAttrs`](/guide/accessibility#input-attributes) that says which row it belongs to,
like "Country for Jane" above. Otherwise screen reader users hear the same unlabelled field in
every row.
