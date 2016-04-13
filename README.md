# vue-select [![Build Status](https://travis-ci.org/sagalbot/vue-select.svg?branch=master)](https://travis-ci.org/sagalbot/vue-select)

Rather than bringing in jQuery just to use Select2 or Chosen, this Vue.js component provides similar functionality without the extra overhead of jQuery, while providing the same awesome data-binding features you expect from Vue. Vue-select has no JavaScript dependencies other than Vue.

Currently the `vue-select` component includes bootstrap classes in the markup, that provide some default layout styles. If you're not using bootstrap in your project, you'll need to add some CSS yourself. This will likely be updated in the future so that the bootstrap classes are optional, and if they're not included, some sensible default layout-related CSS will be used.

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
```javascript
  /**
   * Contains the currently selected value. Very similar to a
   * `value` attribute on an &amp;lt;input&amp;gt;. In most cases, you'll want
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
   * @type {Array}
   */
  options: {
    type: Array,
    default() { return [] },
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
   * Equivalent to the `multiple` attribute on a `&lt;select&gt;` input.
   * @type {Object}
   */
  multiple: {
    type: Boolean,
    default: false
  },

  /**
   * Equivalent to the `placeholder` attribute on an `&lt;input&gt;`.
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
   * Tells vue-select what key to use when generating option labels when
   * `option` is an object.
   * @type {Object}
   */
  label: {
    type: String,
    default: 'label'
  },

  /**
   * An optional callback function that is called each time the selected
   * value(s) change. When integrating with Vuex, use this callback to trigger
   * an action, rather than using :value.sync to retreive the selected value.
   * @type {[type]}
   */
  onChange: Function,

  /**
   * Enable/disable creating options from searchInput.
   * @type {Boolean}
   */
  tagable: {
    type: Boolean,
    default: false
  },

  /**
   * User defined function for adding Options
   * @type {Function}
   */
  createOption: {
    type: Function,
    default: function (value) {
      let firstOption = this.options[0]
      if (firstOption && typeof firstOption === 'object' ) {
        value = {
          value
        }
        value[this.label] = value
      }
      return value
    }
  }
```

## Todos:
- load data from an ajax source with vue-resource
- rich option formatting with slots/partials
- fix layout/toggle issues when `searchable` is false
- `simple` prop that disables `search` and keeps a static `placeholder` regardless of current selection (useful for things like icon button dropdowns)
- less opinionated styles / only include css necessary to acheive layout (no colors, etc)
- ~~ability to pre-select options when using `[{label: 'Foo', value: 'foo'}]` syntax (already works with `['foo','bar','baz']` syntax)~~
- ~~fix layout issues with multiple selections~~
	- ~~tags overflow outside `.dropdown`~~
	- ~~search input overflows outside `.dropdown`~~
- ~~use an actual element instead of `:after` to detect clicks on dropdown caret~~

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

For more information see the [docs for vueify](https://github.com/vuejs/vueify).
