---
title: "Slots"
section: "v3 · Templating & Styling"
version: v3
---

::callout{type="note" title="🚧"}
This section of the guide is a work in progress! Check back soon for an update.
Vue Select currently offers quite a few scoped slots, and you can check out the
[API Docs for Slots](/v3/api/slots) in the meantime while a good guide is put together.
::

### Scoped Slot `option`

vue-select provides the scoped `option` slot in order to create custom dropdown templates.

```html
<v-select :options="options" label="title">
  <template v-slot:option="option">
    <span :class="option.icon"></span>
    {{ option.title }}
  </template>
</v-select>
```

Using the `option` slot with props `"option"` provides the current option variable to the template.

[Open this example on CodePen →](https://codepen.io/sagalbot/pen/NXBwYG)

### Improving the default `no-options` text

The `no-options` slot is displayed in the dropdown when `filteredOptions === 0`. By default, it
displays _Sorry, no matching options_. You can add more contextual information by using the slot
in your own apps.

```vue
<template>
  <v-select>
    <template v-slot:no-options="{ search, searching }">
      <template v-if="searching">
        No results found for <em>{{ search }}</em
        >.
      </template>
      <em v-else style="opacity: 0.5">Start typing to search for a country.</em>
    </template>
  </v-select>
</template>

<script>
export default {
  name: 'BetterNoOptions',
}
</script>
```
