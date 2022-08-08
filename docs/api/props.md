## appendToBody <Badge text="v3.7.0+" />

Append the dropdown element to the end of the body
and size/position it dynamically. Use it if you have
overflow or z-index issues.

See [Dropdown Position](../guide/positioning.md) for more details.

```js
appendToBody: {
    type: Boolean,
    default: false
},
```


## autocomplete

The value provided here will be bound to the [autocomplete
HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)
on the search input. Defaults to `off`.

```js
autocomplete: {
    type: String,
    default: 'off'
},
```


## autoscroll <Badge text="v3.10.0+" />

When true, the dropdown will automatically scroll to ensure
that the option highlighted is fully within the dropdown viewport
when navigating with keyboard arrows.

```js
autoscroll: {
  type: Boolean,
  default: true
}
```


## calculatePosition <Badge text="v3.7.0+" />

When `appendToBody` is true, this function is responsible for positioning the drop down list.

If a function is returned from `calculatePosition`, it will be called when the drop down list
is removed from the DOM. This allows for any garbage collection you may need to do.

See [Dropdown Position](../guide/positioning.md) for more details.

```js
calculatePosition: {
    type: Function,
    /**
     * @param dropdownList {HTMLUListElement}
     * @param component {Vue} current instance of vue select
     * @param width {string} calculated width in pixels of the dropdown menu
     * @param top {string} absolute position top value in pixels relative to the document
     * @param left {string} absolute position left value in pixels relative to the document
     * @return {function|void}
     */
    default(dropdownList, component, {width, top, left}) {
      dropdownList.style.top = top;
      dropdownList.style.left = left;
      dropdownList.style.width = width;
    }
}
```


## clearable

Can the user clear the selected property?

```js
clearable: {
	type: Boolean,
	default: true
},
```


## clearSearchOnBlur

Enables/disables clearing the search text when the search input is blurred.

```js
clearSearchOnBlur: {
    type: Function,
    default: function ({ clearSearchOnSelect, multiple }) {
      return clearSearchOnSelect && !multiple
    }
},
```


## clearSearchOnSelect

Enables/disables clearing the search text when an option is selected.

```js
clearSearchOnSelect: {
	type: Boolean,
	default: true
},
```


## closeOnSelect

Close a dropdown when an option is chosen. Set to false to keep the dropdown
open (useful when combined with multi-select, for example)

```js
closeOnSelect: {
	type: Boolean,
	default: true
},
```

## components <Badge text="v3.1.0+" />

API to overwrite default vue-select components with your own. This can be used to change the clear button or select chevron with your own markup.

The object provided to the components prop will be merged with Vue Select's default components.

See [Components guide](../guide/components.md) for more details.

```js
import Deselect from './Deselect';
import OpenIndicator from './OpenIndicator';

// ...

components: {
  type: Object,
  default: function () {
      Deselect,
      OpenIndicator
  }
},
```


## createOption

User defined function for adding Options

```js
createOption: {
  type: Function,
  default(newOption) {
    if (typeof this.optionList[0] === 'object') {
      newOption = {[this.label]: newOption}
    }

    this.$emit('option:created', newOption)
    return newOption
  }
},
```

## deselectFromDropdown <Badge text="v3.12.0+" />

Determines whether the user can deselect an option by clicking 
it from within the dropdown menu.

```js
deselectFromDropdown: {
    type: Boolean,
    default: false
},
```

## dir

Sets RTL support. Accepts `ltr`, `rtl`, `auto`.

```js
dir: {
	type: String,
	default: "auto"
},
```


## disabled

Disable the entire component.

```js
disabled: {
	type: Boolean,
	default: false
},
```

## dropdownShouldOpen <Badge text="v3.12.0+" />

Determines whether the dropdown should open. Used
for overriding the default dropdown behaviour. Receives
the vue-select instance as the single argument to the function.

```js
dropdownShouldOpen: {
    type: Function,
    default({noDrop, open, mutableLoading}) {
      return noDrop ? false : open && !mutableLoading;
    }
}
```


## filter

Callback to filter results when search text
is provided. Default implementation loops
each option, and returns the result of
this.filterBy.

```js
filter: {
	type: Function,
	default(options, search) {
		return options.filter(option => {
			let label = this.getOptionLabel(option);
			if (typeof label === "number") {
				label = label.toString();
			}
			return this.filterBy(option, label, search);
		});
	}
},
```


## filterable

When true, existing options will be filtered
by the search text. Should not be used in conjunction
with taggable.

```js
filterable: {
	type: Boolean,
	default: true
},
```


## filterBy

Callback to determine if the provided option should
match the current search text. Used to determine
if the option should be displayed.

```js
filterBy: {
  type: Function,
  default(option, label, search) {
    return (label || '').toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1
  }
},
```


## getOptionKey

Callback to get an option key. If `option`
is an object and has an `id`, returns `option.id`
by default, otherwise tries to serialize `option`
to JSON.

The key must be unique for an option.

