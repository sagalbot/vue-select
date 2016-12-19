# vue-select [![Build Status](https://travis-ci.org/sagalbot/vue-select.svg?branch=master)](https://travis-ci.org/sagalbot/vue-select) [![Code Coverage](https://img.shields.io/codeclimate/coverage/github/sagalbot/vue-select.svg?style=flat-square)](https://codeclimate.com/github/sagalbot/vue-select) [![No Dependencies](https://img.shields.io/gemnasium/sagalbot/vue-select.svg?style=flat-square)](https://gemnasium.com/github.com/sagalbot/vue-select) ![MIT License](https://img.shields.io/github/license/sagalbot/vue-select.svg?style=flat-square) ![Current Release](https://img.shields.io/github/release/sagalbot/vue-select.svg?style=flat-square)

> A native Vue.js component that provides similar functionality to Select2 without the overhead of jQuery.

Rather than bringing in jQuery just to use Select2 or Chosen, this Vue.js component provides similar functionality without the extra overhead of jQuery, while providing the same awesome data-binding features you expect from Vue. Vue-select has no JavaScript dependencies other than Vue, and is designed to mimic [Select2](https://github.com/select2/select2).


#### Features

- **AJAX Support +v1.2.0**
- Tagging Support **+v.1.1.0**
- No JS Dependencies
- List Filtering/Searching
- Supports Vuex
- Select Single/Multiple Options
- Bootstrap Friendly Markup
- +95% Test Coverage

#### Upcoming/In Progress

- ~~Tagging (adding options not present in list, see `taggable` branch)~~ **+v.1.1.0**
- ~~Asyncronous Option Loading~~ **+v.1.2.0**
- Rich Option Templating

## Live Examples & Docs
- [Demo & Docs](http://sagalbot.github.io/vue-select/)
- [Live Example on JSBin](http://jsbin.com/saxaru/5/edit?html,js,output)

## Install / Usage

#### NPM Based WorkFlows
``` bash
$ npm install vue-select
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
        value: null,
        options: ['foo','bar','baz']
     }
  }
}
</script>
```

#### Browser Globals

`v1.3.0+` no longer requires any toolchain to use the component:

Just include `vue` & `vue-select.js` - I recommend using [npmcdn](https://npmcdn.com/#/).

```html
<!-- use the latest release -->
<script src="https://npmcdn.com/vue-select@latest"></script>
<!-- or point to a specific release -->
<script src="https://npmcdn.com/vue-select@1.30"></script>
```
Then register the component in your javascript:

```js
Vue.component('v-select', VueSelect.VueSelect);
```

From there you can use as normal. Here's an [example on JSBin](http://jsbin.com/saxaru/5/edit?html,js,output).

## Parameters
```javascript
 /**
  * Contains the currently selected value. Very similar to a
  * `value` attribute on an <input>. In most cases, you'll want
  * to set this as a two-way binding, using :value.sync. However,
  * this will not work with Vuex, in which case you'll need to use
  * the onChange callback property.
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
  * @type {Object}
  */
 options: {
   type: Array,
   default() { return [] },
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
  * @type {Object}
  */
 multiple: {
   type: Boolean,
   default: false
 },

 /**
  * Equivalent to the `placeholder` attribute on an `<input>`.
  * @type {Object}
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
   default: 'expand'
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
  * Tells vue-select what key to use when generating option
  * labels when each `option` is an object.
  * @type {String}
  */
 label: {
   type: String,
   default: 'label'
 },

 /**
  * An optional callback function that is called each time the selected
  * value(s) change. When integrating with Vuex, use this callback to trigger
  * an action, rather than using :value.sync to retreive the selected value.
  * @type {Function}
  * @default {null}
  */
 onChange: Function,

 /**
  * Enable/disable creating options from searchInput.
  * @type {Boolean}
  */
 taggable: {
   type: Boolean,
   default: false
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
  * User defined function for adding Options
  * @type {Function}
  */
 createOption: {
   type: Function,
   default: function (newOption) {
     if (typeof this.options[0] === 'object') {
		return {[this.label]: newOption}
     }
     return newOption
   }
 }
```


## Build Setup for Contributing

If there's a feature you'd like to see or you find a bug, feel free to fork and submit a PR. If your adding functionality, add tests to go with it.

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# run unit tests
npm test

# run unit tests on save
npm run test-watch
```