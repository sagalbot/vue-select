---
title: Dropdown Opening
section: Customizing
description: When the dropdown opens and closes, how to open it on focus, and how to control it yourself with v-model:open.
---

## Default Behavior

Following the [WAI-ARIA combobox pattern](/guide/accessibility), the dropdown opens when the user:

- types in the search input,
- presses <kbd>↓</kbd> or <kbd>↑</kbd> (or <kbd>Space</kbd> while it's closed and the search is empty),
- clicks or taps the toggle button (the chevron).

Focusing the field, by tabbing to it or clicking it, only moves focus. Keyboard and screen reader
users can move through a form without every select popping open, and screen readers can finish
announcing the field.

The dropdown closes when an option is selected (see `closeOnSelect` below), on <kbd>Escape</kbd>,
when the toggle button is used again, and when the input loses focus.

With `:searchable="false"`, the field behaves like a native `<select>`: a click anywhere on it
toggles the dropdown.

::callout{type="note" title="Coming from Vue Select 3?"}
Vue Select 3 opened the dropdown whenever the input received focus. Set `open-on-focus` to keep
that behavior.
::

## Opening on Focus

Set `open-on-focus` to open the dropdown as soon as the input receives focus, including from a click
anywhere in the field:

```vue
<VueSelect open-on-focus :options="countries" />
```

::vue-select{open-on-focus :options='["Canada","United States","Mexico"]'}
::

This suits fields where picking from the list is the main way to fill them in. Consider the
tradeoff for keyboard users, who will see the list open each time they tab through.

## Keeping It Open

By default, selecting an option closes the dropdown. In a multiple select you may want it to stay
open so users can pick several options in a row. Set `:close-on-select="false"`:

```vue
<VueSelect multiple :close-on-select="false" :options="countries" />
```

::vue-select{multiple :close-on-select="false" :options='["Canada","United States","Mexico","Brazil"]'}
::

## Controlling the Open State

Bind the `open` prop to decide yourself when the dropdown is shown. Use `v-model:open` to keep the
default behavior while having access to the state:

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const open = ref(false)
</script>

<template>
  <VueSelect v-model:open="open" :options="countries" />
  <p>The dropdown is {{ open ? 'open' : 'closed' }}.</p>
</template>
```

While `open` is bound, it's the only source of truth. Vue Select never opens or closes the
dropdown on its own: when the user does something that would open or close it, the component emits
`update:open` with the requested state, and you decide whether to apply it. `v-model:open` simply
applies every request.

The `open` and `close` events fire whenever the dropdown actually opens or closes, whether it's
controlled or not.

### Never Opening

`:open="false"` keeps the dropdown closed. It replaces the `noDrop` prop from Vue Select 3.

```vue
<VueSelect :open="false" />
```

This is how you build a free-form tag input: with `taggable`, <kbd>Enter</kbd> still creates tags
while the dropdown is closed. See [Tag Inputs Without a Dropdown](/guide/tagging#tag-inputs-without-a-dropdown).

### Example: Open Only When There Is Search Text

Instead of `v-model:open`, bind `open` to a condition and record the requests in your
`update:open` handler. Here the list opens only once the user has started typing, unless a country
is already selected:

::guide-opening-search-text
::

```vue
<script setup>
import { ref, useTemplateRef } from 'vue'
import VueSelect from 'vue-select'

const select = useTemplateRef('select')
const country = ref(null)

// Whether the component asked to open: typing, arrow keys, the toggle button...
const requested = ref(false)
</script>

<template>
  <VueSelect
    ref="select"
    v-model="country"
    :options="countries"
    :open="requested && (country !== null || !!select?.search)"
    @update:open="(value) => (requested = value)"
    @search:blur="requested = false"
  />
</template>
```

`select.search` reads the current search text through the [template ref](#opening-from-code).
This replaces the `dropdownShouldOpen` prop from Vue Select 3.

## Opening from Code

A [template ref](/api/methods) exposes `open` (readable and writable), `toggleDropdown()`, `focus()` and `blur()`.
Focus the input before opening, so keyboard users can move through the options and the dropdown
closes again when focus leaves:

::guide-opening-external
::

```vue
<script setup>
import { useTemplateRef } from 'vue'
import VueSelect from 'vue-select'

const select = useTemplateRef('select')

function openSelect() {
  select.value.focus()
  select.value.open = true
}
</script>

<template>
  <VueSelect ref="select" :options="countries" />
  <button type="button" @click="openSelect">Choose a country</button>
</template>
```

## While Loading

The dropdown stays hidden while the `loading` prop is true (or while you've turned loading on from
the [`search` event](/guide/ajax)), and appears once loading finishes.
