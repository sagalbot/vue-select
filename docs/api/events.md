## `input`

Triggered when the selected value changes. Used internally for `v-model`.

```js
/**
 * @param val {Object|String}` - selected option.
 */
this.$emit("input", val);
```

## `option:selecting` <Badge text="v3.11.0+" />

Triggered after an option has been selected, <strong>before</strong> updating internal state. 

```js
this.$emit("option:selecting", selectedOption);
```

## `option:selected` <Badge text="v3.11.0+" />

Triggered when an option has been selected, <strong>after</strong> updating internal state. 

```js
this.$emit("option:selected", selectedOption);
```

## `option:deselecting` <Badge text="v3.11.0+" />

Triggered when an option has been deselected, <strong>before</strong> updating internal state. 

```js
this.$emit("option:deselecting", selectedOption);
```

## `option:deselected` <Badge text="v3.11.0+" />

Triggered when an option has been deselected, <strong>after</strong> updating internal state. 

```js
this.$emit("option:deselected", deselectedOption);
```

## `option:created`

Triggered when `taggable` is `true` and a new option has been created.

```js
/**
 * @param newOption {Object} - created option
 */
this.$emit("option:created", newOption);
```

## `search:blur`

Triggered when the text input loses focus. The dropdown will close immediately before this
event is triggered.

```js
this.$emit("search:blur");
```

## `search:focus`

Triggered when the text input gains focus. The dropdown will open immediately before this
event is triggered.

```js
this.$emit("search:focus");
```

## `search`

Triggered when the search text changes.

```js
/**
 * Anytime the search string changes, emit the
 * 'search' event. The event is passed with two
 * parameters: the search string, and a function
 * that accepts a boolean parameter to toggle the
 * loading state.
 *
 * @emits search
 */
this.$emit('search', newSearchString, toggleLoading);
```

