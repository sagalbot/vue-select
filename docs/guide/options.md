## Options Prop

`vue-select` accepts arrays of primitive values or objects to use as options through the `options` prop:

```html
<!-- array of strings or numbers -->
<v-select :options="['foo','bar']"></v-select>
```

<v-select :options="['foo','bar']"></v-select>

```html
<!-- or, an array of objects -->
<v-select :options="[{label: 'foo', value: 'Foo'}]"></v-select>
```

<v-select :options="[{label: 'foo', value: 'Foo'}]"></v-select>

## Option Labels

#### Options as Primitives (strings, numbers, boolean)

When `options` contains strings or numbers, they'll be used as the label for the option within the
component. No further configuration is necessary. 

#### Options as Objects

When `options` is an array of objects, the component must generate a label to be shown as the 
options text. By default, `vue-select` will attempt to render `option.label` as the option label. 
You might not have a `label` key in your objects, so you can set your own label to match your 
source data using the `label {String}` prop.

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

<country-select />

## Null / Empty Options

`vue-select` requires the `options` prop to be an `array`. If you are using Vue in development 
mode, you will get warnings attempting to pass anything other than an `array` to the `options` prop. 
If you need a `null`/`empty` value, use an empty array `[]`.

## Tagging

To allow input that's not present within the options, set the `taggable` prop to true.
If you want new tags to be pushed to the options list, set `push-tags` to true.

```html
<v-select taggable multiple push-tags />
```

<v-select taggable multiple push-tags />
