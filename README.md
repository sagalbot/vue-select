# vue-select ![Current Release](https://img.shields.io/github/release/sagalbot/vue-select.svg?style=flat-square) ![Release Date](https://img.shields.io/github/release-date/sagalbot/vue-select?style=flat-square) ![Bundle Size](https://flat.badgen.net/bundlephobia/min/vue-select) ![Monthly Downloads](https://img.shields.io/npm/dm/vue-select.svg?style=flat-square) [![Coverage Status](https://coveralls.io/repos/github/sagalbot/vue-select/badge.svg?branch=master)](https://coveralls.io/github/sagalbot/vue-select?branch=master) ![MIT License](https://img.shields.io/github/license/sagalbot/vue-select.svg?style=flat-square)

> **Everything you wish the HTML `<select>` element could do, wrapped up into a lightweight, zero
> dependency, extensible Vue component.**

Vue Select is a feature rich select/dropdown/typeahead component. It provides a default
template that fits most use cases for a filterable select dropdown. The component is designed to be as
lightweight as possible, while maintaining high standards for accessibility,
developer experience, and customization.

- Tagging
- Filtering / Searching
- Vuex Support
- AJAX Support
- SSR Support
- Accessible
- ~20kb Total / ~5kb CSS / ~15kb JS
- Select Single/Multiple Options
- Customizable with slots and SCSS variables
- Zero dependencies

## Documentation

Complete documentation and examples available at https://vue-select.org.

- **[API Documentation](https://vue-select.org)**
- **[CodePen Template](http://codepen.io/sagalbot/pen/NpwrQO)**

## Sponsors :tada:

It takes a lot of effort to maintain this project. If it has saved you development time, please consider [sponsoring the project](https://github.com/sponsors/sagalbot)
with GitHub sponsors!

Huge thanks to the [sponsors](https://github.com/sponsors/sagalbot) and [contributors](https://github.com/sagalbot/vue-select/graphs/contributors) that make Vue Select possible!

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
