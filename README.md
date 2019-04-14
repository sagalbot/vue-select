# vue-select [![Build Status](https://travis-ci.org/sagalbot/vue-select.svg?branch=master)](https://travis-ci.org/sagalbot/vue-select) [![Coverage Status](https://coveralls.io/repos/github/sagalbot/vue-select/badge.svg)](https://coveralls.io/github/sagalbot/vue-select) ![MIT License](https://img.shields.io/github/license/sagalbot/vue-select.svg?style=flat-square) ![Current Release](https://img.shields.io/github/release/sagalbot/vue-select.svg?style=flat-square)

> Everything you wish the HTML `<select>` element could do, wrapped up into a zero dependency, highly extensible Vue component. 

#### Features
- Tagging
- Filtering/Searching
- Vuex Support
- AJAX Support
- SSR Support
- ~20kb Total / ~5kb CSS / ~15kb JS
- Select Single/Multiple Options
- Tested with Bootstrap 3/4, Bulma, Foundation
- +95% Test Coverage
- Zero dependencies

## Install

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
<v-select v-model="selected" :options="['Vue.js','React']"></v-select>
```

## Documentation https://vue-select.org
- **[Demo & Docs](https://vue-select.org)**
- **[Sandbox](https://vue-select.org/sandbox.html)**
- **[CodePen Template](http://codepen.io/sagalbot/pen/NpwrQO)**
- **[Projects](https://github.com/sagalbot/vue-select/projects)**

## License

[MIT](https://github.com/sagalbot/vue-select/blob/master/LICENSE.md)
