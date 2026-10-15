---
title: Events
section: API
description: Every event emitted by the VueSelect component, with its payload and when it fires.
---

Listen to events with `v-on` / `@`, e.g. `@option:selected="onSelected"`. Option payloads are always
the full option, even when [`reduce`](/api/props#reduce) changes the value bound with `v-model`.

::callout{type="note" title="Coming from v3?"}
The `input` event is now `update:modelValue`, so `@input` becomes `@update:model-value`. `v-model`
needs no change. See the [upgrade guide](/guide/upgrade).
::

## Overview

| Event | Payload |
| --- | --- |
| [update:modelValue](#updatemodelvalue) | `value: unknown` |
| [update:open](#updateopen) | `value: boolean` |
| [open](#open) | none |
| [close](#close) | none |
| [clear](#clear) | none |
| [search](#search) | `search: string, toggleLoading: (value?: boolean) => void` |
| [search:focus](#searchfocus) | none |
| [search:blur](#searchblur) | none |
| [search:keydown](#searchkeydown) | `event: KeyboardEvent` |
| [search:input](#searchinput) | `event: Event` |
| [search:compositionstart](#searchcompositionstart) | `event: CompositionEvent` |
| [search:compositionend](#searchcompositionend) | `event: CompositionEvent` |
| [option:created](#optioncreated) | `option: OptionValue` |
| [option:selecting](#optionselecting) | `option: OptionValue` |
| [option:selected](#optionselected) | `option: OptionValue` |
| [option:deselecting](#optiondeselecting) | `option: OptionValue` |
| [option:deselected](#optiondeselected) | `option: OptionValue` |

Try it: the list below the select shows the ten most recent events, newest first.

::api-event-log
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const options = ref(['Canada', 'Mexico', 'United States'])
const selected = ref([])
const log = ref([])
let count = 0

// Keep the 10 most recent events, newest first
function record(event, ...args) {
  const payload = args.map((arg) => JSON.stringify(arg)).join(', ')
  log.value = [{ id: count++, text: `${event}(${payload})` }, ...log.value].slice(0, 10)
}
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="options"
    multiple
    taggable
    @update:model-value="(value) => record('update:modelValue', value)"
    @update:open="(value) => record('update:open', value)"
    @open="record('open')"
    @close="record('close')"
    @clear="record('clear')"
    @search="(search) => record('search', search)"
    @search:focus="record('search:focus')"
    @search:blur="record('search:blur')"
    @search:keydown="(event) => record('search:keydown', event.key)"
    @option:created="(option) => record('option:created', option)"
    @option:selecting="(option) => record('option:selecting', option)"
    @option:selected="(option) => record('option:selected', option)"
    @option:deselecting="(option) => record('option:deselecting', option)"
    @option:deselected="(option) => record('option:deselected', option)"
  />
  <ul>
    <li v-for="entry in log" :key="entry.id">
      <code>{{ entry.text }}</code>
    </li>
  </ul>
</template>
```

## update:modelValue

Emitted with the new value whenever the selection changes: selecting or deselecting an option, the
clear button, Backspace, switching [`multiple`](/api/props#multiple), and
[`resetOnOptionsChange`](/api/props#resetonoptionschange). `v-model` listens to it.

In multiple mode the payload is the whole new array. With [`reduce`](/api/props#reduce), it holds
reduced values. An empty selection is `null` in single mode and `[]` in multiple mode.

- **Payload:** `value: unknown`

```vue
<VueSelect :model-value="country" :options="options" @update:model-value="store.setCountry" />
```

## update:open

Emitted when VueSelect wants to open or close the dropdown: typing, the arrow keys, the toggle
button, selecting an option, or the input losing focus. It fires whether or not the
[`open`](/api/props#open) prop is bound. `v-model:open` listens to it; when `open` is bound, the
dropdown only changes if you update the prop.

- **Payload:** `value: boolean`, the requested state

```vue
<VueSelect v-model:open="isOpen" :options="options" />
```

## open

Emitted when the dropdown opens. When the [`open`](/api/props#open) prop is bound, it's emitted when
the bound value changes to `true`.

- **Payload:** none

## close

Emitted when the dropdown closes. When the [`open`](/api/props#open) prop is bound, it's emitted
when the bound value changes to `false`.

- **Payload:** none

## clear

Emitted when the clear button clears the selection, or when you call
[`clearSelection()`](/api/methods#clearselection) on a template ref. It fires after
`update:modelValue`. Removing the last option with Backspace or a deselect button doesn't emit it.

- **Payload:** none

```vue
<VueSelect v-model="selected" :options="options" @clear="search = ''" />
```

## search

Emitted when the search text changes: when the user types, when Escape or blur clears the text, or
when you set [`search`](/api/methods#search) on a template ref. It isn't emitted when the text is
cleared after selecting an option. When [`clearSearchOnBlur`](/api/props#clearsearchonblur)
applies, blur emits it with an empty string even if the text was already empty.

The second argument toggles the loading state, which shows the spinner and hides the dropdown. Call
it with `true` or `false`, or with no argument to flip the current state.

- **Payload:** `search: string, toggleLoading: (value?: boolean) => void`

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const options = ref([])

async function onSearch(search, toggleLoading) {
  if (!search) return
  toggleLoading(true)
  const response = await fetch(`/api/countries?q=${encodeURIComponent(search)}`)
  options.value = await response.json()
  toggleLoading(false)
}
</script>

<template>
  <VueSelect :options="options" :filterable="false" @search="onSearch" />
</template>
```

See [AJAX](/guide/ajax).

## search:focus

Emitted when the search input receives focus. With `:searchable="false"`, it's emitted for the
focusable select-only element.

- **Payload:** none

## search:blur

Emitted when the search input loses focus. With `:searchable="false"`, it's emitted for the
focusable select-only element.

- **Payload:** none

## search:keydown

Emitted for every `keydown` in the search input (or the select-only element), including keys
VueSelect handles. To change what a key does, use [`mapKeydown`](/api/props#mapkeydown) instead.

- **Payload:** `event: KeyboardEvent`

## search:input

Emitted for the search input's native `input` event. Use [`search`](#search) for the text itself.

- **Payload:** `event: Event`

## search:compositionstart

Emitted when an IME composition starts in the search input. VueSelect ignores key handling until it
ends.

- **Payload:** `event: CompositionEvent`

## search:compositionend

Emitted when an IME composition ends in the search input.

- **Payload:** `event: CompositionEvent`

## option:created

Emitted when the user selects a new option created from the search text with
[`taggable`](/api/props#taggable). It fires after [`option:selecting`](#optionselecting) and before the
value updates. VueSelect doesn't add the option to `options`; do it here if you want to keep it.

- **Payload:** `option: OptionValue`, the option built by [`createOption`](/api/props#createoption)

```vue
<VueSelect
  v-model="tags"
  :options="options"
  taggable
  multiple
  @option:created="(option) => options.push(option)"
/>
```

## option:selecting

Emitted when an option is chosen, before the value updates. It's also emitted when the chosen
option is already selected; then [`deselectFromDropdown`](/api/props#deselectfromdropdown) decides
whether it's deselected.

- **Payload:** `option: OptionValue`

## option:selected

Emitted after the value updates with a newly selected option.

- **Payload:** `option: OptionValue`

```vue
<VueSelect :options="options" @option:selected="(option) => analytics.track('select', option)" />
```

## option:deselecting

Emitted when an option is removed, before the value updates: by its deselect button, Backspace,
[`deselectFromDropdown`](/api/props#deselectfromdropdown), or
[`deselect()`](/api/methods#deselect) on a template ref. The clear button doesn't emit it; listen
to [`clear`](#clear) instead.

- **Payload:** `option: OptionValue`

## option:deselected

Emitted after an option is removed from the value. Like
[`option:deselecting`](#optiondeselecting), it isn't emitted by the clear button.

- **Payload:** `option: OptionValue`

## Order of events

Selecting a new tag from the dropdown, with the default `closeOnSelect`, emits:

1. `option:selecting`
2. `option:created`
3. `update:modelValue`
4. `option:selected`
5. `update:open` (`false`), then `close`

Deselecting emits `option:deselecting`, `update:modelValue`, then `option:deselected`.
