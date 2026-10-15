---
title: Upgrading from v3
section: Getting Started
description: Move an app from Vue Select 3 to Vue Select 4. Every breaking change, with a before and after for each, plus a step-by-step checklist.
---

Vue Select 4 is a rewrite for Vue 3. The `VueSelect` component is now built on a set of
[headless primitives](/guide/headless), and the prop list is smaller. Most templates still work
unchanged: the component renders the same `vs__*` classes, has the same slots and events, and uses
the same CSS custom properties.

This page lists every breaking change between 3.20 and 4.0, with a before and after for each one.
Start with the [checklist](#upgrade-checklist), then use the
[summary table](#breaking-changes-at-a-glance) to find the sections that apply to your app.

::callout{type="note" title="Still on Vue 2?"}
Vue Select 4 only supports Vue 3.5 and newer. Vue Select 3 keeps working on Vue 2, and its
documentation is archived at [/v3](/v3/).
::

## Upgrade checklist

1. **Upgrade Vue to 3.5 or newer.** If you're moving from Vue 2 at the same time, follow the
   [Vue 3 migration guide](https://v3-migration.vuejs.org/) first.
2. **Install Vue Select 4** and remove `@types/vue-select` if you have it. The types now ship with
   the package.

   ```bash
   npm install vue-select@4
   npm uninstall @types/vue-select
   ```

   Until 4.0.0 is published as `latest`, install the pre-release with `vue-select@beta`.

3. **Update imports, registration and the stylesheet.** See
   [Platform and packaging](#platform-and-packaging).
4. **Replace `:value` and `@input`** with `v-model`, or with `:model-value` and
   `@update:model-value`. See [v-model](#v-model).
5. **Search your templates for removed props** and replace each one, as described in
   [Removed and changed props](#removed-and-changed-props). This command finds most of them:

   ```bash
   grep -rniE "(on-?tab|select-?on-?tab|select-?on-?key-?codes|search-?input-?query-?selector|no-?drop|dropdown-?should-?open|push-?tags|filter-?by|:components|input-?id|append-?to-?body|map-?keydown|clear-?search-?on-?blur|calculate-?position|:uid)" src/
   ```

6. **Review the [behavior changes](#behavior-changes)**, especially opening on focus, the keyboard
   and the empty value of a single select. Each one lists how to restore the v3 behavior if you
   need it.
7. **Move SCSS overrides to CSS custom properties** and check custom CSS against the new toggle
   button and icons. See [CSS](#css-from-scss-to-custom-properties).
8. **Check template refs and tests.** Template refs expose a [smaller API](#template-refs), and
   the ARIA attributes moved, so tests that query `role` or `aria-selected` may need new selectors.

## Breaking changes at a glance

| Area | v3 | v4 |
| --- | --- | --- |
| Vue | Vue 2 | Vue 3.5+ |
| Component | Options API `Select.vue` | `VueSelect`, built on the headless primitives (default and named export) |
| Mixins | `import { mixins } from 'vue-select'` | Removed: use the [headless primitives](/guide/headless) or `useComboBox` |
| SCSS | `vue-select/src/scss/vue-select.scss` | Removed: CSS custom properties |
| Build files | `dist/vue-select.js` | `dist/vue-select.umd.js`, `dist/vue-select.es.js` |
| Deep imports | `vue-select/src/...` | Blocked by the `exports` map |
| Types | `@types/vue-select` | Included |
| Value prop | `value` | `modelValue` |
| Change event | `input` | `update:modelValue` |
| Select on Tab | `selectOnTab`, `onTab` | `mapKeydown` |
| Select on other keys | `selectOnKeyCodes` | `mapKeydown` |
| Key handler map | keyed by `keyCode` (`13`), receives the instance | keyed by `key` (`'Enter'`), receives the context |
| Disable the dropdown | `noDrop` | `:open="false"` |
| Conditional opening | `dropdownShouldOpen` | `v-model:open` |
| Keep created tags | `pushTags` | `@option:created` |
| Match one option | `filterBy` | `filter` |
| Custom icons | `components` | `open-indicator`, `deselect` and `clear` slots |
| Input attributes | `inputId`, `tabindex`, `autocomplete` | `inputAttrs` |
| Custom search input | `searchInputQuerySelector` | Not needed |
| Element ids | `uid` | Generated with `useId()` |
| Teleport | `appendToBody` | `appendTo="body"` |
| Clear on blur | `clearSearchOnBlur` function | boolean |
| `calculatePosition` | receives the instance | receives the context |
| Opening | on focus and click | on typing, Down Arrow and the toggle button (`openOnFocus` restores v3) |
| Keyboard | v3 keys | WAI-ARIA APG combobox keys |
| Empty single value after deselect | `[]` | `null` |
| Backspace | no deselect events | emits `option:deselecting` / `option:deselected` |
| `role="combobox"` | on `.vs__dropdown-toggle` | on the search input |
| `aria-selected` | on the highlighted option | on selected options |
| `searchable: false` | read-only `<input>` | focusable `<div role="combobox">` |
| Open indicator | bare icon | inside a toggle `<button>` |
| Icons | custom SVGs | Heroicons, sized with CSS variables |
| Highlight color | `#5897fb` | `#136cfb` |
| Clear button | single select only | single and multiple |
| Escape | blurs on an empty search | keeps focus |
| `vs--searching` | hidden by `noDrop` | set whenever there is search text |
| Template refs | the whole component instance | `open`, `search`, `select`, `deselect`, `clearSelection`, `toggleDropdown`, `focus`, `blur` |

## Platform and packaging

### Vue 3.5 or newer

Vue Select 4 requires Vue 3.5 or newer (`peerDependencies: { "vue": "^3.5.0" }`). It uses
Vue's `useId()` to generate element ids that match between server rendering and hydration.

Registration follows Vue 3:

```js
// v3 (Vue 2)
import Vue from 'vue'
import vSelect from 'vue-select'

Vue.component('v-select', vSelect)
```

```js
// v4 (Vue 3)
import { createApp } from 'vue'
import VueSelect from 'vue-select'
import App from './App.vue'

createApp(App).component('VueSelect', VueSelect).mount('#app')
```

Or import it where you use it:

```vue
<script setup>
import VueSelect from 'vue-select'
</script>

<template>
  <VueSelect :options="['Canada', 'United States']" />
</template>
```

If you keep the `v-select` tag name, register it under that name:
`app.component('v-select', VueSelect)`.

### Imports and build files

The default export is the new `VueSelect` component, and it's also available as a named export.
The Options API component from v3 is gone.

```js
// v3
import vSelect from 'vue-select'
import { VueSelect, mixins } from 'vue-select'
import 'vue-select/dist/vue-select.css'
```

```js
// v4
import VueSelect from 'vue-select'
import { VueSelect } from 'vue-select' // same component
import 'vue-select/style.css' // 'vue-select/dist/vue-select.css' also works
```

**`mixins` is removed.** The v3 mixins (`ajax`, `pointerScroll`, `typeAheadPointer`) only worked
with the v3 component internals. To build your own select, use the
[headless primitives](/guide/headless) or the [`useComboBox`](/guide/headless#usecombobox)
composable.

```js
// v3
import { mixins } from 'vue-select'

export default {
  mixins: [mixins.typeAheadPointer],
}
```

```js
// v4
import { useComboBox } from 'vue-select'

const { typeAheadPointer, typeAheadUp, typeAheadDown, typeAheadSelect } = useComboBox(props, emit)
```

**Build files are renamed.** `dist/vue-select.js` is now `dist/vue-select.umd.js` (UMD) and
`dist/vue-select.es.js` (ES module). The `exports` map in `package.json` only exposes the package
root and the stylesheet, so deep imports such as `vue-select/src/components/Select.vue` or
`vue-select/dist/vue-select.js` no longer resolve. Import from `vue-select` and let your bundler
pick the right file.

```js
// v3
import vSelect from 'vue-select/dist/vue-select.js'
import vSelect from 'vue-select/src/components/Select.vue'
```

```js
// v4
import VueSelect from 'vue-select'
```

From a CDN, the UMD build exposes the same `VueSelect` global as v3:

```html
<!-- v3 -->
<script src="https://unpkg.com/vue-select@3"></script>
<script>Vue.component('v-select', VueSelect.VueSelect)</script>

<!-- v4 -->
<script src="https://unpkg.com/vue-select@4/dist/vue-select.umd.js"></script>
<link rel="stylesheet" href="https://unpkg.com/vue-select@4/dist/vue-select.css" />
<script>
  Vue.createApp({}).component('VueSelect', VueSelect.VueSelect).mount('#app')
</script>
```

### TypeScript types are included

The package ships its own declarations (`dist/types`). Remove the community `@types/vue-select`
package, which describes v3 and conflicts with them.

```bash
# v3
npm install --save-dev @types/vue-select

# v4
npm uninstall @types/vue-select
```

```ts
// v4
import type { VueSelectProps, OptionValue, ComboBoxContext } from 'vue-select'
```

### ES2020 build

v3 was compiled to ES5 with Babel. v4 targets ES2020, which every browser that runs Vue 3
supports, so most apps need no change. If you still transpile for older browsers, make sure your
build includes `node_modules/vue-select`:

```js
// v3: nothing to do, the build was already ES5
```

```js
// v4, Vite: @vitejs/plugin-legacy also transforms dependencies
import legacy from '@vitejs/plugin-legacy'

export default {
  plugins: [vue(), legacy({ targets: ['defaults'] })],
}
```

### SCSS is removed

The SCSS sources (`src/scss`) are gone. Theme Vue Select with CSS custom properties, available
since 3.18. See [CSS: from SCSS to custom properties](#css-from-scss-to-custom-properties).

## v-model

Vue 3 changed how `v-model` works on components: the bound prop is `modelValue` and the event is
`update:modelValue`. Vue Select follows that.

**If you only use `v-model`, nothing changes:**

```vue
<!-- v3 -->
<v-select v-model="country" :options="countries" />

<!-- v4 -->
<VueSelect v-model="country" :options="countries" />
```

**If you bind the value and listen for changes yourself** (for example to commit to a store),
rename both:

```vue
<!-- v3 -->
<v-select
  :value="$store.state.country"
  :options="countries"
  @input="(value) => $store.commit('setCountry', value)"
/>

<!-- v4 -->
<VueSelect
  :model-value="store.country"
  :options="countries"
  @update:model-value="(value) => store.setCountry(value)"
/>
```

In a render function or `h()` call, the props are `modelValue` and `'onUpdate:modelValue'`:

```js
// v3
h(vSelect, { props: { value: country }, on: { input: (v) => (country = v) } })

// v4
h(VueSelect, { modelValue: country.value, 'onUpdate:modelValue': (v) => (country.value = v) })
```

Some things stay the same:

- With `multiple`, the value is an array.
- With [`reduce`](/api/props#reduce), the value holds the reduced values, not the options.
- If you bind no value at all, Vue Select tracks the selection itself.

One thing changed: **deselecting the value of a single select emits `null`**. v3 emitted `[]` when
an option was deselected (with `deselectFromDropdown`), and `null` when it was cleared. v4 always
uses `null` in single mode and `[]` in multiple mode.

```js
// v3
const isEmpty = (value) => value === null || (Array.isArray(value) && value.length === 0)

// v4, single select
const isEmpty = (value) => value === null
```

v4 also lets you bind the dropdown state with `v-model:open`. See [`open`](/api/props#open).

## Removed and changed props

### `onTab`, `selectOnTab` and `selectOnKeyCodes`

These are replaced by [`mapKeydown`](/api/props#mapkeydown), which already covered them in v3.

Select the highlighted option with Tab, and let focus move on as v3 did:

```vue
<!-- v3 -->
<v-select :options="options" select-on-tab />

<!-- v4 -->
<VueSelect
  :options="options"
  :map-keydown="(map, ctx) => ({
    ...map,
    Tab: () => ctx.open.value && ctx.typeAheadSelect(),
  })"
/>
```

::callout{type="warning" title="Don't map Tab to Enter"}
`map.Enter` calls `preventDefault()`, so `Tab: map.Enter` keeps keyboard focus in the field even
when the dropdown is closed. Call `ctx.typeAheadSelect()` instead, as above.
::

Select with a comma as well as Enter, for example to create tags:

```vue
<!-- v3: 188 is the comma, 13 is Enter -->
<v-select taggable multiple :select-on-key-codes="[188, 13]" />

<!-- v4 -->
<VueSelect taggable multiple :map-keydown="(map) => ({ ...map, ',': map.Enter })" />
```

Try it: type a word and press comma, or highlight an option and press Tab.

::upgrade-map-keydown
::

### `mapKeydown`

The handler map is keyed by
[`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) names
instead of the deprecated `keyCode` numbers, and the second argument is the
[combobox context](/guide/headless#usecombobox) instead of the component instance.

```js
// v3
const mapKeydown = (map, vm) => ({
  ...map,
  13: (e) => {
    e.preventDefault()
    if (vm.search.length > 0) vm.typeAheadSelect()
  },
  27: () => vm.$emit('cancel'),
})
```

```js
// v4
const mapKeydown = (map, ctx) => ({
  ...map,
  Enter: (e) => {
    e.preventDefault()
    if (ctx.search.value.length > 0) ctx.typeAheadSelect()
  },
  Escape: () => emit('cancel'),
})
```

| v3 key code | v4 key |
| --- | --- |
| `8` | `'Backspace'` |
| `9` | `'Tab'` |
| `13` | `'Enter'` |
| `27` | `'Escape'` |
| `32` | `' '` |
| `38` | `'ArrowUp'` |
| `40` | `'ArrowDown'` |
| `188` | `','` |

The context's state is made of refs, so read `ctx.open.value`, `ctx.search.value` and so on. The
default handlers are listed under [`mapKeydown`](/api/props#mapkeydown), and the context
under [`useComboBox`](/guide/headless#usecombobox).

### `noDrop`

Use `:open="false"`. Binding `open` puts you in control of the dropdown, and `false` keeps it
closed.

```vue
<!-- v3 -->
<v-select taggable multiple no-drop />

<!-- v4 -->
<VueSelect taggable multiple :open="false" />
```

### `dropdownShouldOpen`

Use `v-model:open`, or bind `open` and decide in your `@update:open` handler. When the decision
depends on the search text, track it with the `search` event.

```vue
<!-- v3 -->
<v-select
  :options="countries"
  :dropdown-should-open="({ open, search }) => open && search.length >= 2"
/>
```

```vue
<!-- v4 -->
<script setup>
import { computed, ref } from 'vue'
import VueSelect from 'vue-select'
import { countries } from './countries'

const wantsOpen = ref(false)
const search = ref('')
const open = computed(() => wantsOpen.value && search.value.length >= 2)
</script>

<template>
  <VueSelect
    :options="countries"
    :open="open"
    placeholder="Type two letters"
    @update:open="(value) => (wantsOpen = value)"
    @search="(text) => (search = text)"
  />
</template>
```

::upgrade-conditional-open
::

While `open` is bound, Vue Select never opens or closes on its own: it emits `update:open` with
the state it wants, and `open` / `close` follow your prop. See
[Dropdown Opening](/guide/opening).

### `pushTags`

Add created tags to your own options in the `option:created` event. `pushTags` kept a hidden copy
of the options inside the component, which drifted from yours.

```vue
<!-- v3 -->
<v-select v-model="tags" :options="options" taggable multiple push-tags />

<!-- v4 -->
<VueSelect
  v-model="tags"
  :options="options"
  taggable
  multiple
  @option:created="(tag) => options.push(tag)"
/>
```

### `filterBy` and `filter`

`filterBy` is removed: `filter` does the same job. `filter` receives `(options, search)`. v3 also
passed the component instance as a third argument; v4 has no instance to pass.

```vue
<!-- v3 -->
<v-select
  :options="books"
  label="title"
  :filter-by="(option, label, search) => (option.title + option.author).toLowerCase().includes(search.toLowerCase())"
/>

<!-- v4 -->
<VueSelect
  :options="books"
  label="title"
  :filter="(options, search) => options.filter(
    (book) => (book.title + book.author).toLowerCase().includes(search.toLowerCase())
  )"
/>
```

`filter` only runs while there is search text, as in v3.

### `components`

Pass your own icons through slots instead. In v3, `components.Deselect` was used for both the tag
deselect buttons and the clear button; in v4 they have separate slots.

```vue
<!-- v3 -->
<script>
const Deselect = { render: (h) => h('span', '❌') }
const OpenIndicator = { render: (h) => h('span', '🔽') }

export default {
  data: () => ({ components: { Deselect, OpenIndicator } }),
}
</script>

<template>
  <v-select :components="components" multiple />
</template>
```

```vue
<!-- v4 -->
<VueSelect multiple>
  <template #open-indicator="{ attributes }">
    <span v-bind="attributes">🔽</span>
  </template>
  <template #deselect>❌</template>
  <template #clear>❌</template>
</VueSelect>
```

See [Slots](/api/slots).

### `inputId`, `tabindex` and `autocomplete`

Attributes for the search input go in one [`inputAttrs`](/api/props#inputattrs) object.

```vue
<!-- v3 -->
<label for="country">Country</label>
<v-select input-id="country" :tabindex="3" :options="countries" />

<!-- v4 -->
<label for="country">Country</label>
<VueSelect :input-attrs="{ id: 'country', tabindex: 3 }" :options="countries" />
```

`autocomplete` has no replacement: v4 always renders `autocomplete="off"`, because browser
autofill suggestions cover the dropdown. If you really need another value, render your own input
with the [`search` slot](/api/slots), where your attributes win:

```vue
<VueSelect :options="countries">
  <template #search="{ attributes, events }">
    <input class="vs__search" v-bind="attributes" autocomplete="country-name" v-on="events" />
  </template>
</VueSelect>
```

### `searchInputQuerySelector`

v3 searched the `search` slot's DOM for the input with this selector. In v4 the `attributes` from
the `search` slot carry a template ref, so binding them is enough.

```vue
<!-- v3 -->
<v-select search-input-query-selector="input.my-search">
  <template #search="{ attributes, events }">
    <input class="vs__search my-search" v-bind="attributes" v-on="events" />
  </template>
</v-select>

<!-- v4 -->
<VueSelect>
  <template #search="{ attributes, events }">
    <input class="vs__search" v-bind="attributes" v-on="events" />
  </template>
</VueSelect>
```

### `uid`

Ids are generated with Vue's `useId()`, which is unique within the app and stable across server
rendering and hydration. To target the input, give it your own id.

```vue
<!-- v3 -->
<v-select uid="country" />
<!-- then: document.querySelector('#vscountry__combobox') -->

<!-- v4 -->
<VueSelect :input-attrs="{ id: 'country' }" />
<!-- then: document.querySelector('#country') -->
```

### `appendToBody` and `calculatePosition`

`appendToBody` becomes [`appendTo`](/api/props#appendto), which takes any selector or element and
uses Vue's `<Teleport>`.

```vue
<!-- v3 -->
<v-select append-to-body :calculate-position="withPopper" />

<!-- v4 -->
<VueSelect append-to="body" :calculate-position="withPopper" />
```

[`calculatePosition`](/api/props#calculateposition) still receives the menu element and
`{ width, top, left }`, and can still return a cleanup function. Its second argument is the
combobox context instead of the component instance.

```js
// v3
function withPopper(dropdownList, component, { width }) {
  dropdownList.style.width = width
  const popper = createPopper(component.$refs.toggle, dropdownList, { placement: 'bottom' })
  return () => popper.destroy()
}
```

```js
// v4: find the toggle from the input, which the context exposes
function withPopper(dropdownList, ctx, { width }) {
  dropdownList.style.width = width
  const toggle = ctx.inputEl.value.closest('.vs__dropdown-toggle')
  const popper = createPopper(toggle, dropdownList, { placement: 'bottom' })
  return () => popper.destroy()
}
```

### `clearSearchOnBlur`

The prop is a boolean. v3 took a function that received `{ clearSearchOnSelect, multiple }`, two
props you already have. The default is unchanged: clear on blur for a single select when
`clearSearchOnSelect` is on.

```vue
<!-- v3 -->
<v-select :clear-search-on-blur="() => false" />

<!-- v4 -->
<VueSelect :clear-search-on-blur="false" />
```

## Behavior changes

### Focus and clicks don't open the dropdown

v3 opened the dropdown whenever the input got focus, including when tabbing through a form. v4
follows the [WAI-ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/): typing,
<kbd>↓</kbd>, <kbd>Alt</kbd>+<kbd>↓</kbd> and the toggle button open it, and focusing or clicking
the input only focuses it. Opening on focus moves content while screen readers are still announcing
the field. With `:searchable="false"`, a click still toggles the dropdown.

To keep the v3 behavior, set [`openOnFocus`](/api/props#openonfocus):

```vue
<!-- v3: opens on focus by default -->
<v-select :options="options" />

<!-- v4 -->
<VueSelect :options="options" open-on-focus />
```

Default (click the arrow or press <kbd>↓</kbd>):

::vue-select{:options='["Canada","Mexico","United States"]'}
::

With `open-on-focus`:

::vue-select{:options='["Canada","Mexico","United States"]' open-on-focus}
::

### The keyboard follows the WAI-ARIA examples

The keys now match the APG
[editable combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/)
and [select-only combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/)
examples.

| Key | v3 | v4 |
| --- | --- | --- |
| <kbd>Escape</kbd> | clears the search first, then closes | closes first, then clears the search |
| <kbd>↓</kbd> / <kbd>↑</kbd> on a closed dropdown | open it | open it and highlight the selected option, or the first / last option when nothing is selected |
| <kbd>↓</kbd> / <kbd>↑</kbd> at the end of the list | stop | wrap around |
| <kbd>Enter</kbd> with nothing highlighted | nothing | closes the dropdown |
| <kbd>Enter</kbd> on a closed dropdown | selects the last highlighted option | nothing |

With `:searchable="false"` (select-only), arrows don't wrap; <kbd>Home</kbd>, <kbd>End</kbd>,
<kbd>PageUp</kbd> and <kbd>PageDown</kbd> move the highlight; <kbd>Tab</kbd> and
<kbd>Alt</kbd>+<kbd>↑</kbd> select the highlighted option; and typing letters highlights a matching
option, with a repeated letter cycling through the matches.

To restore a v3 key, override it with `mapKeydown`. For example, Escape clearing the search
before closing:

```vue
<!-- v3: the default -->
<v-select :options="options" />

<!-- v4 -->
<VueSelect
  :options="options"
  :map-keydown="(map, ctx) => ({
    ...map,
    Escape: (e) => (ctx.search.value ? ctx.setSearch('') : map.Escape(e)),
  })"
/>
```

### Escape keeps focus in the field

v3 blurred the input when Escape was pressed on an empty search, so keyboard focus dropped to the
page. v4 keeps focus on the input. If a test asserted the blur, update it:

```js
// v3
await input.trigger('keydown', { key: 'Escape' })
expect(document.activeElement).not.toBe(input.element)

// v4
await input.trigger('keydown', { key: 'Escape' })
expect(document.activeElement).toBe(input.element)
```

### Backspace emits deselect events

Removing the last value with <kbd>Backspace</kbd> now emits `option:deselecting` and
`option:deselected`, like every other way of deselecting
([#1430](https://github.com/sagalbot/vue-select/issues/1430)). If you watched the value to catch
Backspace removals, the event is enough now:

```vue
<!-- v3: Backspace didn't emit option:deselected -->
<v-select v-model="tags" multiple @option:deselected="onRemove" />
<!-- plus a watcher on `tags` to catch Backspace -->

<!-- v4 -->
<VueSelect v-model="tags" multiple @option:deselected="onRemove" />
```

### The clear button shows in multiple mode

v3 only showed the clear button for a single select. v4 shows it whenever `clearable` is on and
something is selected. Hide it with `:clearable="false"`:

```vue
<!-- v3: no clear button with multiple -->
<v-select multiple :options="options" />

<!-- v4: same look -->
<VueSelect multiple :options="options" :clearable="false" />
```

`:clearable="false"` also stops <kbd>Backspace</kbd> from removing values, as in v3.

### `role="combobox"` is on the input

v4 follows ARIA 1.2: the search input has `role="combobox"`, `aria-expanded` and `aria-controls`.
v3 put the role on `.vs__dropdown-toggle`, with `aria-owns`. Update selectors and tests that look
for the role:

```js
// v3
wrapper.find('.vs__dropdown-toggle[role="combobox"]')

// v4
wrapper.find('input.vs__search[role="combobox"]')
```

### `aria-selected` marks selected options

Options now have `aria-selected="true"` when they are selected and `"false"` otherwise. v3 set it
on the highlighted option. To find the highlighted option, use its class or the input's
`aria-activedescendant`:

```js
// v3
wrapper.find('[aria-selected="true"]') // the highlighted option

// v4
wrapper.find('.vs__dropdown-option--highlight') // the highlighted option
wrapper.findAll('[aria-selected="true"]') // the selected options
```

### `searchable: false` renders a select-only combobox

v3 rendered a read-only `<input>`. v4 renders a focusable `<div role="combobox" tabindex="0">`
with the `vs__search` class, following the ARIA select-only combobox pattern. The placeholder is
its text content. Styles for `.vs--unsearchable .vs__search` keep working, but code that treats
it as an `<input>` doesn't, and the `search` slot is not used in this mode.

```css
/* v3 */
.v-select input.vs__search[readonly] { cursor: pointer; }

/* v4 */
.vs--unsearchable .vs__search { cursor: pointer; }
```

### The open indicator is inside a toggle button

The open indicator is wrapped in `button.vs__open-indicator-button`, with `tabindex="-1"`,
`aria-expanded`, `aria-controls` and an `aria-label` from
[`ariaLabels.toggle`](/api/props#arialabels). The icon itself is `aria-hidden`. Touch and screen
reader users can open the list with it.

Content you pass to the `open-indicator` slot renders inside that button, so don't put another
button in it:

```vue
<!-- v3 -->
<template #open-indicator="{ attributes }">
  <button type="button" v-bind="attributes">▾</button>
</template>

<!-- v4 -->
<template #open-indicator="{ attributes }">
  <span v-bind="attributes">▾</span>
</template>
```

### New icons

The toggle, clear and tag deselect icons are now Heroicons (20px chevron-down and x-mark, 16px
x-mark on tags), sized with CSS. `--vs-controls-size` scales them through their width and height
instead of a `transform: scale()`, and two new variables set the sizes directly. CSS that targeted
the old SVG dimensions or the `scale()` transform may need adjusting:

```css
/* v3 */
.v-select .vs__open-indicator { transform: scale(1.5); }
.v-select .vs__deselect svg { width: 8px; height: 8px; }

/* v4 */
.v-select {
  --vs-controls-icon-size: 1.875rem; /* toggle and clear */
  --vs-deselect-icon-size: 0.75rem; /* tag deselect */
}
```

To use your own icons, see [`components`](#components) above.

### Darker highlight color

The default `--vs-dropdown-option--active-bg` is `#136cfb`, which has a 4.6:1 contrast ratio with
the white text (WCAG AA). v3 used `#5897fb` (2.9:1). To restore it:

```css
.v-select {
  --vs-dropdown-option--active-bg: #5897fb;
}
```

### `vs--searching` is set whenever there is search text

v3 suppressed the `vs--searching` class when `noDrop` was set. v4 sets it whenever there is search
text, even with `:open="false"`. Combine it with `vs--open` if your CSS should only apply while
the dropdown shows:

```css
/* v3 */
.vs--searching .vs__selected { display: none; }

/* v4 */
.vs--searching.vs--open .vs__selected { display: none; }
```

### Element ids come from `useId()`

Ids are unique within one Vue app. If a page mounts several Vue apps that each render Vue Select,
give each app its own prefix so the ids don't collide:

```js
// v3: ids came from a global counter, nothing to do

// v4
const app = createApp(App)
app.config.idPrefix = 'checkout'
app.mount('#checkout')
```

## Template refs

v3 template refs gave you the whole component instance, including internals such as `$refs.search`
or `mutableLoading`. v4 exposes a small, stable API:

| Member | Description |
| --- | --- |
| `open` | Whether the dropdown is open. Assign to open or close it. |
| `search` | The search text. Assign to change it. |
| `select(option)` | Select an option. |
| `deselect(option)` | Deselect an option. |
| `clearSelection()` | Clear the value and emit `clear`. |
| `toggleDropdown()` | Open or close the dropdown. |
| `focus()` | Focus the search input. |
| `blur()` | Blur the search input. |

```vue
<!-- v3 -->
<script>
export default {
  methods: {
    reset() {
      this.$refs.select.clearSelection()
      this.$refs.select.$refs.search.focus()
      this.$refs.select.mutableLoading = false
    },
  },
}
</script>

<template>
  <v-select ref="select" :options="options" :loading="loading" />
</template>
```

```vue
<!-- v4 -->
<script setup>
import { ref } from 'vue'

const select = ref()
const loading = ref(false)

function reset() {
  select.value.clearSelection()
  select.value.focus()
  loading.value = false
}
</script>

<template>
  <VueSelect ref="select" :options="options" :loading="loading" />
</template>
```

For anything else, use props, events and slots. The `search` event still passes a `toggleLoading`
function as its second argument.

## CSS: from SCSS to custom properties

Vue Select 4 ships plain CSS. The SCSS files and their `!default` variables are gone; every value
you could set in SCSS has a CSS custom property, available since 3.18. Set them on `.v-select` to
theme every select, or on a class of your own to theme one.

```css
// v3: SCSS variables, set before importing the SCSS source
$vs-border-color: #d1d5db;
$vs-state-active-bg: #0f766e;
$vs-dropdown-max-height: 240px;

@import 'vue-select/src/scss/vue-select.scss';
```

```css
/* v4: import the CSS once, e.g. in main.js: import 'vue-select/style.css' */
.v-select {
  --vs-border-color: #d1d5db;
  --vs-dropdown-option--active-bg: #0f766e;
  --vs-dropdown-max-height: 240px;
}
```

| v3 SCSS variable | v4 CSS custom property |
| --- | --- |
| `$vs-colors` (`lightest`, `light`, `dark`, `darkest`) | `--vs-colors--lightest`, `--vs-colors--light`, `--vs-colors--dark`, `--vs-colors--darkest` |
| `$vs-component-bg` | `--vs-search-input-bg` |
| `$vs-component-line-height` | `--vs-line-height` |
| `$vs-component-placeholder-color` | `--vs-search-input-placeholder-color` |
| `$vs-state-active-bg` | `--vs-dropdown-option--active-bg` |
| `$vs-state-active-color` | `--vs-dropdown-option--active-color` |
| `$vs-state-deselect-bg` | `--vs-dropdown-option--deselect-bg` |
| `$vs-state-deselect-color` | `--vs-dropdown-option--deselect-color` |
| `$vs-state-disabled-bg` | `--vs-state-disabled-bg` |
| `$vs-state-disabled-color` | `--vs-state-disabled-color` |
| `$vs-state-disabled-controls-color` | `--vs-state-disabled-controls-color` |
| `$vs-state-disabled-cursor` | `--vs-state-disabled-cursor` |
| `$vs-border-width`, `$vs-border-style`, `$vs-border-radius`, `$vs-border-color` | `--vs-border-width`, `--vs-border-style`, `--vs-border-radius`, `--vs-border-color` |
| `$vs-controls-color` | `--vs-controls-color` |
| `$vs-controls-size` | `--vs-controls-size` (or `--vs-controls-icon-size`) |
| `$vs-controls-deselect-text-shadow` | `--vs-controls--deselect-text-shadow` |
| `$vs-selected-bg` | `--vs-selected-bg` |
| `$vs-selected-border-color`, `-style`, `-width` | `--vs-selected-border-color`, `-style`, `-width` |
| `$vs-dropdown-z-index` | `--vs-dropdown-z-index` |
| `$vs-dropdown-min-width` | `--vs-dropdown-min-width` |
| `$vs-dropdown-max-height` | `--vs-dropdown-max-height` |
| `$vs-dropdown-box-shadow` | `--vs-dropdown-box-shadow` |
| `$vs-dropdown-bg` | `--vs-dropdown-bg` |

The custom properties also cover things SCSS never did, such as `--vs-font-size`,
`--vs-search-input-color`, `--vs-selected-color`, `--vs-dropdown-color`,
`--vs-dropdown-option-padding` and `--vs-actions-padding`. They're declared on `:root` and `:host`,
so they also work inside a shadow root. The full list is in [CSS & Selectors](/guide/css).

The class names haven't changed (`vs__dropdown-toggle`, `vs__selected`, `vs__dropdown-option--highlight`,
`vs--open` and so on), so overrides that target them keep working. The new elements are
`button.vs__open-indicator-button` around the open indicator, `.vs__icon` on the built-in icons,
and `.vs__dropdown-group`, `.vs__dropdown-group-label` and `.vs__dropdown-group-options` for
[option groups](/api/props#groupby).

## New in v4

These aren't breaking, but they may replace workarounds you wrote for v3:

- [`groupBy`](/api/props#groupby): option groups with real group headers, instead of disabled
  "heading" options.
- [`hideSelected`](/api/props#hideselected): remove selected options from the dropdown in multiple
  mode.
- [`v-model:open`](/api/props#open) and [`openOnFocus`](/api/props#openonfocus): control when the
  dropdown opens.
- [`ariaLabels`](/api/props#arialabels): translate the accessible names of the controls.
- [`inputAttrs`](/api/props#inputattrs) and [`appendTo`](/api/props#appendto).
- The `clear` event, the `clear`, `deselect` and `group-header` slots, and the
  `search:keydown`, `search:input` and `search:compositionstart` / `search:compositionend` events.
  See [Events](/api/events) and [Slots](/api/slots).
- `createOption` can throw to reject the text, for example to validate email addresses.
- TypeScript types for the props, events and context, exported from the package.

## Headless primitives

`VueSelect` is now built from unstyled components you can use directly: `ComboBox`,
`ComboBoxInput`, `ComboBoxButton`, `ComboBoxClear`, `ComboBoxMenu`, `ComboBoxOption` and
`ComboBoxGroup`, plus the `useComboBox` composable. They handle state, filtering, keyboard
navigation and ARIA; you write the markup and the styles. If you used the v3 mixins, or fought the
v3 markup with slots and CSS, they're the replacement.

```vue
<script setup>
import { ref } from 'vue'
import { ComboBox, ComboBoxInput, ComboBoxMenu, ComboBoxOption } from 'vue-select'

const fruit = ref(null)
</script>

<template>
  <ComboBox v-slot="{ filteredOptions }" v-model="fruit" :options="['Apple', 'Banana', 'Cherry']">
    <ComboBoxInput aria-label="Fruit" />
    <ComboBoxMenu>
      <ComboBoxOption
        v-for="(option, index) in filteredOptions"
        :key="option"
        :value="option"
        :index="index"
      >
        {{ option }}
      </ComboBoxOption>
    </ComboBoxMenu>
  </ComboBox>
</template>
```

Read the [headless primitives guide](/guide/headless) for live examples.

## Coming from a 4.0 beta

If you used the headless primitives from an earlier `4.0.0-beta` build, a few names changed. No
stable release contained them.

- `ListBoxKey` is now `ComboBoxKey`, and `ListBoxProps` / `ResolvedListBoxProps` are replaced by
  `ComboBoxProps` / `ComboBoxContext`.
- `ComboBoxOption` requires an `index` prop: the option's position in `filteredOptions`.
- `StyledComboBox` is removed. Use `VueSelect`.

```vue
<!-- 4.0 beta -->
<StyledComboBox :options="options" />
<ComboBoxOption v-for="option in filteredOptions" :value="option" />

<!-- 4.0 -->
<VueSelect :options="options" />
<ComboBoxOption v-for="(option, index) in filteredOptions" :value="option" :index="index" />
```
