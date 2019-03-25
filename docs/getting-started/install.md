### Vue Compatibility
-  `vue 1.x` use `vue-select 1.x`

## Yarn / NPM
Install with yarn:
```bash
yarn add vue-select
```
or, using NPM:
```
npm install vue-select
```

Then, import and register the component:

```js
import Vue from 'vue'
import vSelect from 'vue-select'

// register component
Vue.component('v-select', vSelect)
```

The component itself does not include any CSS. You'll need to include it separately:

```js
import 'vue-select/dist/vue-select.css';
```

You can also import the scss yourself for complete control of the component styles:

```scss
@import "vue-select/src/scss/vue-select.scss";
```

## In the Browser / CDN

Include `vue` & `vue-select.js` - I recommend using [unpkg.com](https://unpkg.com/#/).

```html
<!-- include VueJS first -->
<script src="https://unpkg.com/vue@latest"></script>

<!-- use the latest release -->
<script src="https://unpkg.com/vue-select@latest"></script>
<link rel="stylesheet" href="https://unpkg.com/vue-select@latest/dist/vue-select.css">
<!-- or point to a specific release -->
<script src="https://unpkg.com/vue-select@2.6.0"></script>
<link rel="stylesheet" href="https://unpkg.com/vue-select@2.6.0/dist/vue-select.css">
```
Then register the component in your javascript:

```js
Vue.component('v-select', VueSelect.VueSelect);
```

<CodePen url="dJjzeP" />
