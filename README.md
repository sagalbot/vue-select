# vue-select [![Build Status](https://travis-ci.org/sagalbot/vue-select.svg?branch=master)](https://travis-ci.org/sagalbot/vue-select) [![Code Score](https://img.shields.io/codeclimate/github/sagalbot/vue-select.svg?style=flat-square)](https://lima.codeclimate.com/github/sagalbot/vue-select) [![Code Coverage](https://img.shields.io/codeclimate/coverage/github/sagalbot/vue-select.svg?style=flat-square)](https://codeclimate.com/github/sagalbot/vue-select) [![No Dependencies](https://img.shields.io/gemnasium/sagalbot/vue-select.svg?style=flat-square)](https://gemnasium.com/github.com/sagalbot/vue-select) ![MIT License](https://img.shields.io/github/license/sagalbot/vue-select.svg?style=flat-square) ![Current Release](https://img.shields.io/github/release/sagalbot/vue-select.svg?style=flat-square)

> A native Vue.js select component that provides similar functionality to Select2 without the overhead of jQuery.

#### Features
- AJAX Support
- Tagging
- List Filtering/Searching
- Supports Vuex
- Select Single/Multiple Options
- Tested with Bootstrap 3/4, Bulma, Foundation
- +95% Test Coverage
- ~33kb minified with CSS
- Zero dependencies

## Documentation
- **[Demo & Docs](http://sagalbot.github.io/vue-select/)**
- **[Example on JSBin](http://jsbin.com/saxaru/8/edit?html,js,output)**
- **[CodePen Template](http://codepen.io/sagalbot/pen/NpwrQO)**
- **[Trello Roadmap](https://trello.com/b/vWvITNzS/vue-select)**

## Install

###### Vue Compatibility
-  `vue ~2.0` use `vue-select ~2.0`
-  `vue ~1.0` use `vue-select ~1.0`

#### NPM
Install the package. _You should install `vue-select@1.3.3` for use with vue `~1.0`._

```bash
$ npm install vue-select
```

Register the component

```js
import Vue from 'vue'
import vSelect from 'vue-select'
Vue.component('v-select', vSelect)
```

You may now use the component in your markup

```html
<v-select v-model="selected" :options="['foo','bar']"></v-select>
```

#### CDN

Just include `vue` & `vue-select.js` - I recommend using [unpkg](https://unpkg.com/#/).

```html
<script src="https://unpkg.com/vue@latest"></script>
<!-- use the latest release -->
<script src="https://unpkg.com/vue-select@latest"></script>
<!-- or point to a specific release -->
<script src="https://unpkg.com/vue-select@1.3.3"></script>
```

Then register the component in your javascript:

```js
Vue.component('v-select', VueSelect.VueSelect);
```

You may now use the component in your markup

```html
<v-select v-model="selected" :options="['foo','bar']"></v-select>
```

Here's an [example on JSBin](http://jsbin.com/saxaru/5/edit?html,js,output).

## Basic Usage

#### Syncing a Selected Value

The most common use case for `vue-select` is to have the chosen value synced with a parent component. `vue-select` takes advantage of the `v-model` syntax to sync values with a parent.

```html
<v-select v-model="selected"></v-select>
```
```js
new Vue({
  data: {
    selected: null
  }
})
```

#### Setting Options

`vue-select` accepts arrays of strings and objects to use as options through the `options` prop.

```html
<v-select :options="['foo','bar']"></v-select>
```

When provided an array of objects, `vue-select` will display a single value of the object. By default, `vue-select` will look for a key named 'label' on the object to use as display text.

```html
<v-select :options="[{label: 'foo', value: 'Foo'}]"></v-select>
```

### For more information, please visit the [vue-select documentation.](https://sagalbot.github.io/vue-select)
