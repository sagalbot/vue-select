## Yarn / NPM
Install with yarn:
```bash
yarn add vue-select

# or, using NPM
npm install vue-select
```

Then, import and register the component:

```js
import Vue from 'vue'
import vSelect from 'vue-select'

Vue.component('v-select', vSelect)
```

The component itself does not include any CSS. You'll need to include it separately:

```js
import 'vue-select/dist/vue-select.css';
```

Alternatively, you can import the scss for complete control of the component styles:

```scss
@import "vue-select/src/scss/vue-select.scss";
```

## In the Browser

vue-select ships as an UMD module that is accessible in the browser. When loaded
in the browser, you can access the component through the `VueSelect.VueSelect` 
global variable. You'll need to load Vue.js, vue-select JS & vue-select CSS.

```html
<!-- include VueJS first -->
<script src="https://unpkg.com/vue@latest"></script>

<!-- use the latest vue-select release -->
<script src="https://unpkg.com/vue-select@latest"></script>
<link rel="stylesheet" href="https://unpkg.com/vue-select@latest/dist/vue-select.css">

<!-- or point to a specific vue-select release -->
<script src="https://unpkg.com/vue-select@3.0.0"></script>
<link rel="stylesheet" href="https://unpkg.com/vue-select@3.0.0/dist/vue-select.css">
```
Then register the component in your javascript:

```js
Vue.component('v-select', VueSelect.VueSelect);
```

<CodePen url="dJjzeP" />

## Vue Compatibility

- If you're on Vue `1.x`, use vue-select `1.x`. 
- The `1.x` branch has not received updates since the 2.0 release.  
