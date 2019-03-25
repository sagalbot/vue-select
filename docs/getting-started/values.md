## Getting / Setting

### `v-model`

The most common use case for `vue-select` is to have the chosen value synced with a parent component. `vue-select` 
takes advantage of the `v-model` syntax to sync values with a parent.

```html
<v-select v-model="selected" />
```

### `value` prop & `input` event

If you don't require the `value` to be synced, but you need to preselect a value, you can use the `value` prop. It will
accept strings, numbers or objects. If you're using a `multiple` v-select, you'll want to pass an array. 

```html
<v-select :value="selected" />
```

The `value` prop is very useful when using a state management tool, like Vuex. `vue-select` will emit an `input` event 
any time a value changes.

```html
<v-select :value="selected" @input="setSelected" />
```

```js
methods: {
  setSelected(value) {
     //  do something with selected value  
  }
}
```
## Transforming Selections

When the `options` array contains objects, `vue-select` returns the whole object as dropdown value upon selection.

If you need to return a single key, or transform the data before it is synced, `vue-select` provides a `reduce` callback
 that allows you to transform a selected option before it is passed to the `@input` event. Consider this data structure:
 
 ```js
 let options = [{code: 'CA', country: 'Canada'}, ...];
 ```
 
 If we want to display the `country`, but return the `code` to `v-model`, we can use the `reduce` prop to receive
 only the data that's required.
 
 ```html
 <v-select :options="options" :reduce="country => country.code" label="country" />
 ```
  
The `reduce` property also works well when you have a deeply nested value:
 
 ```
 {
   country: 'canada',
   meta: {
     id: '1',
     code: 'ca'
   }
 }
 ```
 
 ```html
 <v-select :options="options" :reduce="country => country.value.id" label="country" />
 ```

## Single/Multiple Selection

By default, `vue-select` supports choosing a single value. If you need multiple values, use the `multiple` boolean prop,
much the same way you would on a native `<select>` element. When `multiple` is true, `v-model` or `value` should be
arrays.
 

```html
<v-select multiple v-model="selected" :options="['foo','bar']" />
```
<v-select multiple :options="['foo','bar']" />
