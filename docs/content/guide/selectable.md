---
title: Limiting Selections
section: Use Cases
description: Disable individual options with the selectable prop, and cap how many options can be selected.
---

## The `selectable` Prop

`selectable` is a function that receives an option and returns whether it can be selected. Options
it returns `false` for stay in the list, but they're disabled:

- they get the `vs__dropdown-option--disabled` class and `aria-disabled="true"`,
- clicking them does nothing,
- the keyboard highlight skips over them,
- calling `select()` through a [template ref](/api/methods) ignores them too.

```js
selectable: (option) => true // the default
```

## Example: Disabling Some Options

Here the options are book objects, and books by one author can't be chosen:

```js
{ title: 'Right Ho, Jeeves', author: { firstName: 'P.G.', lastName: 'Woodhouse' } }
```

Each option is passed to `selectable`, which checks the author:

::guide-selectable-author
::

```vue
<script setup>
import VueSelect from 'vue-select'
import { books } from './data'
</script>

<template>
  <VueSelect
    placeholder="Choose a book to read"
    label="title"
    :options="books"
    :selectable="(book) => book.author.lastName !== 'Woodhouse'"
  >
    <template #option="{ title, author }">
      {{ title }} <em style="opacity: 0.7">({{ author.lastName }})</em>
    </template>
  </VueSelect>
</template>
```

If users need to know *why* an option is disabled, say so in the [option slot](/guide/slots#option-templates).

## Limiting the Number of Selections

`selectable` can also cap how many options a multiple select accepts. The function doesn't have
to look at the option at all: here every option becomes unselectable once three books are
selected. Removing a book makes the rest selectable again.

::guide-selectable-limit
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'
import { books } from './data'

const selected = ref([])
</script>

<template>
  <VueSelect
    v-model="selected"
    multiple
    placeholder="Choose up to 3 books!"
    label="title"
    :options="books"
    :selectable="() => selected.length < 3"
  />
</template>
```

Consider telling users about the limit up front, as the placeholder does here, or in a hint
connected with `aria-describedby` through [`inputAttrs`](/guide/accessibility#input-attributes).
