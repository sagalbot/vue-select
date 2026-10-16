---
title: Dropdown Options
section: Getting Started
description: Pass options as strings, numbers or objects, choose how their labels are generated, and group them under headers.
---

## The `options` Prop

Vue Select takes its options as an array through the `options` prop. Each option can be a string, a
number, or an object.

```vue
<!-- an array of strings or numbers -->
<VueSelect :options="['Canada', 'United States']" />
```

::vue-select{:options='["Canada","United States"]'}
::

```vue
<!-- an array of objects -->
<VueSelect :options="[{ label: 'Canada', code: 'ca' }]" />
```

::vue-select{:options='[{"label":"Canada","code":"ca"}]'}
::

`options` must always be an array. If you don't have any options yet, for example while they're
[loading from a server](/guide/ajax), pass an empty array.

## Option Labels

### Strings and Numbers

When the options are strings or numbers, they're used as their own labels. No further configuration
is needed.

### Objects

When the options are objects, Vue Select needs to know which property to display. By default it
renders `option.label`. If your objects use a different key, set it with the `label` prop.

For example, consider options with `countryCode` and `countryName` properties:

```js
const countries = [
  { countryCode: 'CA', countryName: 'Canada' },
  { countryCode: 'US', countryName: 'United States' },
]
```

To display the country name, set `label` to `countryName`:

```vue
<VueSelect label="countryName" :options="countries" />
```

::vue-select{label="countryName" :options='[{"countryCode":"CA","countryName":"Canada"},{"countryCode":"US","countryName":"United States"}]'}
::

If an object doesn't have the `label` key, Vue Select logs a warning in the console and renders an
empty label.

### Computed Labels with `getOptionLabel`

When the label isn't a single property, for example when it's nested or built from several fields,
pass a `getOptionLabel` function instead. It receives an option and returns the text to display.
The same text is used for filtering, so users can search for anything that's in the label.

```vue
<VueSelect
  :options="books"
  :get-option-label="(book) => `${book.title} by ${book.author.lastName}`"
/>
```

`getOptionLabel` takes precedence over `label`.

## Option Keys

Vue Select identifies each option by a key. Keys decide whether an option is selected, so two
options with the same key are treated as the same option. The default `getOptionKey`:

- uses strings and numbers as their own keys,
- uses `option.id` when an object has an `id` property,
- otherwise serializes the object (with its keys sorted, so property order doesn't matter).

If your objects have a different unique field, or they can't be serialized (circular references,
for example), provide your own `getOptionKey`:

```vue
<VueSelect :options="users" label="name" :get-option-key="(user) => user.uuid" />
```

## Option Groups

Long lists are easier to scan when related options sit under a heading. Pass a `groupBy` function
that returns the group label for an option. Options in the same group are rendered together under a
header with that label.

::guide-option-groups
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const options = [
  { label: 'Apple', type: 'Fruit' },
  { label: 'Banana', type: 'Fruit' },
  { label: 'Carrot', type: 'Vegetable' },
  { label: 'Cherry', type: 'Fruit' },
  { label: 'Broccoli', type: 'Vegetable' },
  { label: 'Salt' },
]

const selected = ref(null)
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="options"
    :group-by="(option) => option.type"
    placeholder="Pick an ingredient"
  />
</template>
```

How groups are built:

- `options` stays a flat array. You don't need to restructure your data.
- Groups appear in the order of their first option. Within a group, options keep their order from
  `options`.
- Options for which `groupBy` returns `null` or `undefined` aren't grouped. They're listed first,
  without a header ("Salt" above).
- Filtering happens before grouping, so a group with no matching options is hidden.
- Keyboard navigation follows the order on screen.
- With [`taggable`](/guide/tagging), a new tag is never grouped, so it stays at the top of the
  list.

Groups are rendered with `role="group"` and labelled by their header, so screen readers announce the
group name as the user moves into it. This replaces the old workaround of adding disabled
"heading" options, which assistive technology announces as unavailable options.

To customize the header, use the [`group-header` slot](/guide/slots#group-headers).
