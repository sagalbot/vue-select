---
title: Props
section: API
description: Every prop accepted by the VueSelect component, with its type, default value and an example.
---

::callout{type="note" title="Coming from v3?"}
v4 removes or replaces several v3 props, including `value`, `appendToBody`, `noDrop`,
`dropdownShouldOpen`, `pushTags`, `filterBy`, `components`, `inputId`, `tabindex`, `selectOnTab` and
`selectOnKeyCodes`. The [upgrade guide](/guide/upgrade) lists each one with its replacement.
::

Props can be written in camelCase or kebab-case. The examples on this page use kebab-case in
templates, e.g. `:get-option-label`.

In the types below, `Option` is the type of your options (see [TypeScript](#typescript)). Without
TypeScript, or when it can't be inferred, it is `OptionValue`: `string | number | object`.

## Overview

| Prop | Default |
| --- | --- |
| [appendTo](#appendto) | `undefined` |
| [ariaLabels](#arialabels) | `{}` |
| [autoscroll](#autoscroll) | `true` |
| [calculatePosition](#calculateposition) | sets `top`, `left` and `width` |
| [clearable](#clearable) | `true` |
| [clearSearchOnBlur](#clearsearchonblur) | `undefined` (see below) |
| [clearSearchOnSelect](#clearsearchonselect) | `true` |
| [closeOnSelect](#closeonselect) | `true` |
| [createOption](#createoption) | see below |
| [deselectFromDropdown](#deselectfromdropdown) | `false` |
| [dir](#dir) | `'auto'` |
| [disabled](#disabled) | `false` |
| [filter](#filter) | case-insensitive label match |
| [filterable](#filterable) | `true` |
| [getOptionKey](#getoptionkey) | see below |
| [getOptionLabel](#getoptionlabel) | see below |
| [groupBy](#groupby) | `undefined` |
| [hideSelected](#hideselected) | `false` |
| [inputAttrs](#inputattrs) | `{}` |
| [label](#label) | `'label'` |
| [loading](#loading) | `false` |
| [mapKeydown](#mapkeydown) | `undefined` |
| [modelValue](#modelvalue) | `undefined` |
| [multiple](#multiple) | `false` |
| [open](#open) | `undefined` |
| [openOnFocus](#openonfocus) | `false` |
| [options](#options) | `[]` |
| [placeholder](#placeholder) | `''` |
| [reduce](#reduce) | `undefined` |
| [resetOnOptionsChange](#resetonoptionschange) | `false` |
| [searchable](#searchable) | `true` |
| [selectable](#selectable) | `undefined` (every option is selectable) |
| [taggable](#taggable) | `false` |
| [transition](#transition) | `'vs__fade'` |

## TypeScript

`VueSelect` is a generic component. The option type is inferred from the `options` prop and flows
into the callback props (`reduce`, `getOptionLabel`, `filter`, ...), the slot props and the
`option:*` events, so callbacks written inline in the template are typed without annotations:

```vue
<script setup lang="ts">
import VueSelect from 'vue-select'

interface Country {
  code: string
  name: string
}

const countries: Country[] = [
  { code: 'CA', name: 'Canada' },
  { code: 'MX', name: 'Mexico' },
]
</script>

<template>
  <!-- country is a Country in both callbacks -->
  <VueSelect
    :options="countries"
    :get-option-label="(country) => country.name"
    :reduce="(country) => country.code"
  />
</template>
```

Options declared with an `interface` are accepted. To type a callback defined in `<script>`, index
`VueSelectProps<Option>` with the prop name:

```ts
import type { VueSelectProps } from 'vue-select'

const reduce: VueSelectProps<Country>['reduce'] = (country) => country.code
const filter: VueSelectProps<Country>['filter'] = (options, search) =>
  options.filter((country) => country.name.startsWith(search))
```

The package also exports `OptionValue`, `OptionKey`, `AriaLabels`, `CalculatePosition`,
`KeydownHandlers` and `ComboBoxContext`. `modelValue` and `update:modelValue` are typed `unknown`,
because [`reduce`](#reduce) can turn the selection into any value.

## appendTo

Teleports the dropdown menu to another element, such as `body`, with Vue's `<Teleport>`. Use it when
an ancestor with `overflow: hidden` or a stacking context cuts off the dropdown. While the menu is
teleported, [`calculatePosition`](#calculateposition) positions it every time it opens. The menu
moves after the component mounts, so server rendering and hydration work as usual, and it carries
the component's [`dir`](#dir).

- **Type:** `string | HTMLElement` (a CSS selector or an element)
- **Default:** `undefined` (the menu renders inside the component)

```vue
<VueSelect :options="options" append-to="body" />
```

A teleported menu is no longer inside the `.v-select` element. Selectors such as
`.my-select .vs__dropdown-menu`, and CSS variables set on the component rather than on `:root`, don't
reach it. See [Dropdown Position](/guide/positioning).

## ariaLabels

Text for the accessible names of the controls VueSelect renders. Set any subset of the keys; the
others keep their English defaults. See [Localization](/guide/localization).

- **Type:** `AriaLabels`
- **Default:** `{}`

| Key | Type | Labels | Default |
| --- | --- | --- | --- |
| `toggle` | `string` | the toggle button around the open indicator | `'Toggle options'` |
| `listbox` | `string` | the dropdown list of options | `'Options'` |
| `search` | `string` | the search input, only when `inputAttrs` has no `id`, `aria-label` or `aria-labelledby` | `'Search for option'` |
| `clear` | `string` | the clear button | `'Clear Selected'` |
| `deselect` | `(label: string, option: OptionValue) => string` | each selected tag's deselect button | ``(label) => `Deselect ${label}` `` |

```vue
<VueSelect
  :options="options"
  :aria-labels="{
    toggle: 'Optionen anzeigen',
    listbox: 'Länder',
    search: 'Land suchen',
    clear: 'Auswahl löschen',
    deselect: (label) => `${label} entfernen`,
  }"
/>
```

## autoscroll

When the highlighted option changes, scroll the dropdown so the option is fully visible.

- **Type:** `boolean`
- **Default:** `true`

## calculatePosition

Positions the dropdown when [`appendTo`](#appendto) is set. It runs each time the dropdown opens,
after the menu is rendered. If it returns a function, that function runs when the dropdown closes
or the component unmounts, so you can remove listeners you added.

- **Type:** `CalculatePosition`

```ts
type CalculatePosition = (
  menu: HTMLElement,
  ctx: ComboBoxContext,
  position: { width: string; top: string; left: string; toggle: HTMLElement }
) => void | (() => void)
```

- **Default:** below the toggle, at the same width: copies `top`, `left` and `width` onto the
  menu's inline styles:

```js
(menu, ctx, { width, top, left }) => {
  menu.style.top = top
  menu.style.left = left
  menu.style.width = width
}
```

`position` holds pixel values measured from the toggle (`.vs__dropdown-toggle`): its width, and the
document coordinates of its bottom-left corner, plus `toggle`, the toggle element itself. `ctx` is
the combobox context (`ComboBoxContext`); for example `ctx.open.value` is the open state.

This version uses [Floating UI](https://floating-ui.com) to flip the menu above the field when there
is no room below, and to follow the field while the page scrolls:

```vue
<script setup>
import { autoUpdate, computePosition, flip } from '@floating-ui/dom'
import VueSelect from 'vue-select'

function calculatePosition(menu, ctx, { width, toggle }) {
  menu.style.width = width
  // autoUpdate returns its own cleanup function
  return autoUpdate(toggle, menu, async () => {
    const { x, y } = await computePosition(toggle, menu, {
      placement: 'bottom-start',
      middleware: [flip()],
    })
    Object.assign(menu.style, { left: `${x}px`, top: `${y}px` })
  })
}
</script>

<template>
  <VueSelect :options="options" append-to="body" :calculate-position="calculatePosition" />
</template>
```

## clearable

Shows the clear button (`.vs__clear`) while something is selected and the dropdown is closed, in
both single and multiple mode. When `false`, Backspace in an empty search no longer removes the last
selection, and [`deselectFromDropdown`](#deselectfromdropdown) never leaves the value empty.

- **Type:** `boolean`
- **Default:** `true`

::vue-select{:options='["Canada","Mexico","United States"]' :clearable="false"}
::

```vue
<VueSelect :options="options" :clearable="false" />
```

## clearSearchOnBlur

Clears the search text when the input loses focus.

- **Type:** `boolean`
- **Default:** `undefined`, which means `true` for single selects with
  [`clearSearchOnSelect`](#clearsearchonselect) enabled, and `false` otherwise

```vue
<!-- keep the typed text when the user tabs away -->
<VueSelect :options="options" :clear-search-on-blur="false" />
```

## clearSearchOnSelect

Clears the search text after an option is selected.

- **Type:** `boolean`
- **Default:** `true`

```vue
<!-- keep the search while picking several matches -->
<VueSelect :options="options" multiple :clear-search-on-select="false" :close-on-select="false" />
```

## closeOnSelect

Closes the dropdown after an option is selected. Set it to `false` to pick several options in a row
in multiple mode.

- **Type:** `boolean`
- **Default:** `true`

::vue-select{:options='["Canada","Mexico","United States"]' multiple :close-on-select="false"}
::

```vue
<VueSelect :options="options" multiple :close-on-select="false" />
```

## createOption

Builds a new option from the search text when [`taggable`](#taggable) is on. VueSelect calls it while
the user types, to offer the new option at the top of the list, so keep it free of side effects. To
reject the text, throw: no new option is offered.

- **Type:** `(search: string) => Option`
- **Default:** returns an object `{ [label]: search }` when the first option in `options` is an
  object, otherwise the search string itself

```vue
<script setup>
function createOption(search) {
  if (!search.includes('@')) throw new Error('Not an email address')
  return { email: search }
}
</script>

<template>
  <VueSelect v-model="recipients" :options="contacts" label="email" multiple taggable :create-option="createOption" />
</template>
```

## deselectFromDropdown

Lets the user deselect an option by choosing it again in the dropdown. A highlighted selected option
gets the `vs__dropdown-option--deselect` class. The value is never left empty when
[`clearable`](#clearable) is `false`.

- **Type:** `boolean`
- **Default:** `false`

::vue-select{:options='["Canada","Mexico","United States"]' multiple deselect-from-dropdown :close-on-select="false"}
::

```vue
<VueSelect :options="options" multiple deselect-from-dropdown />
```

## dir

Text direction, set as the `dir` attribute of the root `.v-select` element, and of the dropdown
menu when it is teleported with [`appendTo`](#appendto).

- **Type:** `'ltr' | 'rtl' | 'auto'`
- **Default:** `'auto'`

::vue-select{:options='["كندا","المكسيك","الولايات المتحدة"]' dir="rtl"}
::

```vue
<VueSelect :options="options" dir="rtl" />
```

## disabled

Disables the component: the input, the clear, toggle and deselect buttons are disabled and the
dropdown can't open. The root element gets the `vs--disabled` class.

- **Type:** `boolean`
- **Default:** `false`

::vue-select{:options='["Canada","Mexico","United States"]' :model-value='"Canada"' disabled}
::

```vue
<VueSelect v-model="selected" :options="options" disabled />
```

## filter

Filters the options while the user types. It receives all of `options` and the search text, and
returns the options to show. It only runs when there is search text, and not at all when
[`filterable`](#filterable) is `false` (unless [`taggable`](#taggable) is on).

- **Type:** `(options: Option[], search: string) => Option[]`
- **Default:** keeps the options whose label (from [`getOptionLabel`](#getoptionlabel)) contains the
  search text, ignoring case

```vue
<script setup>
// match the country name, or the exact country code
function filter(options, search) {
  const query = search.toLowerCase()
  return options.filter(
    ({ label, code }) => label.toLowerCase().includes(query) || code.toLowerCase() === query
  )
}
</script>

<template>
  <VueSelect :options="countries" :filter="filter" />
</template>
```

See [Option Filtering](/guide/filtering).

## filterable

When `false`, typing doesn't filter the options; the list stays as you pass it in. Use it when you
filter on the server, with the [`search`](/api/events#search) event. Ignored when
[`taggable`](#taggable) is on.

- **Type:** `boolean`
- **Default:** `true`

```vue
<VueSelect :options="results" :filterable="false" @search="fetchResults" />
```

See [AJAX](/guide/ajax).

## getOptionKey

Returns a unique key for an option. VueSelect compares keys to tell whether an option is selected,
uses them as the `key` when rendering options and tags, and to detect when a new tag already exists.

- **Type:** `(option: Option) => string | number`
- **Default:** strings and numbers are their own key; objects use their `id` property when they have
  one, and otherwise a JSON string of the object with its keys sorted

```vue
<VueSelect :options="books" label="title" :get-option-key="(book) => book.isbn" />
```

## getOptionLabel

Returns the text displayed for an option, in the dropdown and for the selection. It is also the
text the default [`filter`](#filter) matches against.

- **Type:** `(option: Option) => string`
- **Default:** strings and numbers are converted to a string; objects return
  `option[label]` (see [`label`](#label)), with a console warning and an empty label when the
  object has no such key

```vue
<VueSelect
  :options="authors"
  :get-option-label="(author) => `${author.firstName} ${author.lastName}`"
/>
```

## groupBy

Groups the options under headers. It returns the group label for an option, or `null` /
`undefined` for options without a group. Ungrouped options render first, and groups appear in the
order of their first option. Keyboard navigation follows the rendered order. When
[`taggable`](#taggable) is on, a new tag stays ungrouped at the top.

Each group renders as `role="group"` labelled by its header. Customize the header with the
[`group-header`](/api/slots#group-header) slot.

- **Type:** `(option: Option) => string | null | undefined`
- **Default:** `undefined` (no groups)

::api-prop-group-by
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
  { label: 'Potato', type: 'Vegetable' },
  { label: 'Water' },
]
const selected = ref(null)
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="options"
    :group-by="(option) => option.type"
  />
</template>
```

## hideSelected

In multiple mode, removes selected options from the dropdown. Has no effect on single selects.

- **Type:** `boolean`
- **Default:** `false`

::vue-select{:options='["Canada","Mexico","United States"]' multiple hide-selected}
::

```vue
<VueSelect :options="options" multiple hide-selected />
```

## inputAttrs

Attributes bound to the search input (or, with `:searchable="false"`, to the focusable
`role="combobox"` element). Use it for an `id` to pair with a `<label for>`, a `name`, a `tabindex`,
an `autocomplete` hint, or `aria-*` attributes such as `aria-describedby`.

When `inputAttrs` has an `id`, `aria-label` or `aria-labelledby`, VueSelect doesn't add its own
`aria-label` (see [`ariaLabels.search`](#arialabels)).

- **Type:** `Record<string, unknown>`
- **Default:** `{}`

```vue
<label for="country">Country</label>
<VueSelect
  :options="countries"
  :input-attrs="{ id: 'country', autocomplete: 'country-name' }"
/>
```

`inputAttrs` overrides the input's default `type` (`search`), `autocomplete` (`off`) and
`placeholder` (from the [`placeholder`](#placeholder) prop), and the select-only element's default
`tabindex`. The state the combobox owns can't be overridden: `role`, `aria-expanded`,
`aria-controls`, `aria-activedescendant`, `aria-autocomplete`, `value` and `disabled` (and
`aria-disabled` on the select-only element).

## label

The key of an option object that holds its display text. Used by the default
[`getOptionLabel`](#getoptionlabel) and [`createOption`](#createoption), and as the key that
wraps string and number options in [slot props](/api/slots#option).

- **Type:** `string`
- **Default:** `'label'`

```vue
<script setup>
const options = [
  { code: 'CA', country: 'Canada' },
  { code: 'US', country: 'United States' },
]
</script>

<template>
  <VueSelect :options="options" label="country" />
</template>
```

## loading

Shows the loading spinner and adds the `vs--loading` class. The dropdown stays hidden while loading
and reappears when loading ends, if it is still open. The `toggleLoading` function passed to the
[`search`](/api/events#search) event changes the same state; a later change of this prop overrides it.

- **Type:** `boolean`
- **Default:** `false`

::vue-select{:options='["Canada","Mexico","United States"]' loading}
::

```vue
<VueSelect :options="options" :loading="isFetching" />
```

## mapKeydown

Customizes keyboard handling in the search input. It receives the default handlers, keyed by
[`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key), and the
combobox context, and returns the handlers to use. Keys without a handler keep the browser's
behavior. Handlers don't run during IME composition.

- **Type:** `(handlers: KeydownHandlers, ctx: ComboBoxContext) => KeydownHandlers`, where
  `KeydownHandlers` is `Record<string, (e: KeyboardEvent) => void>`
- **Default:** `undefined` (the default handlers are used as is)

The default handlers follow the WAI-ARIA combobox examples:

| Mode | Keys with a default handler |
| --- | --- |
| searchable (default) | `ArrowDown`, `ArrowUp`, `Enter`, `Escape`, `Backspace`, `' '` (Space) |
| `:searchable="false"` | `ArrowDown`, `ArrowUp`, `Home`, `End`, `PageDown`, `PageUp`, `Enter`, `' '` (Space), `Tab`, `Escape` |

In the searchable mode, while the dropdown is closed:

- **Enter** does its default action, such as submitting the form. With [`taggable`](#taggable) and
  search text, it creates the tag instead.
- **Escape** closes the dropdown on the first press and clears the search text on the second.
- **Space** opens the dropdown only when the search is empty; otherwise it types a space.

Select with a comma as well as Enter (handy for tagging):

```vue
<VueSelect
  :options="options"
  taggable
  multiple
  :map-keydown="(handlers) => ({ ...handlers, ',': handlers.Enter })"
/>
```

Select the highlighted option with Tab and let focus move on:

```vue
<VueSelect
  :options="options"
  :map-keydown="(handlers, ctx) => ({
    ...handlers,
    Tab: () => ctx.open.value && ctx.typeAheadSelect(),
  })"
/>
```

See [Keydown Events](/guide/keydown).

## modelValue

The selected value, usually bound with `v-model`. In multiple mode it is an array. With
[`reduce`](#reduce), it holds the reduced values instead of the options. Nothing selected is `null`
in single mode and `[]` in multiple mode.

If you don't bind it, VueSelect keeps track of the selection itself.

- **Type:** `unknown` (an option, an array of options, reduced values or `null`)
- **Default:** `undefined`

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const selected = ref('Canada')
</script>

<template>
  <VueSelect v-model="selected" :options="['Canada', 'Mexico', 'United States']" />
</template>
```

See [Selecting Values](/guide/values).

## multiple

Allows selecting several options. The value becomes an array, and each selection renders as a tag
with a deselect button. Changing `multiple` after mount resets the value to `[]` or `null`.

- **Type:** `boolean`
- **Default:** `false`

::vue-select{:options='["Canada","Mexico","United States"]' multiple}
::

```vue
<VueSelect v-model="selected" :options="options" multiple />
```

## open

Controls whether the dropdown is open. Leave it unbound to let VueSelect open and close itself.
Once bound, the prop is the source of truth: VueSelect never opens or closes on its own, it emits
[`update:open`](/api/events#updateopen) with the state it wants, and you decide. Bind it with
`v-model:open`.

- **Type:** `boolean`
- **Default:** `undefined` (uncontrolled)

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const options = ref([])
const tags = ref([])
const open = ref(false)
</script>

<template>
  <!-- never open the dropdown (v3's noDrop); Enter still creates tags -->
  <VueSelect v-model="tags" multiple taggable :open="false" />

  <!-- decide in the handler: only open when there are options to show -->
  <VueSelect
    :options="options"
    :open="open"
    @update:open="(value) => (open = value && options.length > 0)"
  />
</template>
```

Make the decision in the `update:open` handler, as above, rather than in the bound expression:
VueSelect only emits `update:open` when the requested state differs from the bound value, so a
condition in the expression can swallow a request to close.

See [Dropdown Opening](/guide/opening).

## openOnFocus

Opens the dropdown when the input receives focus, including focus from a click. By default the
dropdown opens on typing, Down Arrow or the toggle button, as in the WAI-ARIA examples, and focusing
the input doesn't open it.

- **Type:** `boolean`
- **Default:** `false`

::vue-select{:options='["Canada","Mexico","United States"]' open-on-focus}
::

```vue
<VueSelect :options="options" open-on-focus />
```

## options

The options to choose from: strings, numbers or objects. Objects need a display text, by default
in their `label` key (see [`label`](#label) and [`getOptionLabel`](#getoptionlabel)).

- **Type:** `Option[]`
- **Default:** `[]`

```vue
<VueSelect :options="['Canada', 'Mexico', 'United States']" />
<VueSelect :options="[{ label: 'Canada', code: 'CA' }, { label: 'Mexico', code: 'MX' }]" />
```

See [Dropdown Options](/guide/options).

## placeholder

Shown while nothing is selected: as the input's `placeholder`, or as text in the field with
`:searchable="false"`.

- **Type:** `string`
- **Default:** `''`

::vue-select{:options='["Canada","Mexico","United States"]' placeholder="Choose a country"}
::

```vue
<VueSelect :options="options" placeholder="Choose a country" />
```

## reduce

Transforms the selected option into the value emitted through `v-model`, for example to keep only
an id. The component maps the value back to its option to display the label, and remembers options
that are later removed from `options` (for example when AJAX results change).

- **Type:** `(option: Option) => unknown`
- **Default:** `undefined` (the option itself is the value)

::api-prop-reduce
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const options = [
  { code: 'CA', country: 'Canada' },
  { code: 'MX', country: 'Mexico' },
  { code: 'US', country: 'United States' },
]
const selected = ref('CA')
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="options"
    label="country"
    :reduce="(option) => option.code"
  />
  <p>Selected: <code>{{ JSON.stringify(selected) }}</code></p>
</template>
```

See [Selecting Values](/guide/values).

## resetOnOptionsChange

Clears the selection when `options` changes: when a new array is passed in, or when the array is
changed in place (for example with `push` or `splice`). A function decides case by case: it receives
the new options, the old options and the selected options, and returns whether to clear. After an
in-place change, the new and old options are the same array. Ignored when [`taggable`](#taggable)
is on.

- **Type:** `boolean | ((newOptions: Option[], oldOptions: Option[], selected: Option[]) => boolean)`
- **Default:** `false`

```vue
<!-- clear the selection when it is no longer in the options -->
<VueSelect
  v-model="city"
  :options="citiesInCountry"
  :reset-on-options-change="(newOptions, oldOptions, selected) =>
    selected.some((option) => !newOptions.some((o) => o.id === option.id))"
/>
```

## searchable

When `false`, the field is a select-only combobox: a focusable element that can't be typed into,
like a native `<select>`. Clicking it toggles the dropdown, and the keyboard follows the WAI-ARIA
select-only combobox: the arrow keys, Home/End and PageUp/PageDown move the highlight without
wrapping, Enter, Space, Tab and Alt+Up select, and typing letters highlights the matching option.
The [`search`](/api/slots#search) slot isn't used, and there's no toggle button.

- **Type:** `boolean`
- **Default:** `true`

::vue-select{:options='["Canada","Mexico","United States"]' :searchable="false" placeholder="Choose a country"}
::

```vue
<VueSelect :options="options" :searchable="false" placeholder="Choose a country" />
```

## selectable

Decides whether an option can be selected. Options it rejects stay in the list with the
`vs__dropdown-option--disabled` class and `aria-disabled="true"`, the keyboard skips them, and
[`select()`](/api/methods#select) on a template ref ignores them.

- **Type:** `(option: Option) => boolean`
- **Default:** `undefined` (every option is selectable)

::api-prop-selectable
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'

const options = [
  { label: 'Small', inStock: true },
  { label: 'Medium', inStock: false },
  { label: 'Large', inStock: true },
  { label: 'Extra Large', inStock: false },
]
const size = ref(null)
</script>

<template>
  <VueSelect
    v-model="size"
    :options="options"
    :selectable="(option) => option.inStock"
  />
</template>
```

See [Limiting Selections](/guide/selectable).

## taggable

Lets the user create options that aren't in `options`. While typing, the new option (built by
[`createOption`](#createoption)) appears at the top of the list; selecting it emits
[`option:created`](/api/events#optioncreated). VueSelect doesn't add it to `options`: do that in the
event handler if you want to keep it.

Enter creates the tag from the search text even while the dropdown is closed, so a tag input that
never shows a dropdown works with [`:open="false"`](#open).

- **Type:** `boolean`
- **Default:** `false`

::vue-select{:options='["Canada","Mexico","United States"]' taggable multiple}
::

```vue
<VueSelect
  v-model="selected"
  :options="options"
  taggable
  multiple
  @option:created="(option) => options.push(option)"
/>
```

See [Tagging](/guide/tagging).

## transition

The name of the Vue `<Transition>` around the dropdown menu. The stylesheet ships the `vs__fade`
transition; to use your own, define the classes for its name.

- **Type:** `string`
- **Default:** `'vs__fade'`

```vue
<VueSelect :options="options" transition="slide" />

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.15s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(-0.5rem);
}
</style>
```