```js
getOptionKey: {
  type: Function,
  default(option) {
    if (typeof option === 'object' && option.id) {
      return option.id
    } else {
      try {
        return JSON.stringify(option)
      } catch(e) {
        return console.warn(
          `[vue-select warn]: Could not stringify option ` +
          `to generate unique key. Please provide 'getOptionKey' prop ` +
          `to return a unique key for each option.\n` +
          'https://vue-select.org/api/props.html#getoptionkey'
        )
        return null
      }
    }
  }
},
```


## getOptionLabel

Callback to generate the label text. If `{option}`
is an object, returns `option[this.label]` by default.

Label text is used for filtering comparison and
displaying. If you only need to adjust the
display, you should use the `option` and
`selected-option` slots.

```js
getOptionLabel: {
  type: Function,
  default(option) {
    if (typeof option === 'object') {
      if (!option.hasOwnProperty(this.label)) {
        return console.warn(
          `[vue-select warn]: Label key "option.${this.label}" does not` +
          ` exist in options object ${JSON.stringify(option)}.\n` +
          'https://vue-select.org/api/props.html#getoptionlabel'
        )
      }
      return option[this.label]
    }
    return option;
  }
},
```


## inputId

Sets the id of the input element.

```js
inputId: {
	type: String
},
```


## label

Tells vue-select what key to use when generating option
labels when each `option` is an object.

```js
label: {
	type: String,
	default: "label"
},
```


## loading

 Show spinner if the component is in a loading state.

```js
loading: {
	type: Boolean,
	default: false
},
```


## maxHeight

::: warning Deprecated in `v2.x` & Removed in `v3.0`
This prop was removed in `v3.0`. You can use the `$vs-dropdown-max-height`
SCSS variable to adjust this setting in `v3.x`.
:::

Sets the max-height property on the dropdown list.

```js
maxHeight: {
	type: String,
	default: "400px"
},
```


## multiple

Equivalent to the `multiple` attribute on a `<select>` input.

```js
multiple: {
	type: Boolean,
	default: false
},
```


## noDrop

Disable the dropdown entirely.

```js
noDrop: {
	type: Boolean,
	default: false
},
```


## onTab

Select the current value if `selectOnTab` is enabled.

```js
onTab: {
	type: Function,
	default: function() {
		if (this.selectOnTab) {
			this.typeAheadSelect();
		}
	}
},
```


## options

An array of strings or objects to be used as dropdown choices.
If you are using an array of objects, vue-select will look for
a `label` key (ex. `[{label: 'Canada', value: 'CA'}]`). A
custom label key can be set with the `label` prop.

```js
options: {
	type: Array,
	default() {
		return [];
	}
},
```


## placeholder

Equivalent to the `placeholder` attribute on an `<input>`.

```js
placeholder: {
	type: String,
	default: ""
},
```


## pushTags

When true, newly created tags will be added to
the options list.

```js
pushTags: {
	type: Boolean,
	default: false
},
```


## reduce

When working with objects, the reduce
prop allows you to transform a given
object to only the information you
want passed to a v-model binding
or @input event.

```js
reduce: {
  type: Function,
  default: option => option,
},
```


## resetOnOptionsChange

When false, updating the options will not reset the selected value.

Since `v3.4+` the prop accepts either a `boolean` or `function` that returns a `boolean`.

If defined as a function, it will receive the params listed below.

```js
/**
* @type {Boolean|Function}
* @param {Array} newOptions
* @param {Array} oldOptions
* @param {Array} selectedValue
*/
resetOnOptionsChange: {
    default: false,
    validator: (value) => ['function', 'boolean'].includes(typeof value)
},
```


## searchable

Enable/disable filtering the options.

```js
searchable: {
	type: Boolean,
	default: true
},
```


## selectable <Badge text="v3.3.0+" />

The `selectable` prop determines if an option is selectable or not. If `selectable` returns false
for a given option, it will be displayed with a `vs__dropdown-option--disabled` class. The option
will be disabled and unable to be selected.

```js
selectable: {
  type: Function,
  /**
   * @param {Object|String} option
   * @return {boolean}
   */
  default: option => true,
},
```


## selectOnTab

When true, hitting the 'tab' key will select the current select value

```js
selectOnTab: {
	type: Boolean,
	default: false
}
```


## tabindex

Set the tabindex for the input field.

```js
tabindex: {
	type: Number,
	default: null
},
```


## taggable

Enable/disable creating options from searchInput.

```js
taggable: {
	type: Boolean,
	default: false
},
```


## transition

Sets a Vue transition property on the `.dropdown-menu`. vue-select
does not include CSS for transitions, you'll need to add them yourself.

```js
transition: {
	type: String,
	default: "fade"
},
```

## uid

A unique identifier used to generate IDs and DOM attributes.
Must be unique for every instance of the component.

```js
uid: {
  type: [String, Number],
  default: () => uniqueId(),
},
```


## value

Contains the currently selected value. Very similar to a
`value` attribute on an `<input>`. You can listen for changes
using the 'input' event.

```js
value: {
	default: null
},
```
