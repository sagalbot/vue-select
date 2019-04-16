## `input`

Triggered when the selected value changes. Used internally for `v-model`.

```js
/**
 * @param val {Object|String}` - selected option.
 */
this.$emit("input", val);
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
