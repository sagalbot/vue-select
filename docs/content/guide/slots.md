---
title: Slots
section: Templating & Styling
description: Customize how options, selections, icons and messages render with scoped slots.
---

Slots let you replace parts of Vue Select's template with your own markup, while the component keeps
handling behavior and accessibility. With TypeScript, slot props are typed from your options; see
[TypeScript](/guide/install#typescript). This page covers the common cases. The [slots API](/api/slots)
lists every slot and the props it receives.

## Option Templates

The `option` slot renders each option in the dropdown, and `selected-option` renders the selected
value in the field. Both receive the option's properties as slot props. When the options are
strings or numbers, the slot props are `{ label: option }` (using the [`label` prop](/guide/options#objects)
as the key).

::guide-slot-option
::

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'
import { books } from './data'

const selected = ref(books[0])
</script>

<template>
  <VueSelect v-model="selected" :options="books" label="title">
    <template #option="{ title, author }">
      <strong>{{ title }}</strong>
      <br />
      <em>{{ author.firstName }} {{ author.lastName }}</em>
    </template>

    <template #selected-option="{ title, author }">
      <strong>{{ title }}</strong>
      <em style="margin-left: 0.5rem">by {{ author.firstName }} {{ author.lastName }}</em>
    </template>
  </VueSelect>
</template>
```

Filtering still uses the option's label, not the slot content. If users should be able to search
for something you only show in the slot (the author, above), see [Option Filtering](/guide/filtering).

### Custom Tags

`selected-option` only replaces the text inside each selected value. To replace the whole element,
including the deselect button of a multiple select, use `selected-option-container`. It receives
the `option`, a `deselect` function, and the `multiple` and `disabled` props.

::guide-slot-selected-option-container
::

```vue
<VueSelect v-model="selected" multiple :options="options">
  <template #selected-option-container="{ option, deselect, disabled }">
    <span class="pill">
      {{ option.label }}
      <button
        type="button"
        :disabled="disabled"
        :aria-label="`Remove ${option.label}`"
        @click="deselect(option)"
      >
        remove
      </button>
    </span>
  </template>
</VueSelect>
```

`deselect(option)` works with the slot's `option` for every kind of option, including strings and
numbers, which the slot receives wrapped as `{ label: option }`. When you render your own buttons,
give them an accessible name, as above.

## Icons

Three slots replace the icons Vue Select renders. Their content is placed inside the existing
buttons, so the buttons keep their labels, focus handling and keyboard support. Don't put another
`<button>` inside them.

| Slot             | Replaces                                                   | Slot props       |
|------------------|------------------------------------------------------------|------------------|
| `open-indicator` | The chevron in the toggle button                           | `{ attributes }` |
| `clear`          | The × in the clear button                                  | none             |
| `deselect`       | The × on each selected value in a multiple select          | `{ option }`     |

Bind `attributes` to the root of your `open-indicator` content. It adds the `vs__open-indicator`
class, which rotates the icon while the dropdown is open, and hides the decorative icon from screen
readers.

::guide-slot-icons
::

```vue
<VueSelect v-model="selected" multiple :options="['Canada', 'United States', 'Mexico']">
  <template #open-indicator="{ attributes }">
    <span v-bind="attributes">🔽</span>
  </template>
  <template #clear>🗑️</template>
  <template #deselect>❌</template>
</VueSelect>
```

::callout{type="note" title="Coming from Vue Select 3?"}
These slots replace the `components` prop (`OpenIndicator` and `Deselect`). In v3, the `Deselect`
component also served as the clear button; in v4 the clear button has its own `clear` slot.
::

### Using Your Icons Everywhere

To use the same icons in every select without repeating the slots, wrap Vue Select in your own
component. Attributes and event listeners pass through automatically, and the wrapper forwards any
other slots:

```vue [AppSelect.vue]
<script setup>
import VueSelect from 'vue-select'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/vue/20/solid'
</script>

<template>
  <VueSelect>
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>

    <template #open-indicator="{ attributes }">
      <ChevronDownIcon v-bind="attributes" class="vs__icon" />
    </template>
    <template #clear>
      <XMarkIcon class="vs__icon" aria-hidden="true" />
    </template>
  </VueSelect>
</template>
```

Use `<AppSelect>` with the same props and `v-model` as `<VueSelect>`. The `vs__icon` class sizes
an SVG icon with the `--vs-controls-icon-size` [CSS variable](/guide/css).

## The Dropdown List

### No Options Text

The `no-options` slot is shown when no options match the search, or when there are no options at
all. By default it displays _Sorry, no matching options._ It receives `search`, `searching` and
`loading`, so you can tailor the message:

::guide-slot-no-options
::

```vue
<VueSelect>
  <template #no-options="{ search, searching }">
    <template v-if="searching">
      No results found for <em>{{ search }}</em>.
    </template>
    <em v-else style="opacity: 0.5">Start typing to search for a country.</em>
  </template>
</VueSelect>
```

### Before and After the Options

`list-header` and `list-footer` render inside the dropdown list, before and after the options.
They're rendered inside the `<ul>`, so their root element should be an `<li>`. Both receive
`search`, `loading`, `searching` and `filteredOptions`.

::guide-slot-list-header-footer
::

```vue
<VueSelect :options="countries">
  <template #list-header="{ filteredOptions }">
    <li class="note">{{ filteredOptions.length }} countries</li>
  </template>
  <template #list-footer>
    <li class="note">Can't find yours? Contact us.</li>
  </template>
</VueSelect>
```

These slots are the building blocks for [pagination](/guide/pagination) and
[infinite scroll](/guide/infinite-scroll).

### Group Headers

When you [group options](/guide/options#option-groups) with `groupBy`, the `group-header` slot
renders each group's header. It receives the group `label` and the `options` in the group.

::guide-slot-group-header
::

```vue
<VueSelect :options="options" :group-by="(option) => option.type">
  <template #group-header="{ label, options }">
    {{ label }} ({{ options.length }})
  </template>
</VueSelect>
```

## The Search Input

The `search` slot replaces the search input. It receives `attributes` and `events`, which you must
bind to your input: they carry the combobox role, ARIA attributes, the current search text, the
`vs__search` class, and the keyboard and focus handlers.

```vue
<VueSelect :options="['A', 'B', 'C', 'D']">
  <template #search="{ attributes, events }">
    <input maxlength="1" v-bind="attributes" v-on="events" />
  </template>
</VueSelect>
```

::guide-slot-search
::

Attributes you set on the component through [`inputAttrs`](/guide/accessibility#input-attributes)
are included in `attributes`, with the same precedence as on the built-in input: they can replace
defaults like `type` and `autocomplete`, but not the combobox's ARIA state or `value`. For an example of the search slot in a form, see
[Validation](/guide/validation).

## Around the Component

The `header` and `footer` slots render inside the `.v-select` element, above and below the field.
`spinner` replaces the loading indicator; see [AJAX](/guide/ajax#loading-spinner).
