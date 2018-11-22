## Vue Compatibility
-  `vue ~2.0` use `vue-select ~2.0`
-  `vue ~1.0` use `vue-select ~1.0`

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

Vue.component('v-select', vSelect)
```

## CDN

Include `vue` & `vue-select.js` - I recommend using [unpkg.com](https://unpkg.com/#/).

```html
<!-- include VueJS first -->
<script src="https://unpkg.com/vue@latest"></script>

<!-- use the latest release -->
<script src="https://unpkg.com/vue-select@latest"></script>
<!-- or point to a specific release -->
<script src="https://unpkg.com/vue-select@1.30"></script>
```
Then register the component in your javascript:

```js
Vue.component('v-select', VueSelect.VueSelect);
```

[](codepen://sagalbot/dJjzeP)
