---
title: Option Filtering
section: Customizing
description: Replace the default option filter to search several fields, ignore accents, or use a fuzzy search library.
---

By default, Vue Select filters the options while the user types: an option matches when its
[label](/guide/options#option-labels) contains the search text, ignoring case. When the search is
empty, every option is shown.

To turn filtering off, for example because your [server does the searching](/guide/ajax), set
`:filterable="false"`.

## The `filter` Prop

To change how options are matched, pass a `filter` function. It receives the options and the
current search text, and returns the options to show, in the order to show them. It's only called
while there is search text.

```js
filter: (options, search) => options
```

::callout{type="note" title="Coming from Vue Select 3?"}
The `filterBy` prop has been removed. Move its logic into `filter`:
`(options, search) => options.filter((option) => filterBy(option, label, search))`.
::

## Searching Several Fields

If your [option slot](/guide/slots#option-templates) shows information that isn't in the label,
users will expect to be able to search for it. This filter matches books by title or by author:

::guide-filter-multiple-keys
::

```vue
<script setup>
import VueSelect from 'vue-select'
import { books } from './data'

function filter(options, search) {
  const query = search.toLocaleLowerCase()
  return options.filter(({ title, author }) =>
    [title, author.firstName, author.lastName].some((text) =>
      text.toLocaleLowerCase().includes(query)
    )
  )
}
</script>

<template>
  <VueSelect :options="books" label="title" :filter="filter">
    <template #option="{ title, author }">
      {{ title }}
      <br />
      <cite>{{ author.firstName }} {{ author.lastName }}</cite>
    </template>
  </VueSelect>
</template>
```

## Ignoring Accents

The default filter treats "e" and "é" as different letters. To let users find "Québec" by typing
"quebec", strip diacritics from both sides before comparing:

::guide-filter-accents
::

```vue
<script setup>
import VueSelect from 'vue-select'

const cities = ['Québec', 'Montréal', 'Trois-Rivières', 'Zürich', 'São Paulo', 'Kraków']

// "Québec" -> "quebec"
const fold = (text) =>
  text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase()

const filter = (options, search) =>
  options.filter((option) => fold(option).includes(fold(search)))
</script>

<template>
  <VueSelect :options="cities" :filter="filter" />
</template>
```

## Fuzzy Search with Fuse.js

For typo-tolerant matching and ranking by relevance, hand the search to a library like
[Fuse.js](https://fusejs.io/). Fuse returns results sorted by score, and the dropdown shows them in
that order.

```vue
<script setup>
import Fuse from 'fuse.js'
import VueSelect from 'vue-select'
import { books } from './data'

function fuseSearch(options, search) {
  const fuse = new Fuse(options, {
    keys: ['title', 'author.firstName', 'author.lastName'],
    shouldSort: true,
  })
  return fuse.search(search).map(({ item }) => item)
}
</script>

<template>
  <VueSelect :options="books" label="title" :filter="fuseSearch" />
</template>
```

Creating the `Fuse` instance on every keystroke is fine for small lists. For large ones, create it
once (in a `computed` based on your options) and only call `search` in the filter.

## Notes

- With [option groups](/guide/options#option-groups), your filter runs first and its results are
  then grouped. Groups appear in the order of their first result, so a sorted result still keeps
  each group's options together.
- With [`taggable`](/guide/tagging), the filter runs even when `filterable` is false, and the new tag is
  added to the top of whatever your filter returns.
- To limit how many options are rendered, slice the result in your filter, or use
  [pagination](/guide/pagination).
