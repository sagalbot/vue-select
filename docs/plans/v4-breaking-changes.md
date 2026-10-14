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
| `onTab`, `selectOnTab` | `:map-keydown="map => ({ ...map, Tab: map.Enter })"` | done |
| `selectOnKeyCodes` | `:map-keydown="map => ({ ...map, ',': map.Enter })"` | done |
| `mapKeydown` keys are `KeyboardEvent.key` names instead of key codes; second argument is the combobox context instead of the component instance | Replace `13` with `'Enter'`, `9` with `'Tab'`, `188` with `','`, etc. | done |
| `searchInputQuerySelector` | Not needed: bind the attributes from the `search` slot to your input. | done |
| `noDrop` | `:open="false"` | done |
| `dropdownShouldOpen` | `v-model:open`, deciding in your `@update:open` handler. | done |
| `pushTags` | `@option:created="tag => options.push(tag)"` | done |
| `filter` receives `(options, search)`; v3 also passed the component instance | Use the arguments; there is no instance. | done |
| `filterBy` | `:filter="(options, search) => options.filter(o => match(o, search))"` | done |
| `components` | `open-indicator` and `deselect` slots. | done |
| `inputId`, `tabindex`, `autocomplete` | `:input-attrs="{ id, tabindex, autocomplete }"` | done |
| `uid` | Not needed: ids are generated with `useId()`. Use `inputAttrs.id` to target the input. | done |
| `appendToBody` | `append-to="body"` | done |
| `clearSearchOnBlur` takes a boolean instead of a function | Pass the boolean your function returned. | done |
| `calculatePosition` receives the combobox context instead of the component instance | Read state from the context argument. | done |

## Behavior

| Change | Migration | Status |
|--------|-----------|--------|
| Deselecting in single-select mode sets the value to `null`. v3 set it to `[]`. | Remove any `[]` checks for an empty single-select value. | done (T1) |
| Backspace deselection emits `option:deselecting` / `option:deselected` (#1430) | None; listeners now fire for every deselection. | done |
| `searchable: false` renders a focusable `div[role=combobox]` (ARIA select-only combobox) instead of a read-only `<input>` | Style `.vs--unsearchable .vs__search` as before; don't rely on it being an `<input>`. | done |
| The search input has `role="combobox"` (ARIA 1.2). v3 put it on `.vs__dropdown-toggle` with `aria-owns`. | Update selectors or tests that look for the role on the toggle. | done |
| Options' `aria-selected` reflects selection. v3 set it on the highlighted option. | Use `.vs__dropdown-option--highlight` / `aria-activedescendant` for the highlighted option. | done |
| Clear button also shows in multi-select | Set `:clearable="false"` to hide it. | done |
| Template refs expose only `open`, `search`, `select`, `deselect`, `clearSelection`, `toggleDropdown`, `focus`, `blur` | Use props, events and slots instead of other internals. | done |

## Headless primitives

Only affect code written against unreleased `@beta/dev` builds. No published version contains them.

- `ListBoxKey` renamed to `ComboBoxKey`; `ListBoxProps` / `ResolvedListBoxProps` replaced by `ComboBoxProps` / `ComboBoxContext`.
- `ComboBoxOption` requires an `index` prop.
- `StyledComboBox` removed in favor of `VueSelect`.
