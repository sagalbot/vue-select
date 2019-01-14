## Select

```js
/**
 * Contains the currently selected value. Very similar to a
 * `value` attribute on an <input>. You can listen for changes
 * using 'change' event using v-on
 * @type {Object||String||null}
 */
value: {
	default: null
},

/**
 * An array of strings or objects to be used as dropdown choices.
 * If you are using an array of objects, vue-select will look for
 * a `label` key (ex. [{label: 'This is Foo', value: 'foo'}]). A
 * custom label key can be set with the `label` prop.
 * @type {Array}
 */
options: {
	type: Array,
	default() {
		return []
	},
},

/**
 * Disable the entire component.
 * @type {Boolean}
 */
disabled: {
	type: Boolean,
	default: false
},

/**
 * Value of the 'autocomplete' field of the input
 * element.
 * @type {String}
 */
autocomplete: {
  type: String,
  default: 'off'
},

/**
 * Sets the max-height property on the dropdown list.
 * @deprecated
 * @type {String}
 */
maxHeight: {
	type: String,
	default: '400px'
},

/**
 * Enable/disable filtering the options.
 * @type {Boolean}
 */
searchable: {
	type: Boolean,
	default: true
},

/**
 * Equivalent to the `multiple` attribute on a `<select>` input.
 * @type {Boolean}
 */
multiple: {
	type: Boolean,
	default: false
},

/**
 * Equivalent to the `placeholder` attribute on an `<input>`.
 * @type {String}
 */
placeholder: {
	type: String,
	default: ''
},

/**
 * Sets a Vue transition property on the `.dropdown-menu`. vue-select
 * does not include CSS for transitions, you'll need to add them yourself.
 * @type {String}
 */
transition: {
	type: String,
	default: 'fade'
},

/**
 * Enables/disables clearing the search text when an option is selected.
 * @type {Boolean}
 */
clearSearchOnSelect: {
	type: Boolean,
	default: true
},

/**
 * Enables/disables allowing the user to clear the selected property.
 * @type {Boolean}
 */
clearable: {
  type: Boolean,
  default: true
},

/**
 * Close a dropdown when an option is chosen. Set to false to keep the dropdown
 * open (useful when combined with multi-select, for example)
 * @type {Boolean}
 */
closeOnSelect: {
	type: Boolean,
	default: true
},

/**
 * Tells vue-select what key to use when generating option
 * labels when each `option` is an object.
 * @type {String}
 */
label: {
	type: String,
	default: 'label'
},

/**
 * Callback to generate the label text. If {option}
 * is an object, returns option[this.label] by default.
 * @type {Function}
 * @param  {Object || String} option
 * @return {String}
 */
getOptionLabel: {
	type: Function,
	default(option) {
		if (typeof option === 'object') {
			if (!option.hasOwnProperty(this.label)) {
				return console.warn(
					`[vue-select warn]: Label key "option.${this.label}" does not` +
					` exist in options object ${JSON.stringify(option)}.\n` +
					'http://sagalbot.github.io/vue-select/#ex-labels'
				)
			}
			if (this.label && option[this.label]) {
				return option[this.label]
			}
		}
		return option;
	}
},

/**
* Callback to determine if the provided option should
* match the current search text. Used to determine
* if the option should be displayed.
* @type   {Function}
* @param  {Object || String} option
* @param  {String} label
* @param  {String} search
* @return {Boolean}
*/
filterBy: {
	type: Function,
	default(option, label, search) {
		return (label || '').toLowerCase().indexOf(search.toLowerCase()) > -1
	}
},

/**
 * An optional callback function that is called each time the selected
 * value(s) change. When integrating with Vuex, use this callback to trigger
 * an action, rather than using :value.sync to retreive the selected value.
 * @type {Function}
 * @param {Object || String} val
 */
onChange: {
	type: Function,
	default: function (val) {
		this.$emit('input', val)
	}
},

/**
 * Enable/disable creating options from searchInput.
 * @type {Boolean}
 */
taggable: {
	type: Boolean,
	default: false
},

/**
 * Set the tabindex for the input field.
 * @type {Number}
 */
tabindex: {
	type: Number,
	default: null
},

/**
 * When true, newly created tags will be added to
 * the options list.
 * @type {Boolean}
 */
pushTags: {
	type: Boolean,
	default: false
},

/**
 * When true, existing options will be filtered
 * by the search text. Should not be used in conjunction
 * with taggable.
 * @type {Boolean}
 */
filterable: {
	type: Boolean,
	default: true
},

/**
 * User defined function for adding Options
 * @type {Function}
 */
createOption: {
	type: Function,
	default(newOption) {
		if (typeof this.mutableOptions[0] === 'object') {
			newOption = {[this.label]: newOption}
		}
		this.$emit('option:created', newOption)
		return newOption
	}
},

/**
 * When false, updating the options will not reset the select value
 * @type {Boolean}
 */
resetOnOptionsChange: {
	type: Boolean,
	default: false
},

/**
 * Disable the dropdown entirely.
 * @type {Boolean}
 */
noDrop: {
	type: Boolean,
	default: false
},

/**
 * Sets the id of the input element.
 * @type {String}
 * @default {null}
 */
inputId: {
	type: String
},

/**
 * Sets RTL support. Accepts 'ltr', 'rtl', 'auto'.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir
 * @type {String}
 * @default 'auto'
 */
dir: {
	type: String,
	default: 'auto'
},
```

## AJAX

```js
/**
 * Toggles the adding of a 'loading' class to the main
 * .v-select wrapper. Useful to control UI state when
 * results are being processed through AJAX.
 */
loading: {
	type: Boolean,
	default: false
},

/**
 * Accept a callback function that will be
 * run when the search text changes.
 *
 * loading() accepts a boolean value, and can
 * be used to toggle a loading class from
 * the onSearch callback.
 *
 * @param {search}  String          Current search text
 * @param {loading} Function(bool)  Toggle loading class
 */
onSearch: {
	type: Function,
	default: function(search, loading){}
}
```

