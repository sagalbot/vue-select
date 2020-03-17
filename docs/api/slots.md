::: tip
Vue Select leverages scoped slots to allow for total customization of the presentation layer.
Slots can be used to change the look and feel of the UI, or to simply swap out text.
:::

<style>
  .slot-docs h2 {
    border-top: 1px solid #f0f0f0;
    border-bottom: none;
    margin-top: 2rem;
    padding-top: 2rem;
  }
  .slot-docs h2:first-child {
    border-top: none;
    margin-top: 0;
  }
</style>

<div class="slot-docs">

## `footer` <Badge text="3.8.0+" />

Displayed at the bottom of the component, below `.vs__dropdown-toggle`.

When implementing this slot, you'll likely need to use `appendToBody` to position the dropdown.
Otherwise content in this slot will affect it's positioning.

- `search {string}` - the current search query
- `loading {boolean}` - is the component loading
- `searching {boolean}` - is the component searching
- `filteredOptions {array}` - options filtered by the search text
- `deselect {function}` - function to deselect an option

<SlotFooter />
<<< @/.vuepress/components/SlotFooter.vue

## `header` <Badge text="3.8.0+" />

Displayed at the top of the component, above `.vs__dropdown-toggle`.

- `search {string}` - the current search query
- `loading {boolean}` - is the component loading
- `searching {boolean}` - is the component searching
- `filteredOptions {array}` - options filtered by the search text
- `deselect {function}` - function to deselect an option

<SlotHeader />
<<< @/.vuepress/components/SlotHeader.vue

## `list-footer` <Badge text="3.8.0+" />

Displayed as the last item in the dropdown. No content by default. Parent element is the `<ul>`,
so this slot should contain a root `<li>`.

- `search {string}` - the current search query
- `loading {boolean}` - is the component loading
- `searching {boolean}` - is the component searching
- `filteredOptions {array}` - options filtered by the search text

<SlotListFooter />
<<< @/.vuepress/components/SlotListFooter.vue

## `list-header` <Badge text="3.8.0+" />

Displayed as the first item in the dropdown. No content by default. Parent element is the `<ul>`,
so this slot should contain a root `<li>`.

- `search {string}` - the current search query
- `loading {boolean}` - is the component loading
- `searching {boolean}` - is the component searching
- `filteredOptions {array}` - options filtered by the search text

<SlotListHeader />
<<< @/.vuepress/components/SlotListHeader.vue

## `no-options`

The no options slot is displayed above `list-footer` in the dropdown when
`filteredOptions.length === 0`.

- `search {string}` - the current search query
- `loading {boolean}` - is the component loading
- `searching {boolean}` - is the component searching

<SlotNoOptions />
<<< @/.vuepress/components/SlotNoOptions.vue

## `open-indicator`

The open indicator is the caret icon on the component used to indicate dropdown status.

```js
attributes: {
  'ref': 'openIndicator',
  'role': 'presentation',
  'class': 'vs__open-indicator',
}
```

<SlotOpenIndicator />
<<< @/.vuepress/components/SlotOpenIndicator.vue

## `option`

The current option within the dropdown, contained within `<li>`.

- `option {Object}` - The currently iterated option from `filteredOptions`

<SlotOption />
<<< @/.vuepress/components/SlotOption.vue

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

<SlotSearch />
<<< @/.vuepress/components/SlotSearch.vue{5-6}

## `selected-option`

The text displayed within `selected-option-container`.

This slot doesn't exist if `selected-option-container` is implemented.

- `option {Object}` - A selected option

<SlotSelectedOption />
<<< @/.vuepress/components/SlotSelectedOption.vue

## `selected-option-container`

This is the root element where `v-for="option in selectedValue"`. Most of the time you'll want to
use `selected-option`, but this container is useful if you want to disable the deselect button,
or have fine grain control over the markup.

- `option {Object}` - Currently iterated selected option
- `deselect {Function}` - Method used to deselect a given option when `multiple` is true
- `disabled {Boolean}` - Determine if the component is disabled
- `multiple {Boolean}` - If the component supports the selection of multiple values

<SlotSelectedOptionContainer />
<<< @/.vuepress/components/SlotSelectedOptionContainer.vue

## `spinner`

- `loading {Boolean}` - if the component is in a loading state

<SlotSpinner />
<<< @/.vuepress/components/SlotSpinner.vue

</div>
