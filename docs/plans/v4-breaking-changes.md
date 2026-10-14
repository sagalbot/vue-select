# v4 Breaking Changes

Running list of every breaking change between v3.20.4 and v4.0. This is the source for the v4 upgrade guide (Plan 3, Phase C). Add an entry in the same commit as the change.

Status: **shipped** = on `@beta/dev` and in a published beta. **done** = implemented on a v4 branch, not released yet. **planned** = in `2026-10-14-styled-wrapper.md`, not implemented yet.

## Platform and packaging

| Change | Migration | Status |
|--------|-----------|--------|
| Vue 2 support dropped | Stay on 3.x for Vue 2. | shipped |
| Peer dependency `vue: ^3.5.0` | Upgrade Vue. Needed for SSR-safe ids (`useId()`). | done (T3) |
| SCSS sources removed | Use the CSS custom properties (available since 3.18). | shipped |
| `mixins` export removed | Use the headless primitives or `useComboBox`. | shipped |
| Build files renamed: `dist/vue-select.js` is now `dist/vue-select.umd.js` and `dist/vue-select.es.js` | Import from `vue-select`, not a `dist/` path. `vue-select/dist/vue-select.css` is unchanged. | shipped |
| `exports` map blocks deep imports (`vue-select/src/...`) | Import from the package root. | shipped |

## v-model

| Change | Migration | Status |
|--------|-----------|--------|
| `value` prop is now `modelValue` | `v-model` needs no change. Replace explicit `:value` with `:model-value`. | shipped |
| `input` event is now `update:modelValue` | Replace `@input` with `@update:model-value`. | shipped |

## Props

| Removed or changed | Migration | Status |
|--------------------|-----------|--------|
| `onTab`, `selectOnTab` | `:map-keydown="map => ({ ...map, Tab: map.Enter })"` | planned |
| `selectOnKeyCodes` | `:map-keydown="map => ({ ...map, ',': map.Enter })"` | planned |
| `mapKeydown` keys are `KeyboardEvent.key` names instead of key codes; second argument is the combobox context instead of the component instance | Replace `13` with `'Enter'`, `9` with `'Tab'`, `188` with `','`, etc. | planned |
| `searchInputQuerySelector` | Not needed: bind the attributes from the `search` slot to your input. | planned |
| `noDrop` | `:open="false"` | planned |
| `dropdownShouldOpen` | `v-model:open`, deciding in your `@update:open` handler. | planned |
| `pushTags` | `@option:created="tag => options.push(tag)"` | planned |
| `filterBy` | `:filter="(options, search) => options.filter(o => match(o, search))"` | planned |
| `components` | `open-indicator` and `deselect` slots. | planned |
| `inputId`, `tabindex`, `autocomplete` | `:input-attrs="{ id, tabindex, autocomplete }"` | planned |
| `uid` | Not needed: ids are generated with `useId()`. Use `inputAttrs.id` to target the input. | planned |
| `appendToBody` | `append-to="body"` | planned |
| `clearSearchOnBlur` takes a boolean instead of a function | Pass the boolean your function returned. | planned |
| `calculatePosition` receives the combobox context instead of the component instance | Read state from the context argument. | planned |

## Behavior

| Change | Migration | Status |
|--------|-----------|--------|
| Deselecting in single-select mode sets the value to `null`. v3 set it to `[]`. | Remove any `[]` checks for an empty single-select value. | done (T1) |
| Clear button also shows in multi-select | Set `:clearable="false"` to hide it. | planned |
| Template refs expose only `open`, `search`, `select`, `deselect`, `clearSelection`, `toggleDropdown`, `focus`, `blur` | Use props, events and slots instead of other internals. | planned |

## Headless primitives

Only affect code written against unreleased `@beta/dev` builds. No published version contains them.

- `ListBoxKey` renamed to `ComboBoxKey`; `ListBoxProps` / `ResolvedListBoxProps` replaced by `ComboBoxProps` / `ComboBoxContext`.
- `ComboBoxOption` requires an `index` prop.
- `StyledComboBox` removed in favor of `VueSelect`.
