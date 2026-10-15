---
title: "Slots"
section: "v3 · API"
version: v3
---

::callout{type="note"}
Vue Select leverages scoped slots to allow for total customization of the presentation layer.
Slots can be used to change the look and feel of the UI, or to simply swap out text.
::

## `footer` :badge{text="3.8.0+"}

Displayed at the bottom of the component, below `.vs__dropdown-toggle`.

When implementing this slot, you'll likely need to use `appendToBody` to position the dropdown.
Otherwise content in this slot will affect it's positioning.

- `search {string}` - the current search query
- `loading {boolean}` - is the component loading
- `searching {boolean}` - is the component searching
- `filteredOptions {array}` - options filtered by the search text
- `deselect {function}` - function to deselect an option

```vue
<template>
  <v-select append-to-body>
    <template #footer>
      <div style="opacity: 0.8">
        Bottom of the component, in the footer slot!
      </div>
    </template>
  </v-select>
</template>
```

## `header` :badge{text="3.8.0+"}

Displayed at the top of the component, above `.vs__dropdown-toggle`.

- `search {string}` - the current search query
- `loading {boolean}` - is the component loading
- `searching {boolean}` - is the component searching
- `filteredOptions {array}` - options filtered by the search text
- `deselect {function}` - function to deselect an option

```vue
<template>
  <v-select>
    <template #header>
      <div style="opacity: 0.8">Top of the component, in the header slot!</div>
    </template>
  </v-select>
</template>
```

## `list-footer` :badge{text="3.8.0+"}

Displayed as the last item in the dropdown. No content by default. Parent element is the `<ul>`,
so this slot should contain a root `<li>`.

- `search {string}` - the current search query
- `loading {boolean}` - is the component loading
- `searching {boolean}` - is the component searching
- `filteredOptions {array}` - options filtered by the search text

```vue
<template>
  <v-select>
    <template #list-footer>
      <li style="text-align: center">Bottom of the list!</li>
    </template>
  </v-select>
</template>
```

## `list-header` :badge{text="3.8.0+"}

Displayed as the first item in the dropdown. No content by default. Parent element is the `<ul>`,
so this slot should contain a root `<li>`.

- `search {string}` - the current search query
- `loading {boolean}` - is the component loading
- `searching {boolean}` - is the component searching
- `filteredOptions {array}` - options filtered by the search text

```vue
<template>
  <v-select>
    <template #list-header>
      <li style="text-align: center">Top of the list!</li>
    </template>
  </v-select>
</template>
```

## `no-options`

The no options slot is displayed above `list-footer` in the dropdown when
`filteredOptions.length === 0`.

- `search {string}` - the current search query
- `loading {boolean}` - is the component loading
- `searching {boolean}` - is the component searching

```vue
<template>
  <v-select>
    <!-- eslint-disable-next-line vue/no-unused-vars  -->
    <template #no-options="{ search, searching, loading }">
      This is the no options slot.
    </template>
  </v-select>
</template>
```

## `open-indicator`

The open indicator is the caret icon on the component used to indicate dropdown status.

```js
attributes: {
  'ref': 'openIndicator',
  'role': 'presentation',
  'class': 'vs__open-indicator',
}
```

```vue
<template>
  <v-select>
    <template #open-indicator="{ attributes }">
      <span v-bind="attributes">🔽</span>
    </template>
  </v-select>
</template>
```

## `option`

The current option within the dropdown, contained within `<li>`.

- `option {Object}` - The currently iterated option from `filteredOptions`

```vue
<template>
  <v-select :options="books" label="title">
    <template #option="{ title, author }">
      <h3 style="margin: 0">{{ title }}</h3>
      <em>{{ author.firstName }} {{ author.lastName }}</em>
    </template>
  </v-select>
</template>

<script>
export default {
  data: () => ({
    books: [
      {
        title: "Old Man's War",
        author: {
          firstName: 'John',
          lastName: 'Scalzi',
        },
      },
    ],
  }),
}
</script>
```

## `search`

The search input has a lot of bindings, but they're grouped into `attributes` and `events`. Most
of the time, you will just be binding those two with `v-on="events"` and `v-bind="attributes"`.

If you want the default styling, you'll need to add `.vs__search` to the input you provide.

```js
  /**
   * Attributes to be bound to a search input.
   */
  attributes: {
    'disabled': this.disabled,
    'placeholder': this.searchPlaceholder,
    'tabindex': this.tabindex,
    'readonly': !this.searchable,
    'id': this.inputId,
    'aria-autocomplete': 'list',
    'aria-labelledby': `vs${this.uid}__combobox`,
    'aria-controls': `vs${this.uid}__listbox`,
    'aria-activedescendant': this.typeAheadPointer > -1
      ? `vs${this.uid}__option-${this.typeAheadPointer}`
      : '',
    'ref': 'search',
    'type': 'search',
    'autocomplete': this.autocomplete,
    'value': this.search,
  },
  /**
   * Events that this element should handle.
   */
  events: {
    'compositionstart': () => this.isComposing = true,
    'compositionend': () => this.isComposing = false,
    'keydown': this.onSearchKeyDown,
    'blur': this.onSearchBlur,
    'focus': this.onSearchFocus,
    'input': (e) => this.search = e.target.value,
  }
```

```vue
<template>
  <v-select>
    <template #search="{ attributes, events }">
      <input
        maxlength="1"
        class="vs__search"
        v-bind="attributes"
        v-on="events"
      />
    </template>
  </v-select>
</template>
```

## `selected-option`

The text displayed within `selected-option-container`.

This slot doesn't exist if `selected-option-container` is implemented.

- `option {Object}` - A selected option

```vue
<template>
  <v-select v-model="selected" :options="books" label="title">
    <template #selected-option="{ title, author }">
      <div style="display: flex; align-items: baseline">
        <strong>{{ title }}</strong>
        <em style="margin-left: 0.5rem"
          >by {{ author.firstName }} {{ author.lastName }}</em
        >
      </div>
    </template>
  </v-select>
</template>

<script>
const book = {
  title: "Old Man's War",
  author: {
    firstName: 'John',
    lastName: 'Scalzi',
  },
}
export default {
  data: () => ({
    books: [book],
    selected: book,
  }),
}
</script>
```

## `selected-option-container`

This is the root element where `v-for="option in selectedValue"`. Most of the time you'll want to
use `selected-option`, but this container is useful if you want to disable the deselect button,
or have fine grain control over the markup.

- `option {Object}` - Currently iterated selected option
- `deselect {Function}` - Method used to deselect a given option when `multiple` is true
- `disabled {Boolean}` - Determine if the component is disabled
- `multiple {Boolean}` - If the component supports the selection of multiple values

```vue
<template>
  <!-- eslint-disable vue/no-unused-vars  -->
  <v-select :options="books" label="title">
    <template
      #selected-option-container="{ option, deselect, multiple, disabled }"
    >
      <div class="vs__selected">{{ option.title }}</div>
    </template>
  </v-select>
</template>

<script>
export default {
  data: () => ({
    books: [
      {
        title: "Old Man's War",
        author: {
          firstName: 'John',
          lastName: 'Scalzi',
        },
      },
    ],
  }),
}
</script>
```

## `spinner`

- `loading {Boolean}` - if the component is in a loading state

```vue
<template>
  <v-select :loading="true">
    <template #spinner="{ loading }">
      <div
        v-if="loading"
        style="border-left-color: rgba(88, 151, 251, 0.71)"
        class="vs__spinner"
      >
        The .vs__spinner class will hide the text for me.
      </div>
    </template>
  </v-select>
</template>
```
