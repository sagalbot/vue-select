---
title: "Dropdown Opening"
section: "v3 · Customizing"
version: v3
---

## Default Dropdown Behaviour

By default, the dropdown will open anytime the underlying search input has focus. The dropdown will
open when clicked, or when it has received focus when tabbing through inputs.

## Customizing Dropdown Behaviour :badge{text="v3.12.0+"}

The `dropdownShouldOpen` prop allows for full customization of the open/close behaviour. The prop
accepts a `function` that should return a `boolean` value. The returned boolean value will be used
to determine if the dropdown should be `open`/`true` or `false`/`closed`. The function receives the
instance of the component as the only argument.

#### Example: Open the dropdown when search text is present
--- 

In this example, we will wait to show the dropdown until the user has started typing. However, if a
country has already been selected, we will display the dropdown right away.

```vue
<template>
  <v-select
    v-model="country"
    :options="countries"
    :dropdown-should-open="dropdownShouldOpen"
  />
</template>

<script>
import countries from '../data/countries.js'

export default {
  data() {
    return {
      countries,
      country: null,
    }
  },
  methods: {
    dropdownShouldOpen(VueSelect) {
      if (this.country !== null) {
        return VueSelect.open
      }

      return VueSelect.search.length !== 0 && VueSelect.open
    },
  },
}
</script>
```
