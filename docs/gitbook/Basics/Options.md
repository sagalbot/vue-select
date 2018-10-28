## Dropdown Options {#options}

`vue-select` accepts arrays of strings or objects to use as options through the `options` prop:

```html
<v-select :options="['foo','bar']"></v-select>
```

When provided an array of objects, `vue-select` will display a single value of the object. By default, `vue-select` will look for a key named `label` on the object to use as display text.

```html
<v-select :options="[{label: 'foo', value: 'Foo'}]"></v-select>
```

### Option Labels {#labels}

When the `options` array contains objects, `vue-select` looks for the `label` key to display by default. You can set your own label to match your source data using the `label` prop.

For example, consider an object with `countryCode` and `countryName` properties:

```json
{
  countryCode: "CA",
  countryName: "Canada"
}
```

If you wanted to display `Canada` in the dropdown, you'd use the `countryName` key:

```html
<v-select label="countryName" :options="countries"></v-select>
```

[](codepen://sagalbot/aEjLPB?height=500)


### Option index {#values}

When the `options` array contains objects, `vue-select` returns the whole object as dropdown value upon selection. You can specify your own `index` prop to return only the value contained in the specific property.

For example, consider an object with `value` and `label` properties:

```json
{
  value: "CA",
  label: "Canada"
}
```

If you wanted to return `CA` in the dropdown when `Canada` is selected, you'd use the `index` key:

```html
<v-select index="value" :options="countries"></v-select>
```


### Null / Empty Options {#null}

`vue-select` requires the `option` property to be an `array`. If you are using Vue in development mode, you will get warnings attempting to pass anything other than an `array` to the `options` prop. If you need a `null`/`empty` value, use an empty array `[]`.
