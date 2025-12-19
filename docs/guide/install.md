## Yarn / NPM

Install with yarn or npm:

```bash
# vue 3
yarn add vue-select

# or, using NPM
npm install vue-select
```

Then, import and register the component:

```js
import { createApp } from 'vue'
import vSelect from 'vue-select'

const app = createApp({})
app.component('v-select', vSelect)
```

The component itself does not include any CSS. You'll need to include it separately:

```js
import 'vue-select/dist/vue-select.css';
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
```
Then register the component in your javascript:

```js
const app = Vue.createApp({});
app.component('v-select', VueSelect.VueSelect);
```

<CodePen url="dJjzeP" />

## Vue Compatibility

- Vue `2.x`, use vue-select `3.x`. 
- Vue `3.x`, use vue-select `4.x`.  
