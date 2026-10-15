---
title: Headless primitives
section: Headless
description: Build your own select with the unstyled ComboBox primitives and the useComboBox composable. State, filtering, keyboard navigation and ARIA are handled; the markup and styles are yours.
---

`VueSelect` is built from a set of unstyled components that you can use directly. They handle the
state, filtering, tagging, keyboard navigation and ARIA attributes of a combobox. You decide what
gets rendered and how it looks.

```js
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxButton,
  ComboBoxClear,
  ComboBoxMenu,
  ComboBoxOption,
  ComboBoxGroup,
  useComboBox,
  useComboBoxContext,
  ComboBoxKey,
  comboBoxDefaults,
} from 'vue-select'
```

## When to use them

**Use `VueSelect`** for most fields. It's styled, themable with CSS custom properties, and has
slots for the parts people usually customize: options, selected values, icons, the no-results
message and so on.

**Use the primitives** when you want your own markup and styles throughout, for example to match
a design system or use Tailwind, or when the layout doesn't fit `VueSelect`'s slots: tags rendered
outside the field, a menu with extra content, a different element order. You still get the
behavior and accessibility of `VueSelect` for free.

**Use [`useComboBox`](#usecombobox)** when you need a widget the primitives can't express. It
gives you the same state and methods with no markup at all, so you also write the ARIA attributes
and the keyboard handling yourself.

## A minimal example

A searchable single select. `ComboBox` holds the state and passes `filteredOptions` to its default
slot; the other primitives render the input, the toggle button, the menu and the options.

::headless-basic
::

```vue
<script setup>
import { ref } from 'vue'
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxButton,
  ComboBoxMenu,
  ComboBoxOption,
} from 'vue-select'

const fruits = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango', 'Orange', 'Peach', 'Pear', 'Plum']
const fruit = ref(null)
</script>

<template>
  <label for="fruit">Fruit</label>
  <ComboBox
    v-slot="{ selected, search, filteredOptions }"
    v-model="fruit"
    :options="fruits"
    placeholder="Pick a fruit"
    class="combobox"
  >
    <div class="field">
      <!-- the input shows the search text, so render the selection yourself -->
      <span v-if="selected.length && !search" class="value">{{ selected[0] }}</span>
      <ComboBoxInput id="fruit" class="input" />
      <ComboBoxButton class="toggle" aria-label="Show fruits">▾</ComboBoxButton>
    </div>

    <ComboBoxMenu class="menu">
      <ComboBoxOption
        v-for="(option, index) in filteredOptions"
        :key="option"
        v-slot="{ isHighlighted, isSelected }"
        :value="option"
        :index="index"
      >
        <div class="option" :class="{ highlighted: isHighlighted }">
          {{ option }}<span v-if="isSelected"> ✓</span>
        </div>
      </ComboBoxOption>
      <div v-if="!filteredOptions.length" class="empty">No matching fruit.</div>
    </ComboBoxMenu>
  </ComboBox>
</template>

<style scoped>
.combobox { position: relative; }
.field { display: flex; align-items: center; border: 1px solid #94a3b8; border-radius: 6px; }
.field:focus-within { outline: 2px solid #0ea5e9; outline-offset: 1px; }
.value { padding-left: 0.6rem; white-space: nowrap; }
.input { flex: 1; min-width: 0; padding: 0.4rem 0.6rem; border: 0; outline: none; }
.toggle { padding: 0 0.6rem; border: 0; background: none; cursor: pointer; }
.menu {
  position: absolute;
  z-index: 10;
  width: 100%;
  max-height: 14rem;
  margin-top: 4px;
  overflow-y: auto;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
}
.option { padding: 0.35rem 0.6rem; cursor: pointer; }
.option.highlighted { background: #0369a1; color: #fff; }
[aria-selected='true'] > .option { font-weight: 600; }
.empty { padding: 0.35rem 0.6rem; color: #64748b; }
</style>
```

A few things to notice:

- **Every `ComboBoxOption` needs an `index`**: its position in `filteredOptions`. The index
  connects the option to the keyboard highlight and to `aria-activedescendant`.
- **The input holds the search text, not the selection.** As in `VueSelect`, the selected value is
  rendered next to the input and hidden while the user types.
- **Label the input.** Give `ComboBoxInput` an `id` for a `<label for>`, or an `aria-label` /
  `aria-labelledby`. Attributes you put on `ComboBoxInput` are passed to the `<input>`.
- **Positioning is up to you.** The menu is rendered right after the field; here
  `position: relative` on `ComboBox` and `position: absolute` on the menu make it drop down.

## Anatomy

| Component | Renders | ARIA and behavior |
| --- | --- | --- |
| `ComboBox` | `<div>` around everything | Holds the state and provides it to the other primitives. Closes the dropdown on clicks outside it. Takes the props and emits the events listed [below](#combobox-props-and-events). |
| `ComboBoxInput` | `<input type="search">`, or a `<div>` with `searchable: false` | `role="combobox"`, `aria-expanded`, `aria-controls` (the menu), `aria-activedescendant` (the highlighted option, only while open), `aria-autocomplete="list"`. Handles typing and the [keyboard](#keyboard). The select-only `<div>` gets `tabindex="0"` and `aria-disabled`. |
| `ComboBoxButton` | `<button type="button">` | `tabindex="-1"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`. Toggles the dropdown and moves focus to the input. Give it an `aria-label`. |
| `ComboBoxClear` | `<button type="button">` | `aria-label="Clear selection"` (override it with your own `aria-label`). Hidden while nothing is selected or when `clearable` is false. Clears the value, emits `clear` and moves focus to the input. |
| `ComboBoxMenu` | `<div>` (`as` prop to change) | `role="listbox"`, `tabindex="-1"`, `aria-multiselectable` with `multiple`. Give it an `aria-label` (`VueSelect` uses `ariaLabels.listbox`, "Options" by default). Shown while the dropdown is open (`v-show`), or as the `show` prop says. Keeps the highlighted option scrolled into view, and prevents `mousedown` so the input keeps focus. |
| `ComboBoxOption` | `<div>` (`as` prop to change) | `role="option"`, `aria-selected`, `aria-disabled` when not [selectable](/api/props#selectable). Selects on click, highlights on mouse move. Props: `value`, `index`. |
| `ComboBoxGroup` | `<div role="group">` with a label `<div>` (`as` and `label-as` props to change) | `aria-labelledby` points at the label. Prop: `label`. See [option groups](#option-groups). |

`ComboBoxInput`, `ComboBoxButton`, `ComboBoxClear`, `ComboBoxMenu` and `ComboBoxOption` read their
state from the nearest `ComboBox`. Outside one, they throw an error naming the component. To build
your own primitive, read the same state with `useComboBoxContext('MyComponent')` (see
[Custom primitives](#custom-primitives)).

### Slots on the primitives

- `ComboBox`: the default slot receives the state (`open`, `search`, `selected`, `filteredOptions`,
  `groupedOptions`, `loading`) and methods (`select`, `deselect`, `clearSelection`, `setOpen`,
  `toggleOpen`, `setSearch`, `focusInput`). See [the slot props](#the-combobox-slot).
- `ComboBoxOption`: the default slot receives `{ isSelected, isHighlighted, isDisabled }`.
- `ComboBoxGroup`: the `label` slot receives `{ label }`; the default slot holds the options.
- `ComboBoxInput`: the `input` slot replaces the `<input>` with your own. Bind what it gives you:

  ```vue
  <ComboBoxInput>
    <template #input="{ attributes, events }">
      <MyTextField v-bind="attributes" v-on="events" />
    </template>
  </ComboBoxInput>
  ```

  With `searchable: false`, the default slot is the content of the select-only element, for
  example the selected value.

## The ComboBox slot

`ComboBox`'s default slot gives your template the state it needs to render, and the methods to
change it from your own markup:

| Slot prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Whether the dropdown is open. |
| `search` | `string` | The search text. |
| `selected` | `OptionValue[]` | The selected options. Always an array, even for a single select, and always full options, even with `reduce`. |
| `filteredOptions` | `OptionValue[]` | The options to show, filtered by the search, in the order they render. Includes the new tag when `taggable` is on. |
| `groupedOptions` | `OptionGroup[]` | The same options in groups when `groupBy` is set: `{ label, options: { option, index }[] }[]`. |
| `loading` | `boolean` | The loading state (the `loading` prop, or `toggleLoading` from the `search` event). |
| `select(option)` | function | Select an option (or deselect it, when `deselectFromDropdown` allows). |
| `deselect(option)` | function | Remove an option from the selection, emitting the `option:deselect*` events. |
| `clearSelection()` | function | Clear the value and emit `clear`. |
| `setOpen(open)`, `toggleOpen()` | function | Open or close the dropdown. |
| `setSearch(text)` | function | Set the search text (opens the dropdown when it isn't empty). |
| `focusInput()` | function | Focus the element `ComboBoxInput` rendered. |

A template ref on `ComboBox` exposes the same methods, for code outside the template:

```vue
<script setup>
import { ref } from 'vue'

const combo = ref()

function reset() {
  combo.value.clearSelection()
  combo.value.focusInput()
}
</script>

<template>
  <ComboBox ref="combo" v-model="value" :options="options">…</ComboBox>
</template>
```

### ComboBox props and events

`ComboBox` takes the same behavior props as `VueSelect`, with the same defaults: `modelValue`
(`v-model`), `options`, `multiple`, `label`, `getOptionLabel`, `getOptionKey`, `reduce`,
`selectable`, `filterable`, `filter`, `taggable`, `createOption`, `searchable`, `clearable`,
`closeOnSelect`, `clearSearchOnSelect`, `clearSearchOnBlur`, `deselectFromDropdown`,
`hideSelected`, `groupBy`, `open` (`v-model:open`), `openOnFocus`, `disabled`, `loading`,
`placeholder`, `autoscroll`, `resetOnOptionsChange` and `mapKeydown`. See [Props](/api/props) for
each one. It also takes `uid`, the base for the element ids, which defaults to a `useId()` value.

The styling and positioning props of `VueSelect` (`dir`, `transition`, `inputAttrs`, `appendTo`,
`calculatePosition`, `ariaLabels`) don't exist on `ComboBox`: put those attributes, transitions
and teleports in your own markup.

`ComboBox` emits `update:modelValue`, `update:open`, `open`, `close`, `clear`, `search`,
`option:created`, `option:selecting`, `option:selected`, `option:deselecting` and
`option:deselected`, with the same arguments as `VueSelect`. The `search:*` input events of
`VueSelect` are ordinary DOM events here: listen on `ComboBoxInput`, e.g. `@focus` or `@keydown`.

## Multiple selection

With `multiple`, `selected` holds every selected option. This example renders them as tags with a
remove button that calls the slot's `deselect` and then moves focus back to the input with
`focusInput`, and adds `ComboBoxClear`. `hide-selected` removes
selected options from the menu, and `:close-on-select="false"` keeps it open while picking.
<kbd>Backspace</kbd> in an empty input removes the last tag.

::headless-multiple
::

```vue
<script setup>
import { ref } from 'vue'
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxButton,
  ComboBoxClear,
  ComboBoxMenu,
  ComboBoxOption,
} from 'vue-select'

const languages = ['CSS', 'Go', 'HTML', 'JavaScript', 'Kotlin', 'PHP', 'Python', 'Ruby', 'Rust', 'Swift', 'TypeScript']
const picked = ref(['JavaScript', 'TypeScript'])
</script>

<template>
  <label for="languages">Languages</label>
  <ComboBox
    v-slot="{ selected, filteredOptions, deselect, focusInput }"
    v-model="picked"
    :options="languages"
    multiple
    hide-selected
    :close-on-select="false"
    class="combobox"
  >
    <div class="field">
      <span v-for="language in selected" :key="language" class="tag">
        {{ language }}
        <button
          type="button"
          :aria-label="`Remove ${language}`"
          @click="deselect(language), focusInput()"
        >
          ×
        </button>
      </span>
      <ComboBoxInput id="languages" class="input" />
      <ComboBoxClear>Clear</ComboBoxClear>
      <ComboBoxButton aria-label="Show languages">▾</ComboBoxButton>
    </div>

    <ComboBoxMenu class="menu">
      <ComboBoxOption
        v-for="(option, index) in filteredOptions"
        :key="option"
        v-slot="{ isHighlighted }"
        :value="option"
        :index="index"
      >
        <div class="option" :class="{ highlighted: isHighlighted }">{{ option }}</div>
      </ComboBoxOption>
      <div v-if="!filteredOptions.length" class="empty">Nothing left to pick.</div>
    </ComboBoxMenu>
  </ComboBox>
</template>
```

The styles are the same as in the first example, plus a `flex-wrap: wrap` on the field and a
background on `.tag`.

## Option groups

Set `groupBy` to a function that returns an option's group label, and render `groupedOptions`
instead of `filteredOptions`. Wrap each group's options in a `ComboBoxGroup`, which renders
`role="group"` labelled by its header, so screen readers announce the group when the highlight
enters it.

Each entry in `groupedOptions` is `{ label, options }`, and each of its `options` is
`{ option, index }`: pass that `index` to `ComboBoxOption`. Options whose `groupBy` returns `null`
or `undefined` come first, in a group with `label: null`, and get no header. Groups appear in the
order of their first matching option, and empty groups are left out, so the order can change as
the user types.

::headless-groups
::

```vue
<script setup>
import { ref } from 'vue'
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxButton,
  ComboBoxMenu,
  ComboBoxGroup,
  ComboBoxOption,
} from 'vue-select'

const foods = [
  { id: 1, name: 'Apple', type: 'Fruit' },
  { id: 2, name: 'Broccoli', type: 'Vegetable' },
  { id: 3, name: 'Banana', type: 'Fruit' },
  { id: 4, name: 'Carrot', type: 'Vegetable' },
  { id: 5, name: 'Cheddar', type: 'Dairy' },
  { id: 6, name: 'Cherry', type: 'Fruit' },
  { id: 7, name: 'Spinach', type: 'Vegetable' },
  { id: 8, name: 'Yogurt', type: 'Dairy' },
  { id: 9, name: 'Surprise me', type: null },
]
const food = ref(null)
</script>

<template>
  <label for="food">Food</label>
  <ComboBox
    v-slot="{ selected, search, groupedOptions }"
    v-model="food"
    :options="foods"
    label="name"
    :group-by="(option) => option.type"
    class="combobox"
  >
    <div class="field">
      <span v-if="selected.length && !search" class="value">{{ selected[0].name }}</span>
      <ComboBoxInput id="food" class="input" />
      <ComboBoxButton class="toggle" aria-label="Show foods">▾</ComboBoxButton>
    </div>

    <ComboBoxMenu class="menu">
      <template v-for="group in groupedOptions" :key="group.label ?? ''">
        <ComboBoxGroup v-if="group.label" :label="group.label">
          <template #label="{ label }">
            <div class="group-label">{{ label }}</div>
          </template>
          <ComboBoxOption
            v-for="{ option, index } in group.options"
            :key="option.id"
            v-slot="{ isHighlighted }"
            :value="option"
            :index="index"
          >
            <div class="option" :class="{ highlighted: isHighlighted }">{{ option.name }}</div>
          </ComboBoxOption>
        </ComboBoxGroup>
        <!-- options without a group (label: null) come first, with no header -->
        <template v-else>
          <ComboBoxOption
            v-for="{ option, index } in group.options"
            :key="option.id"
            v-slot="{ isHighlighted }"
            :value="option"
            :index="index"
          >
            <div class="option" :class="{ highlighted: isHighlighted }">{{ option.name }}</div>
          </ComboBoxOption>
        </template>
      </template>
      <div v-if="!groupedOptions.length" class="empty">No matches.</div>
    </ComboBoxMenu>
  </ComboBox>
</template>
```

`ComboBoxGroup` renders `<div>` elements by default. Inside a `<ul>` menu, use
`<ComboBoxGroup as="ul" label-as="li">` and wrap it in an `<li role="none">`, as `VueSelect` does.

## Styling

The primitives render no classes and no styles. Put classes on the components (they land on the
element each one renders) and target the ARIA attributes for state:

| State | Selector |
| --- | --- |
| Dropdown open | `[role="combobox"][aria-expanded="true"]`, or the `open` slot prop |
| Selected option | `[role="option"][aria-selected="true"]`, or `isSelected` |
| Option that can't be selected | `[role="option"][aria-disabled="true"]`, or `isDisabled` |
| Highlighted option | the `isHighlighted` slot prop (no attribute) |
| Disabled field | `[role="combobox"]:disabled` (input) or `[role="combobox"][aria-disabled="true"]` (select-only) |
| Group | `[role="group"]` |
| Clear button visible | it's hidden with `display: none` when there's nothing to clear |

The highlighted option has no attribute of its own: the input's `aria-activedescendant` points at
its id. Use the `isHighlighted` slot prop to style it, as in the examples above.

The menu is shown and hidden with `v-show`, so you can wrap `ComboBoxMenu` in a `<Transition>`.
To render the menu elsewhere in the page, for example to escape an `overflow: hidden` container,
wrap it in a `<Teleport>` and position it yourself.

With Tailwind or another utility framework, put the classes directly on the primitives and use
the slot props for state:

```vue
<ComboBoxOption v-slot="{ isHighlighted, isSelected }" :value="option" :index="index">
  <div :class="['px-3 py-1.5', isHighlighted && 'bg-sky-600 text-white', isSelected && 'font-semibold']">
    {{ option }}
  </div>
</ComboBoxOption>
```

## Keyboard

`ComboBoxInput` implements the keyboard interaction of the
[WAI-ARIA APG combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/). Focus stays
on the input the whole time; the highlighted option is announced through
`aria-activedescendant`.

**Editable combobox** (the default, following the APG
[list autocomplete example](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/)):

| Key | Action |
| --- | --- |
| Typing | Opens the dropdown, filters the options and highlights the first match. |
| <kbd>↓</kbd> | Closed: opens and highlights the selected option, or the first option. Open: highlights the next option, wrapping to the first. |
| <kbd>↑</kbd> | Closed: opens and highlights the selected option, or the last option. Open: highlights the previous option, wrapping to the last. |
| <kbd>Alt</kbd>+<kbd>↓</kbd> | Opens without moving the highlight. |
| <kbd>Enter</kbd> | Open: selects the highlighted option, or closes the dropdown when nothing is highlighted. Closed: does its default, such as submitting the form; with `taggable` and search text, creates the tag. |
| <kbd>Escape</kbd> | Closes the dropdown. If it's already closed, clears the search text. |
| <kbd>Space</kbd> | With an empty search on a closed dropdown, opens it. Otherwise types a space, e.g. in "New York". |
| <kbd>Backspace</kbd> | In an empty input, removes the last selected value (when `clearable`). |
| <kbd>Tab</kbd> | Moves focus on, closing the dropdown. |

**Select-only combobox** (`searchable: false`, following the APG
[select-only example](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/)):

| Key | Action |
| --- | --- |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Open the dropdown, then move the highlight. No wrapping. |
| <kbd>Home</kbd> / <kbd>End</kbd> | Open and highlight the first / last option. |
| <kbd>PageDown</kbd> / <kbd>PageUp</kbd> | Move the highlight 10 options. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Open the dropdown, or select the highlighted option. |
| <kbd>Alt</kbd>+<kbd>↑</kbd> | Select the highlighted option and close. |
| <kbd>Tab</kbd> | Select the highlighted option and move focus on. |
| <kbd>Escape</kbd> | Close the dropdown. |
| Letters | Highlight the next option starting with the typed text. Repeating a letter cycles through the matches. |

Clicking the input doesn't open an editable combobox; `ComboBoxButton` and the keys above do. Set
`open-on-focus` to open on focus and click. A select-only combobox toggles on click.

To change a key, pass `mapKeydown` to `ComboBox`. It receives the default handlers keyed by
`KeyboardEvent.key` and the [context](#usecombobox):

```vue
<ComboBox :map-keydown="(map) => ({ ...map, ',': map.Enter })" taggable multiple>
```

## useComboBox

`useComboBox` is the composable behind `ComboBox`. It returns the whole combobox state and its
methods, without rendering anything. Use it when you want to write every element yourself.

```ts
function useComboBox(
  props: ComboBoxProps,
  emit: (event: string, ...args: unknown[]) => void
): ComboBoxContext
```

- `props` takes the same props as `ComboBox`, and must be reactive: the `props` of your own
  component, or a `reactive()` object.
- `emit` receives the same events as `ComboBox` emits. Handle at least `update:modelValue` when you
  pass a `modelValue`; without one, the composable keeps the selection itself (read it from
  `selectedValue`).

With `useComboBox` you're responsible for what the primitives would otherwise do: the
`role="combobox"` / `listbox` / `option` attributes and their ids, `aria-activedescendant`, the
keyboard handlers, closing on blur or on clicks outside, and keeping focus in the input when an
option is clicked. To mix your own markup with some of the primitives instead, provide your
instance under `ComboBoxKey`, as `ComboBox` does: `provide(ComboBoxKey, combo)`.

This color picker renders its own input and list, and handles the arrow keys, Enter and Escape:

::headless-composable
::

```vue
<script setup>
import { reactive, ref } from 'vue'
import { useComboBox } from 'vue-select'

const colors = [
  { name: 'Crimson', hex: '#dc143c' },
  { name: 'Coral', hex: '#ff7f50' },
  { name: 'Gold', hex: '#ffd700' },
  { name: 'Olive', hex: '#808000' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Steel Blue', hex: '#4682b4' },
  { name: 'Indigo', hex: '#4b0082' },
  { name: 'Orchid', hex: '#da70d6' },
]
const color = ref(null)

// The ref is unwrapped by reactive(), so the combobox reads color.value
// and asks for changes through the emit function.
const {
  open,
  search,
  selectedValue,
  filteredOptions,
  typeAheadPointer,
  uid,
  setOpen,
  toggleOpen,
  setSearch,
  select,
  typeAheadUp,
  typeAheadDown,
  typeAheadFirst,
  typeAheadLast,
  typeAheadSelect,
  isOptionSelected,
} = useComboBox(
  reactive({ options: colors, label: 'name', modelValue: color }),
  (event, value) => {
    if (event === 'update:modelValue') color.value = value
  }
)

const inputEl = ref(null)
const listboxId = `color-${uid.value}-listbox`
const optionId = (index) => `color-${uid.value}-option-${index}`

function onKeydown(e) {
  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowUp': {
      e.preventDefault()
      const down = e.key === 'ArrowDown'
      if (open.value) return down ? typeAheadDown() : typeAheadUp()
      setOpen(true)
      if (typeAheadPointer.value === -1) down ? typeAheadFirst() : typeAheadLast()
      return
    }
    case 'Enter':
      if (!open.value) return
      e.preventDefault()
      return typeAheadSelect()
    case 'Escape':
      return open.value ? setOpen(false) : setSearch('')
  }
}

function onBlur() {
  setOpen(false)
  setSearch('')
}
</script>

<template>
  <label :for="`color-${uid}-input`">Color</label>
  <div class="picker">
    <div class="field">
      <span class="swatch" :style="{ background: selectedValue[0]?.hex ?? 'transparent' }" />
      <input
        :id="`color-${uid}-input`"
        ref="inputEl"
        type="text"
        role="combobox"
        autocomplete="off"
        aria-autocomplete="list"
        :aria-expanded="open"
        :aria-controls="listboxId"
        :aria-activedescendant="open && typeAheadPointer > -1 ? optionId(typeAheadPointer) : undefined"
        :placeholder="selectedValue[0]?.name ?? 'Search colors'"
        :value="search"
        @input="setSearch($event.target.value)"
        @keydown="onKeydown"
        @blur="onBlur"
      />
      <button
        type="button"
        tabindex="-1"
        aria-label="Show colors"
        :aria-expanded="open"
        :aria-controls="listboxId"
        @mousedown.prevent
        @click="toggleOpen(), inputEl.focus()"
      >
        ▾
      </button>
    </div>

    <!-- mousedown.prevent keeps focus in the input while clicking an option -->
    <ul v-show="open" :id="listboxId" role="listbox" @mousedown.prevent>
      <li
        v-for="(option, index) in filteredOptions"
        :id="optionId(index)"
        :key="option.hex"
        role="option"
        :aria-selected="isOptionSelected(option)"
        :class="{ highlighted: typeAheadPointer === index }"
        @mousemove="typeAheadPointer = index"
        @click="select(option)"
      >
        <span class="swatch" :style="{ background: option.hex }" />
        {{ option.name }}
      </li>
    </ul>
  </div>
</template>
```

Inside a reusable component, pass your component's own props and `emit`, and declare the props
with `comboBoxDefaults`, the defaults `ComboBox` itself uses. Without them, Vue turns every absent
`boolean` prop into `false`: `open: false` would mean "controlled and closed", `filterable: false`
"never filter", and so on.

```vue
<script setup lang="ts">
import { useComboBox, comboBoxDefaults, type ComboBoxProps } from 'vue-select'

const props = withDefaults(defineProps<ComboBoxProps>(), comboBoxDefaults)
const emit = defineEmits(['update:modelValue', 'update:open', 'open', 'close', 'clear', 'search',
  'option:created', 'option:selecting', 'option:selected', 'option:deselecting', 'option:deselected'])

const combo = useComboBox(props, emit as (event: string, ...args: unknown[]) => void)
</script>
```

### The context

`useComboBox` returns a `ComboBoxContext`. `mapKeydown` and `calculatePosition` receive the same
object as their context argument. State is made of refs, so read and write it with `.value`.

**State**

| Member | Type | Description |
| --- | --- | --- |
| `open` | `Ref<boolean>` (read-only) | Whether the dropdown is open. Change it with `setOpen` / `toggleOpen`. |
| `search` | `Ref<string>` | The search text. Prefer `setSearch`, which also opens the dropdown and emits `search`. |
| `selectedValue` | `ComputedRef<OptionValue[]>` | The selected options, always as an array of full options. |
| `filteredOptions` | `ComputedRef<OptionValue[]>` | The options to show, in render order (groups included). |
| `groupedOptions` | `ComputedRef<OptionGroup[]>` | `filteredOptions` split into groups by `groupBy`. |
| `optionList` | `ComputedRef<OptionValue[]>` | All options, before filtering. |
| `typeAheadPointer` | `Ref<number>` | Index of the highlighted option in `filteredOptions`, or `-1`. Writable. |
| `isLoading` | `Ref<boolean>` | The loading state. |
| `isValueEmpty` | `ComputedRef<boolean>` | Nothing is selected. |
| `isSearching` | `ComputedRef<boolean>` | There is search text. |
| `uid` | `ComputedRef<string>` | Base for element ids. |
| `inputEl` | `ShallowRef<HTMLElement \| null>` | The element `ComboBoxInput` rendered, if any. |
| `disabled`, `multiple`, `filterable`, `searchable`, `clearable`, `taggable`, `placeholder`, `deselectFromDropdown`, `autoscroll`, `clearSearchOnBlur`, `openOnFocus` | `ComputedRef` | The resolved props, with defaults applied. |

**Methods**

| Member | Description |
| --- | --- |
| `select(option)` | Select an option, or deselect it when `deselectFromDropdown` allows. Emits the `option:*` events and `update:modelValue`. |
| `deselect(option)` | Remove an option from the selection. |
| `clearSelection()` | Clear the value and emit `clear`. |
| `setOpen(value)`, `toggleOpen()` | Open or close the dropdown (emits `update:open`, and `open` / `close` when uncontrolled). |
| `setSearch(text)` | Set the search text. Opens the dropdown when the text isn't empty. |
| `typeAheadDown(wrap = true)`, `typeAheadUp(wrap = true)` | Move the highlight to the next / previous selectable option. |
| `typeAheadFirst()`, `typeAheadLast()` | Highlight the first / last selectable option. |
| `typeAheadSelect()` | Select the highlighted option. |
| `toggleLoading(value?)` | Set or flip the loading state. |
| `focusInput()` | Focus `inputEl`. |
| `getOptionLabel(option)`, `getOptionKey(option)` | Label and key, using the `label`, `getOptionLabel` and `getOptionKey` props. |
| `isOptionSelected(option)`, `isOptionSelectable(option)`, `isOptionDeselectable(option)`, `isOptionHighlighted(index)` | State of one option. |
| `mapKeydown(handlers)` | Runs the `mapKeydown` prop over a handler map. |

## Custom primitives

`ComboBoxKey` and `useComboBoxContext` let you write your own components that work alongside the
built-in primitives inside a `ComboBox`. `useComboBoxContext(name)` returns the
[context](#the-context) of the nearest `ComboBox`, and throws an error that mentions `name` when
there is none.

```vue
<!-- SelectedTags.vue: the selected options as removable tags -->
<script setup>
import { useComboBoxContext } from 'vue-select'

const combo = useComboBoxContext('SelectedTags')

function remove(option) {
  combo.deselect(option)
  combo.focusInput()
}
</script>

<template>
  <span v-for="option in combo.selectedValue.value" :key="combo.getOptionKey(option)" class="tag">
    {{ combo.getOptionLabel(option) }}
    <button type="button" :aria-label="`Remove ${combo.getOptionLabel(option)}`" @click="remove(option)">
      ×
    </button>
  </span>
</template>
```

```vue
<ComboBox v-model="languages" :options="options" multiple>
  <SelectedTags />
  <ComboBoxInput aria-label="Languages" />
  <!-- ... -->
</ComboBox>
```
