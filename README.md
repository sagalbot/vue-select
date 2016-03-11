# vue-select

Rather than bringing in jQuery just to use Select2 or Chosen, this Vue.js component provides similar functionality without the extra overhead of jQuery.

## Demo
[http://sagalbot.github.io/vue-select/](http://sagalbot.github.io/vue-select/)

## Install / Usage
``` bash
$ npm install sagalbot/vue-select
```

```html
<template>
   <div id="myApp">
      <v-select :value.sync="selected" :options="options"></v-select>
   </div>
</template>

<script>
import vSelect from 'vue-select'
export default {
  components: {vSelect},
  data() {
     return {
        selected: null,
        options: ['foo','bar','baz']
     }
  }
}
</script>
```

## Parameters
- `value` Represents the currently selected value(s). Can be `null`, an empty string, or `[]`. If `multiple` is true, the current value will be represented in an array, otherwise it will be a single string or object, depending on what you've passed for `options`.
	- twoway: true,
  - required: true
- `options` An array of strings or objects to be used as dropdown choices. Supports `['foo','bar']` & `[{label: 'Foo', value: 'foo'}]`. When using the `[{}]` syntax, the objects in the array can have as many properties as you need, as long as the object contains `value` and `label` keys. Also, when using the `[{}]` syntax, the `label` value will be output as HTML, so you can insert rich text into your options.
	- type: `Array`
  - default: `[]`
- `maxHeight` Limit the height of the dropdown menu.
	- type: String
	- default: '400px' 	
- `searchable` Toggle filtering of options.
	- type: Boolean
	- default: true 	
- `multiple` Equivalent to `multiple` attribute on a `<select>`.
	- type: Boolean
	- default: true
- `placeholder` Equivalent to `placeholder` attribute on an `<input>`.
	- type: String
	- default: ' '
- `transition` Vue `transition` prop applied to the `.dropdown-menu`.
	- type: Boolean
	- default: true

## Todos:
- ~~fix layout issues with multiple selections~~
	- ~~tags overflow outside `.dropdown`~~
	- ~~search input overflows outside `.dropdown`~~
- ~~use an actual element instead of `:after` to detect clicks on dropdown caret~~
- fix layout/toggle issues when `searchable` is false
- `simple` prop that disables `search` and keeps a static `placeholder` regardless of current selection (useful for things like icon button dropdowns)
- less opinionated styles / only include css necessary to acheive layout (no colors, etc)
- ability to pre-select options when using `[{label: 'Foo', value: 'foo'}]` syntax (already works with `['foo','bar','baz']` syntax)
- (maybe) load data from an ajax source with vue-resource
- more tests!!


## Build Setup for Contributing

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production without minification
npm run build

# build for production with minification
npm run uglify

# lint all *.js and *.vue files
npm run lint

# run unit tests
npm test
```

For more information see the [docs for vueify](https://github.com/vuejs/vueify).
