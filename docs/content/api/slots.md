---
title: Slots
section: API
description: Every slot of the VueSelect component, where it renders and the props it receives.
---

VueSelect uses scoped slots to let you replace any part of its markup, from a single icon to the
whole search input. Slots that don't use their props can be written as `<template #clear>`; scoped
slots take their props with `<template #option="{ label }">`.

Slot props are typed: `Option` below is the type of your options, inferred from the `options` prop
(see [TypeScript](/api/props#typescript)).

::callout{type="note" title="Coming from v3?"}
The `components` prop is gone: replace a custom `OpenIndicator` with the
[`open-indicator`](#open-indicator) slot and a custom `Deselect` with the [`deselect`](#deselect)
slot. The [`search`](#search) slot now receives `attributes` and `events` only. See the
[upgrade guide](/guide/upgrade).
::

## Where slots render

```text
div.v-select
├── header
├── div.vs__dropdown-toggle
│   ├── div.vs__selected-options
│   │   ├── selected-option-container        (once per selected option)
│   │   │   └── span.vs__selected
│   │   │       ├── selected-option
│   │   │       └── button.vs__deselect      (multiple only)
│   │   │           └── deselect
│   │   └── search                           (input.vs__search)
│   └── div.vs__actions
│       ├── button.vs__clear
│       │   └── clear
│       ├── button.vs__open-indicator-button
│       │   └── open-indicator
│       └── spinner
├── ul.vs__dropdown-menu                     (role="listbox", named by ariaLabels.listbox)
│   ├── list-header
│   ├── li.vs__dropdown-option               (once per option)
│   │   └── option
│   ├── li.vs__dropdown-group                (once per group, with groupBy)
│   │   └── ul.vs__dropdown-group-options
│   │       ├── li > span.vs__dropdown-group-label
│   │       │   └── group-header
│   │       └── li.vs__dropdown-option …
│   ├── li.vs__no-options                    (when no option matches)
│   │   └── no-options
│   └── list-footer
└── footer
```

## Option slot props

The [`option`](#option) and [`selected-option`](#selected-option) slots receive the option's own
properties as slot props, so you can destructure them: `#option="{ label, code }"`. The
`option` prop of [`selected-option-container`](#selected-option-container) and
[`deselect`](#deselect) is built the same way.

Object options are passed as they are. String and number options are wrapped in an object under
the [`label`](/api/props#label) key: with the default `label`, the option `'Canada'` becomes
`{ label: 'Canada' }`.

## header

Rendered at the top of the component, above `.vs__dropdown-toggle`.

| Prop | Type | Description |
| --- | --- | --- |
| `search` | `string` | the current search text |
| `loading` | `boolean` | whether the component is loading |
| `searching` | `boolean` | whether there is search text |
| `filteredOptions` | `Option[]` | the options matching the search, in rendered order |
| `deselect` | `(option: Option) => void` | deselects an option |

::api-slot-header-footer
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const selected = ref(['Canada'])
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="['Canada', 'Mexico', 'United States']"
    multiple
  >
    <template #header>
      <strong>Countries</strong>
    </template>
    <template #footer="{ deselect }">
      <small>
        {{ selected.length }} selected
        <button
          v-if="selected.length"
          type="button"
          @click="deselect(selected[selected.length - 1])"
        >
          Remove last
        </button>
      </small>
    </template>
  </VueSelect>
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

## selected-option-container

Replaces the whole element rendered for each selected option: `span.vs__selected`, including its
deselect button. If you use it in multiple mode, render your own way to deselect.

| Prop | Type | Description |
| --- | --- | --- |
| `option` | `object` | the selected option, see [option slot props](#option-slot-props) |
| `deselect` | `(option) => void` | deselects an option; accepts the slot's `option` (also for string options) or an original option |
| `multiple` | `boolean` | the [`multiple`](/api/props#multiple) prop |
| `disabled` | `boolean` | the [`disabled`](/api/props#disabled) prop |

::api-slot-selected-option-container
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const selected = ref(['Canada', 'Mexico'])
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="['Canada', 'Mexico', 'United States']"
    multiple
  >
    <template #selected-option-container="{ option, deselect, disabled }">
      <span class="vs__selected">
        {{ option.label }}
        <button
          type="button"
          class="vs__deselect"
          :disabled="disabled"
          :aria-label="`Remove ${option.label}`"
          @click="deselect(option)"
        >
          (remove)
        </button>
      </span>
    </template>
  </VueSelect>
</template>
```

## selected-option

The content of each selected option, inside `span.vs__selected` and before its deselect button.
Defaults to the option's label.

- **Props:** the option's properties, see [option slot props](#option-slot-props)

See the [`option`](#option) slot for an example.

## deselect

The content of the deselect button on each selected option in multiple mode. Defaults to an "x"
icon. The button keeps its accessible name from
[`ariaLabels.deselect`](/api/props#arialabels).

| Prop | Type | Description |
| --- | --- | --- |
| `option` | `object` | the selected option, see [option slot props](#option-slot-props) |

See the [`open-indicator`](#open-indicator) slot for an example.

## search

Replaces the search input. Bind both props to your input: `attributes` holds its attributes (role,
ARIA state, value, the `vs__search` class, a ref VueSelect uses to focus it, plus
[`inputAttrs`](/api/props#inputattrs), with the same precedence as on the default input), and
`events` its event handlers. Without them, the keyboard, focus and screen reader support stop
working.

Not used with `:searchable="false"`.

| Prop | Type | Description |
| --- | --- | --- |
| `attributes` | `Record<string, unknown>` | bind with `v-bind="attributes"` |
| `events` | `Record<string, (e: Event) => void>` | bind with `v-on="events"` |

This example makes the select required in a form: the browser blocks the submit until an option is
chosen.

::api-slot-search
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const selected = ref(null)
const submitted = ref(false)
</script>

<template>
  <form @submit.prevent="submitted = true">
    <VueSelect v-model="selected" :options="['Canada', 'Mexico', 'United States']">
      <template #search="{ attributes, events }">
        <input
          class="vs__search"
          :required="!selected"
          v-bind="attributes"
          v-on="events"
        />
      </template>
    </VueSelect>
    <button type="submit">Submit</button>
    <span v-if="submitted"> Submitted {{ selected }}</span>
  </form>
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

See [Validation](/guide/validation).

## clear

The content of the clear button. Defaults to an "x" icon. The button keeps its accessible name from
[`ariaLabels.clear`](/api/props#arialabels).

- **Props:** none

See the [`open-indicator`](#open-indicator) slot for an example.

## open-indicator

The open indicator, by default a chevron that turns when the dropdown opens. It renders inside the
toggle button (`button.vs__open-indicator-button`), so don't put another button or link inside it.
With `:searchable="false"` there is no toggle button and the indicator is decoration.

| Prop | Type | Description |
| --- | --- | --- |
| `attributes` | `object` | `{ role: 'presentation', 'aria-hidden': 'true', class: 'vs__open-indicator' }`, bind with `v-bind` |

The `vs__open-indicator` class carries the rotation when the dropdown is open.

::api-slot-icons
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const selected = ref(['Canada', 'Mexico'])
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="['Canada', 'Mexico', 'United States']"
    multiple
  >
    <template #open-indicator="{ attributes }">
      <span v-bind="attributes">🔽</span>
    </template>
    <template #clear>🗑️</template>
    <template #deselect="{ option }">
      <span :title="option.label">✖️</span>
    </template>
  </VueSelect>
</template>
```

## spinner

The loading indicator. The default spinner is always rendered and shown while loading; custom
content is always rendered too, so use the `loading` prop to show it.

| Prop | Type | Description |
| --- | --- | --- |
| `loading` | `boolean` | whether the component is loading |

```vue
<VueSelect :options="options" :loading="isLoading">
  <template #spinner="{ loading }">
    <span v-if="loading" class="my-spinner" aria-hidden="true" />
  </template>
</VueSelect>
```

## list-header

Rendered at the top of the dropdown, before the options. The dropdown is a `<ul role="listbox">`,
so use an `<li>` as the root element.

| Prop | Type | Description |
| --- | --- | --- |
| `search` | `string` | the current search text |
| `loading` | `boolean` | whether the component is loading |
| `searching` | `boolean` | whether there is search text |
| `filteredOptions` | `Option[]` | the options matching the search, in rendered order |

::api-slot-list-header-footer
::

```vue
<script setup>
import VueSelect from 'vue-select'

const options = ['Canada', 'Mexico', 'United States', 'Brazil', 'Argentina']
</script>

<template>
  <VueSelect :options="options">
    <template #list-header="{ searching, filteredOptions }">
      <li class="vs__dropdown-option" style="opacity: 0.7">
        <template v-if="searching">
          {{ filteredOptions.length }} of {{ options.length }} match
        </template>
        <template v-else>Type to filter</template>
      </li>
    </template>
    <template #list-footer>
      <li class="vs__dropdown-option" style="opacity: 0.7">End of the list</li>
    </template>
  </VueSelect>
</template>
```

## option

The content of each option in the dropdown, inside `li.vs__dropdown-option` (`role="option"`).
Defaults to the option's label.

- **Props:** the option's properties, see [option slot props](#option-slot-props)

::api-slot-option
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const options = [
  { code: 'CA', label: 'Canada', flag: '🇨🇦' },
  { code: 'MX', label: 'Mexico', flag: '🇲🇽' },
  { code: 'US', label: 'United States', flag: '🇺🇸' },
]
const selected = ref(null)
</script>

<template>
  <VueSelect v-model="selected" :options="options">
    <template #option="{ label, code, flag }">
      {{ flag }} {{ label }} <small>({{ code }})</small>
    </template>
    <template #selected-option="{ label, flag }">
      {{ flag }} {{ label }}
    </template>
  </VueSelect>
</template>
```

## group-header

The header of an option group when you use [`groupBy`](/api/props#groupby), inside
`span.vs__dropdown-group-label`. Defaults to the group label.

| Prop | Type | Description |
| --- | --- | --- |
| `label` | `string` | the group label returned by `groupBy` |
| `options` | `Option[]` | the group's options that match the search |

::api-slot-group-header
::

```vue
<script setup>
import VueSelect from 'vue-select'

const options = [
  { label: 'Apple', type: 'Fruit' },
  { label: 'Banana', type: 'Fruit' },
  { label: 'Carrot', type: 'Vegetable' },
  { label: 'Potato', type: 'Vegetable' },
]
</script>

<template>
  <VueSelect :options="options" :group-by="(option) => option.type">
    <template #group-header="{ label, options }">
      {{ label }} ({{ options.length }})
    </template>
  </VueSelect>
</template>
```

## no-options

Shown in the dropdown, inside `li.vs__no-options`, when there are no options to show. Defaults to
"Sorry, no matching options." Type something that matches no country to see it.

| Prop | Type | Description |
| --- | --- | --- |
| `search` | `string` | the current search text |
| `loading` | `boolean` | whether the component is loading |
| `searching` | `boolean` | whether there is search text |

::api-slot-no-options
::

```vue
<script setup>
import VueSelect from 'vue-select'
</script>

<template>
  <VueSelect :options="['Canada', 'Mexico', 'United States']">
    <template #no-options="{ search }">
      No countries match <em>{{ search }}</em>.
    </template>
  </VueSelect>
</template>
```

## list-footer

Rendered at the bottom of the dropdown, after the options. Use an `<li>` as the root element, as in
[`list-header`](#list-header).

- **Props:** the same as [`list-header`](#list-header)

## footer

Rendered at the bottom of the component, below `.vs__dropdown-toggle`. The dropdown is positioned
against the bottom of the whole component, so it opens below the footer. To keep it attached to the
toggle, teleport it with [`appendTo`](/api/props#appendto).

- **Props:** the same as [`header`](#header)

See the [`header`](#header) slot for an example.
