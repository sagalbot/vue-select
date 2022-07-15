## `input`

Triggered when the selected value changes. Used internally for `v-model`.

```js
/**
 * @param {Object|String} val - selected option.
 */
this.$emit("input", val);
```

## `open`

Triggered when the dropdown is open.

```js
this.$emit("open");
```

## `close`

Triggered when the dropdown is closed.

```js
this.$emit("close");
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
 * @param {Object} newOption - created option
 */
this.$emit("option:created", newOption);
```

## `search`

Anytime the search string changes, emit the
'search' event. The event is passed with two 
parameters: the search string, and a function 
that accepts a boolean parameter to toggle the 
loading state.

See the [AJAX Guide](/guide/ajax.html#loading-options-with-ajax) 
for a complete example.

```js
/**
 * @param {String} searchString - the search string
 * @param {Function} toggleLoading - function to toggle loading state, accepts true or false boolean
 */
this.$emit('search', this.search, this.toggleLoading);
```

```vue
<!-- example usage -->
<v-select
    @search="(search, loading) => { 
      loading(true)
      fetchOptions(search).then(() => loading(false))
    }"
/>
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
