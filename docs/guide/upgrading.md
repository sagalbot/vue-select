# Upgrading 2.x to 3.x

---

## `index` prop replaced with `reduce`

- v2.x provided the `index` `{String}` prop to return a single key from a selected object
- v3.x removes the `index` prop, replacing it with the `reduce` `{Function}` prop. 

Using a function instead of a string provides a whole lot more flexibility, allowing for things like
 deeply nested values, and really cleaned up the code internally.
 
```js
const options = [{country: 'Canada', code: 'CA'},];
```
 
```html
<!-- v2: using index --->
<v-select :options="options" label="country" index="code"  />

<!-- v3: using reduce --->
<v-select :options="options" label="country" :reduce="country => country.code" />
```

View the full [documentation for `reduce`](values.md#returning-a-single-key-with-reduce).

## Events instead of Callbacks

Three function callbacks have been removed in favor of using events.

- `onChange`
- `onInput`
- `onSearch`

While this is a breaking change, the change in your application should be as simple as swapping the
prop you were using for an event.

### `onChange` & `onInput`

In v2.x, Overwriting `onChange` in an application was more likely to break vue-select's internals 
and cause issues. The `input` event provides identical functionality and can be swapped out in your 
application. 

```html
<!-- version 2: -->
<v-select :on-change="doSomething" />

<!-- version 3: -->
<v-select @input="doSomething" />
```

Additionally, the `change` event has been removed. This event was redundant, `input` should be used 
instead.

```html
<!-- version 2: -->
<v-select @change="doSomething" />

<!-- version 3: -->
<v-select @input="doSomething" />
```

### `onSearch`

The `onSearch` prop was removed for the same reason as `onChange` and `onInput`. The `search` event
has always provided the same parameters and can be used in it's place.

```html
<!-- version 2: -->
<v-select :on-search="doSomeAjax" />

<!-- version 3: -->
<v-select @search="doSomeAjax" />
```

### `@search` with null search string

The `@search` event is now fired anytime the search string changes. In v2.x, the component
would first check if the search string was empty, and only emit the event if it had at least one
character. This was a design mistake, as it should be the consumers decision if a search should be
run on an empty string. 

## Separated CSS

CSS was removed from the JS bundle in favor of a separate CSS file to support SSR and easier
customization.

  ```js
  @import vSelect from 'vue-select`;
  @import 'vue-select/dist/vue-select.css';
  ```

## New Class Selector Prefix

In order to avoid CSS collisions and allow for low specificity overrides of CSS, all classes have 
been renamed to include the `vs__` prefix. The full list of renamed classes are listed below:

| original | renamed |
| ------- | --------- |
| `.open-indicator` | `.vs__open-indicator` |
| `.dropdown-toggle` | `.vs__dropdown-toggle` |
| `.dropdown-menu` | `.vs__dropdown-menu` |
| `.clear` | `.vs__clear` |
| `.selected-tag` | `.vs__selected` |
| `.no-options` | `.vs__no-options` |
| `.spinner` | `.vs__spinner` |
| `.close` | `.vs__deselect` |
| `.active` | `.vs__active` |

## Internal State

**The changes listed below are very unlikely to break your apps** unless you've been hooking into 
vue-select internal values. [#781](https://github.com/sagalbot/vue-select/pull/781) 
(thanks [@owenconti!](https://github.com/owenconti)) introduced a number of optimizations to the 
way that the component handles internal state.

- `value`: the `value` prop is undefined by default. vue-select no longer maintains an internal `mutableValue` state when a `value` prop has been passed. When `:value` or `v-model` is not used, vue-select will maintain internal state using the `_value` property.
- `mutableOptions` has been removed in favor of an `optionList` computed property.

## Misc

- `fade` transition renamed to `vs__fade`
- Removed `a` element that was serving as the click handler within dropdown options
