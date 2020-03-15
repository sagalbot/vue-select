# vue-select ![Current Release](https://img.shields.io/github/release/sagalbot/vue-select.svg?style=flat-square) ![Bundle Size](https://flat.badgen.net/bundlephobia/min/vue-select) ![Monthly Downloads](https://img.shields.io/npm/dm/vue-select.svg?style=flat-square) [![Coverage Status](https://coveralls.io/repos/github/sagalbot/vue-select/badge.svg?branch=master)](https://coveralls.io/github/sagalbot/vue-select?branch=master) ![Maintainability Score](https://img.shields.io/codeclimate/maintainability/sagalbot/vue-select.svg?style=flat-square) ![MIT License](https://img.shields.io/github/license/sagalbot/vue-select.svg?style=flat-square)

> **Everything you wish the HTML `<select>` element could do, wrapped up into a lightweight, zero
> dependency, extensible Vue component.**

- Tagging
- Filtering / Searching
- Vuex Support
- AJAX Support
- SSR Support
- ~20kb Total / ~5kb CSS / ~15kb JS
- Select Single/Multiple Options
- Customizable with slots and SCSS variables
- Zero dependencies

## Documentation

Complete documentation and examples available at https://vue-select.org.

- **[API Documentation](https://vue-select.org)**
- **[CodePen Template](http://codepen.io/sagalbot/pen/NpwrQO)**

## Sponsorship

It takes a lot of effort to maintain Vue Select. If it has saved you development time, please
consider [sponsoring Vue Select](https://github.com/sponsors/sagalbot) on GitHub sponsors!

## Install

```bash
yarn add vue-select

# or use npm

npm install vue-select
```

Then, import and register the component:

```js
import Vue from "vue";
import vSelect from "vue-select";

Vue.component("v-select", vSelect);
```

The component itself does not include any CSS. You'll need to include it separately:

```js
import "vue-select/dist/vue-select.css";
```

Alternatively, you can import the scss for complete control of the component styles:

```scss
@import "vue-select/src/scss/vue-select.scss";
```

You can also include vue-select directly in the browser. Check out the
[documentation for loading from CDN.](https://vue-select.org/guide/install.html#in-the-browser).

## License

[MIT](https://github.com/sagalbot/vue-select/blob/master/LICENSE.md)
