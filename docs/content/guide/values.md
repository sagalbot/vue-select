---
title: Selecting Values
section: Getting Started
description: Bind the selection with v-model, select multiple values, transform selections with reduce, and react to clearing.
---

## Getting and Setting

### `v-model`

Bind the selection to your component's state with `v-model`. It works with any kind of option:
strings, numbers or objects.

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const selected = ref(null)
</script>

<template>
  <VueSelect v-model="selected" :options="['Canada', 'United States']" />
</template>
```

When nothing is selected, a single select's value is `null`. With the `multiple` prop, the value
is always an array, and an empty selection is `[]`.

::guide-values-v-model
::

### `modelValue` and `update:modelValue`

`v-model` is shorthand for the `modelValue` prop and the `update:modelValue` event. Use them
directly when the value lives somewhere you can't (or shouldn't) assign to, like a store that
changes through actions.

```vue
<VueSelect :model-value="selected" @update:model-value="setSelected" />
```

When you bind `modelValue` yourself, you're responsible for updating it when `update:modelValue`
fires. Vue Select never changes a bound value on its own.

If you don't bind a value at all, Vue Select keeps track of the selection internally.

#### Using a Store

With [Pinia](https://pinia.vuejs.org/), use `storeToRefs` and `v-model` binds straight to the store
state:

```vue
<script setup>
import { storeToRefs } from 'pinia'
import VueSelect from 'vue-select'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
const { country } = storeToRefs(settings)
</script>

<template>
  <VueSelect v-model="country" :options="settings.countries" />
</template>
```

If the store should only change through an action, bind the value and call the action from the
event instead:

```vue
<VueSelect
  :model-value="settings.country"
  :options="settings.countries"
  @update:model-value="settings.setCountry"
/>
```

## Single and Multiple

By default, Vue Select selects a single value. To select several, add the `multiple` prop, just as
you would on an HTML `<select>` element.

```vue
<VueSelect v-model="selected" multiple :options="['Canada', 'United States']" />
```

::vue-select{multiple :options='["Canada","United States","Mexico"]'}
::

Changing `multiple` while the component is mounted resets the value to `null` or `[]`.

### Hiding Selected Options

In a multiple select, the selected options stay in the dropdown and are highlighted as selected. If
you'd rather remove them from the list, add `hide-selected`:

```vue
<VueSelect v-model="selected" multiple hide-selected :options="options" />
```

::vue-select{multiple hide-selected :options='["Canada","United States","Mexico","Brazil","Argentina"]'}
::

## Transforming Selections

When the options are objects, Vue Select selects the whole object. That makes no assumptions about
the data you need, but often you only want one property, like an id.

### Returning a Single Key with `reduce`

The `reduce` prop transforms an option before it's passed to `v-model`. Consider this data:

```js
const options = [{ code: 'CA', country: 'Canada' }]
```

To display the `country` but get the `code` in `v-model`, reduce each option to its code:

```vue
<VueSelect
  v-model="selected"
  :options="options"
  :reduce="(option) => option.code"
  label="country"
/>
```

`reduce` also works for deeply nested values:

```js
const options = [
  { country: 'Canada', meta: { code: 'CA', provinces: 13 } },
  { country: 'United States', meta: { code: 'US', provinces: 50 } },
]
```

```vue
<VueSelect
  v-model="selected"
  label="country"
  :options="options"
  :reduce="(country) => country.meta.code"
/>
```

::guide-reduce-nested
::

### Caveats with `reduce`

With `reduce`, `v-model` holds reduced values, so Vue Select has to find the option each value came
from to show its label. It does this by running each option in `options` through `reduce` until one
matches. If no option matches, it can only display the raw value:

::guide-reduce-no-match
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const options = [
  { label: 'One', id: 1 },
  { label: 'Two', id: 2 },
]

// There is no option with the id 3
const selected = ref(3)
</script>

<template>
  <VueSelect v-model="selected" :options="options" :reduce="(option) => option.id" />
</template>
```

::callout{type="warning" title="Reduced values need their options"}
When you set a reduced value from your own code, for example a saved id when the page loads, the
option it was reduced from must be in `options`.
::

Options the user selects in the component are remembered, so their labels stay put even if
`options` changes afterwards, as it does when [loading options from a server](/guide/ajax).

## Removing Values

There are several ways to remove a selection:

- The clear button (×) at the end of the field removes every selected value. It's shown in both
  single and multiple selects while there is a value and the dropdown is closed. Hide it with
  `:clearable="false"`.
- In a multiple select, each selected value has its own deselect button.
- Backspace in an empty search input removes the last selected value (only when `clearable` is
  true).
- With `deselect-from-dropdown`, selecting an already selected option in the dropdown deselects it.
  It never empties a select that isn't `clearable`.

### Reacting to Changes

Besides `update:modelValue`, Vue Select emits events that say *what* changed:

| Event                | Payload  | When                                                  |
|----------------------|----------|-------------------------------------------------------|
| `option:selecting`   | `option` | Before an option is selected                          |
| `option:selected`    | `option` | After an option is selected                           |
| `option:deselecting` | `option` | Before a value is removed (deselect button, Backspace) |
| `option:deselected`  | `option` | After a value is removed                              |
| `clear`              | none     | The user cleared the selection with the clear button  |

Clearing emits `clear` and `update:modelValue`, not one `option:deselected` per value. Try it:

::guide-clear-event
::

```vue
<VueSelect
  v-model="selected"
  multiple
  :options="['Canada', 'United States', 'Mexico']"
  @option:deselected="(option) => console.log('deselected', option)"
  @clear="() => console.log('cleared')"
/>
```

See the [events API](/api/events) for the full list.

### Clearing from Code

To clear the selection programmatically, set your `v-model` value to `null` (or `[]` for a multiple
select). If you also want the `clear` event to fire, call `clearSelection()` through a
[template ref](/api/methods):

```vue
<script setup>
import { useTemplateRef } from 'vue'
import VueSelect from 'vue-select'

const select = useTemplateRef('select')
</script>

<template>
  <VueSelect ref="select" v-model="selected" :options="options" />
  <button type="button" @click="select.clearSelection()">Reset</button>
</template>
```

### Resetting When Options Change

If the available options depend on another field, the old selection may no longer make sense when
they change. Set `reset-on-options-change` to clear the selection whenever `options` changes:

```vue
<VueSelect v-model="city" :options="citiesInCountry" reset-on-options-change />
```

For finer control, pass a function. It receives the new options, the old options and the selected
options, and returns whether to reset:

```vue
<VueSelect
  v-model="city"
  :options="citiesInCountry"
  :reset-on-options-change="(newOptions, oldOptions, selected) =>
    !selected.every((city) => newOptions.includes(city))"
/>
```

`reset-on-options-change` is ignored when `taggable` is set.

## Tagging

To let users enter values that aren't in `options`, use the `taggable` prop. See
[Tagging](/guide/tagging).
