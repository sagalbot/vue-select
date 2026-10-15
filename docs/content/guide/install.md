---
title: Installation
section: Getting Started
description: Install Vue Select, register the component, include the CSS, and use the bundled TypeScript types.
---

Vue Select 4 requires **Vue 3.5 or newer**. If you're still on Vue 2, use [Vue Select 3](/v3).
If you're upgrading an existing app from Vue Select 3, read the [upgrade guide](/guide/upgrade).

## Package Managers

```bash
# npm
npm install vue-select

# pnpm
pnpm add vue-select

# yarn
yarn add vue-select
```

::callout{type="note" title="Pre-release"}
Until 4.0.0 is published as `latest`, install the pre-release with `npm install vue-select@beta`.
::

## Usage

Import the component and the stylesheet, then use it like any other component. Vue Select is the
default export, and it's also available as a named export.

```vue
<script setup>
import { ref } from 'vue'
import VueSelect from 'vue-select'
import 'vue-select/style.css'

const country = ref(null)
</script>

<template>
  <VueSelect v-model="country" :options="['Canada', 'United States']" />
</template>
```

::vue-select{:options='["Canada","United States"]'}
::

### Global Registration

If you use Vue Select throughout your app, register it once when you create the app. The CSS only
needs to be imported once, anywhere in your app.

```js
import { createApp } from 'vue'
import VueSelect from 'vue-select'
import 'vue-select/style.css'
import App from './App.vue'

createApp(App).component('VueSelect', VueSelect).mount('#app')
```

### CSS

The component doesn't inject any styles, so you need to include the stylesheet yourself:

```js
import 'vue-select/style.css'
```

`vue-select/dist/vue-select.css` points at the same file and keeps working, so existing imports don't
need to change. There is no SCSS build: the styles are customized with
[CSS custom properties](/guide/css).

## TypeScript

Vue Select ships its own type definitions, so there's nothing extra to install. If you previously
installed `@types/vue-select`, remove it.

Props and events are typed when you use the component in a `.vue` file with
[Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) or `vue-tsc`. The
package also exports the types you'll need when writing callbacks:

```vue
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import VueSelect, { type OptionValue } from 'vue-select'

type Country = {
  code: string
  name: string
}

const countries: Country[] = [
  { code: 'CA', name: 'Canada' },
  { code: 'US', name: 'United States' },
]

const selected = ref<string | null>(null)

// Callbacks receive an OptionValue (string | number | object); narrow it to your type.
const reduce = (option: OptionValue) => (option as Country).code

// Template refs expose open, search, select, deselect, clearSelection,
// toggleDropdown, focus and blur.
const select = useTemplateRef<InstanceType<typeof VueSelect>>('select')
</script>

<template>
  <VueSelect
    ref="select"
    v-model="selected"
    label="name"
    :options="countries"
    :reduce="reduce"
  />
</template>
```

::callout{type="note" title="Use type aliases for option objects"}
Object options are typed as `Record<string, unknown>`. TypeScript lets a `type` alias match that
signature, but not an `interface`, so declare your option shapes with `type` (as above). With an
interface, `:options` reports that the index signature is missing.
::

The exported types are `VueSelectProps`, `OptionValue`, `OptionKey`, `ModelValue`, `AriaLabels`,
`CalculatePosition` and `KeydownHandlers`, plus `ComboBoxProps`, `ComboBoxContext` and `OptionGroup`
for the [headless components](/guide/headless).

## Nuxt and SSR

Vue Select renders on the server. Element ids come from Vue's `useId()`, so they match between the
server render and hydration. In Nuxt, add the stylesheet to your config and import the component
where you need it:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  css: ['vue-select/style.css'],
})
```

::callout{type="note" title="Several Vue apps on one page"}
Ids from `useId()` are unique within one app. If a page mounts more than one Vue app, give each
app its own prefix with `app.config.idPrefix` so the ids don't collide.
::

## In the Browser

Vue Select also ships a UMD build for use without a bundler. Load Vue first, then Vue Select and its
stylesheet. The component is available on the `VueSelect` global as `VueSelect.VueSelect` (or
`VueSelect.default`).

```html
<link rel="stylesheet" href="https://unpkg.com/vue-select@4/dist/vue-select.css" />

<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script src="https://unpkg.com/vue-select@4/dist/vue-select.umd.js"></script>

<div id="app">
  <vue-select v-model="country" :options="['Canada', 'United States']"></vue-select>
</div>

<script>
  const { createApp, ref } = Vue

  createApp({
    setup: () => ({ country: ref(null) }),
  })
    .component('VueSelect', VueSelect.VueSelect)
    .mount('#app')
</script>
```

Pin an exact version (for example `vue-select@4.0.0`) in production so a new release can't change
your page unexpectedly.

## Vue Compatibility

| Vue        | Vue Select | Docs                  |
|------------|------------|-----------------------|
| 2.x        | 3.x        | [/v3](/v3)            |
| 3.5 and up | 4.x        | You're reading them   |
