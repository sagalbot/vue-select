::: tip
Vue Select leverages scoped slots to allow for total customization of the presentation layer.
Slots can be used to change the look and feel of the UI, or to simply swap out text.
:::

## Wrapper

### `header` <Badge text="3.8.0+" />

Displayed at the top of the component, above `.vs__dropdown-toggle`.

- `search {string}` - the current search query
- `loading {boolean}` - is the component loading
- `searching {boolean}` - is the component searching
- `filteredOptions {array}` - options filtered by the search text
- `deselect {function}` - function to deselect an option

```html
<slot name="header" v-bind="scope.header" />
```

### `footer` <Badge text="3.8.0+" />

Displayed at the bottom of the component, below `.vs__dropdown-toggle`.

When implementing this slot, you'll likely need to use `appendToBody` to position the dropdown.
Otherwise content in this slot will affect it's positioning.

- `search {string}` - the current search query
- `loading {boolean}` - is the component loading
- `searching {boolean}` - is the component searching
- `filteredOptions {array}` - options filtered by the search text
- `deselect {function}` - function to deselect an option

```html
<slot name="footer" v-bind="scope.footer" />
```

## Selected Option(s)

### `selected-option`

#### Scope:

- `option {Object}` - A selected option

```html
<slot
  name="selected-option"
  v-bind="(typeof option === 'object')?option:{[label]: option}"
>
  {{ getOptionLabel(option) }}
</slot>
```

### `selected-option-container`

#### Scope:

- `option {Object}` - A selected option
- `deselect {Function}` - Method used to deselect a given option when `multiple` is true
- `disabled {Boolean}` - Determine if the component is disabled
- `multiple {Boolean}` - If the component supports the selection of multiple values

```html
<slot
  v-for="option in valueAsArray"
  name="selected-option-container"
  :option="(typeof option === 'object')?option:{[label]: option}"
  :deselect="deselect"
  :multiple="multiple"
  :disabled="disabled"
>
  <span class="selected-tag" v-bind:key="option.index">
    <slot
      name="selected-option"
      v-bind="(typeof option === 'object')?option:{[label]: option}"
    >
      {{ getOptionLabel(option) }}
    </slot>
    <button
      v-if="multiple"
      :disabled="disabled"
      @click="deselect(option)"
      type="button"
      class="close"
      aria-label="Remove option"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </span>
</slot>
```

## Component Actions

### `spinner`

#### Scope:

- `loading {Boolean}` - if the component is in a loading state

```html
<slot name="spinner" v-bind="scope.spinner">
  <div class="vs__spinner" v-show="mutableLoading">Loading...</div>
</slot>
```

### `open-indicator`

```js
attributes : {
  'ref': 'openIndicator',
  'role': 'presentation',
  'class': 'vs__open-indicator',
}
```

```vue
<slot name="open-indicator" v-bind="scope.openIndicator">
  <component :is="childComponents.OpenIndicator" v-if="!noDrop" v-bind="scope.openIndicator.attributes"/>
</slot>
```

## Dropdown

### `list-header` <Badge text="3.8.0+" />

Displayed as the first item in the dropdown. No content by default. Parent element is the `<ul>`,
so this slot should contain a root `<li>`.

- `search {string}` - the current search query
- `loading {boolean}` - is the component loading
- `searching {boolean}` - is the component searching
- `filteredOptions {array}` - options filtered by the search text

```html
<slot name="list-header" v-bind="scope.listHeader" />
```

### `list-footer` <Badge text="3.8.0+" />

Displayed as the last item in the dropdown. No content by default. Parent element is the `<ul>`,
so this slot should contain a root `<li>`.

- `search {string}` - the current search query
- `loading {boolean}` - is the component loading
- `searching {boolean}` - is the component searching
- `filteredOptions {array}` - options filtered by the search text

```html
<slot name="footer" v-bind="scope.listFooter" />
```

### `option`

The current option within the dropdown, contained within `<li>`.

- `option {Object}` - The currently iterated option from `filteredOptions`

```html
<slot
  name="option"
  v-bind="(typeof option === 'object')?option:{[label]: option}"
>
  {{ getOptionLabel(option) }}
</slot>
```

### `no-options`

The no options slot is displayed in the dropdown when `filteredOptions.length === 0`.

- `search {String}` - the current search text
- `searching {Boolean}` - if the component has search text

```vue
<slot name="no-options" v-bind="scope.noOptions">
  Sorry, no matching options.
</slot>
```
