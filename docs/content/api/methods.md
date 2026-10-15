---
title: Methods
section: API
description: The properties and methods VueSelect exposes to a template ref.
---

Most of the time props, events and slots are all you need. When you have to drive the component from
the outside, for example to focus it or open it from a button, take a
[template ref](https://vuejs.org/guide/essentials/template-refs.html) to it. VueSelect exposes the
members on this page and nothing else.

::callout{type="note" title="Coming from v3?"}
v3 exposed the whole component instance. In v4 only the members below are available; internals
such as `mutableLoading`, `typeAheadPointer` or `$refs.search` are gone. See the
[upgrade guide](/guide/upgrade).
::

```vue
<script setup>
import { useTemplateRef } from 'vue'
import VueSelect from 'vue-select'

const select = useTemplateRef('select')

function focusSelect() {
  select.value.focus()
}
</script>

<template>
  <VueSelect ref="select" :options="options" />
</template>
```

## Overview

| Member | Type |
| --- | --- |
| [open](#open) | `boolean` (read and write) |
| [search](#search) | `string` (read and write) |
| [select](#select) | `(option: OptionValue) => void` |
| [deselect](#deselect) | `(option: OptionValue) => void` |
| [clearSelection](#clearselection) | `() => void` |
| [toggleDropdown](#toggledropdown) | `() => void` |
| [focus](#focus) | `() => void` |
| [blur](#blur) | `() => void` |

::api-methods
::

```vue
<script setup>
import { ref, useTemplateRef } from 'vue'
import VueSelect from 'vue-select'

const select = useTemplateRef('select')
const selected = ref(null)

function open() {
  select.value.focus()
  select.value.open = true
}
</script>

<template>
  <p>
    <!-- mousedown.prevent keeps focus in the select while clicking -->
    <button type="button" @mousedown.prevent @click="open">Open</button>
    <button type="button" @mousedown.prevent @click="select.select('Mexico')">
      Select Mexico
    </button>
    <button type="button" @mousedown.prevent @click="select.clearSelection()">
      Clear
    </button>
  </p>
  <VueSelect
    ref="select"
    v-model="selected"
    :options="['Canada', 'Mexico', 'United States']"
  />
</template>

<style scoped>
button {
  margin: 0.5rem 0.5rem 0.5rem 0;
  padding: 0.125rem 0.75rem;
  border: 1px solid currentColor;
  border-radius: 4px;
}
</style>
```

::callout{type="note" title="Keep focus in the select"}
The dropdown closes when the search input loses focus. Clicking a regular button moves focus to it,
so a button that opens the dropdown should call `focus()` first, and use `@mousedown.prevent` to
keep focus where it is.
::

## open

Whether the dropdown is open. Setting it opens or closes the dropdown (without moving focus): it
emits [`update:open`](/api/events#updateopen) and [`open`](/api/events#open) /
[`close`](/api/events#close), and does nothing while the component is
[`disabled`](/api/props#disabled). When the [`open`](/api/props#open) prop is bound, setting it only
emits `update:open`.

- **Type:** `boolean`

```js
select.value.open = true
```

## search

The current search text. Setting it works like typing: it emits the
[`search`](/api/events#search) event, and a non-empty value opens the dropdown.

- **Type:** `string`

```js
select.value.search = 'Can'
```

## select

Selects an option, with the same events and effects as choosing it in the dropdown: the value
updates, the search text is cleared and the dropdown closes (following
[`clearSearchOnSelect`](/api/props#clearsearchonselect) and
[`closeOnSelect`](/api/props#closeonselect)). Pass the option itself, not its
[`reduce`](/api/props#reduce)d value. [`selectable`](/api/props#selectable) is not checked.

- **Type:** `(option: OptionValue) => void`

```js
select.value.select({ code: 'CA', label: 'Canada' })
```

## deselect

Removes an option from the selection and emits
[`option:deselecting`](/api/events#optiondeselecting) and
[`option:deselected`](/api/events#optiondeselected). Pass the option itself, not its reduced value.
The events are emitted even when the option isn't selected; the value only changes when it is.

- **Type:** `(option: OptionValue) => void`

## clearSelection

Clears the selection, to `null` in single mode or `[]` in multiple mode, and emits
[`clear`](/api/events#clear). It works even when [`clearable`](/api/props#clearable) is `false`.

- **Type:** `() => void`

## toggleDropdown

Opens the dropdown when it's closed and closes it when it's open. Same as toggling
[`open`](#open).

- **Type:** `() => void`

## focus

Moves focus to the search input, or to the select-only element with `:searchable="false"`. Focusing
doesn't open the dropdown unless [`openOnFocus`](/api/props#openonfocus) is set.

- **Type:** `() => void`

## blur

Removes focus from the search input. Blurring closes the dropdown, and clears the search text when
[`clearSearchOnBlur`](/api/props#clearsearchonblur) applies.

- **Type:** `() => void`
