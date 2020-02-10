::: tip
Vue Select leverages scoped slots to allow for total customization of the presentation layer.
Slots can be used to change the look and feel of the UI, or to simply swap out text.
:::

## Selected Option(s)

### `selected-option`

#### Scope: 

- `option {Object}` - A selected option

```html
<slot name="selected-option" v-bind="(typeof option === 'object')?option:{[label]: option}">
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
<slot v-for="option in valueAsArray" name="selected-option-container"
			:option="(typeof option === 'object')?option:{[label]: option}" :deselect="deselect" :multiple="multiple" :disabled="disabled">
	<span class="selected-tag" v-bind:key="option.index">
		<slot name="selected-option" v-bind="(typeof option === 'object')?option:{[label]: option}">
			{{ getOptionLabel(option) }}
		</slot>
		<button v-if="multiple" :disabled="disabled" @click="deselect(option)" type="button" class="close" aria-label="Remove option">
			<span aria-hidden="true">&times;</span>
		</button>
	</span>
</slot>
```

## Component Actions

### `spinner`

```html
<slot name="spinner">
	<div class="spinner" v-show="mutableLoading">Loading...</div>
</slot>
```

### `no-options`

```html
<slot name="no-options">Sorry, no matching options.</slot>
```

## Dropdown

### `option`

#### Scope:

- `option {Object}` - The currently iterated option from `filteredOptions`

```html
<slot name="option" v-bind="(typeof option === 'object')?option:{[label]: option}">
	{{ getOptionLabel(option) }}
</slot>
```
