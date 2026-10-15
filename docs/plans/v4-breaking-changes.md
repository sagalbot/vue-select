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
| The default export (and named `VueSelect` export) is the new component built on the headless primitives; the Options API `Select.vue` is gone | Most templates work unchanged; see the props, behavior and template-ref rows below. | done |
| Build files renamed: `dist/vue-select.js` is now `dist/vue-select.umd.js` and `dist/vue-select.es.js` | Import from `vue-select`, not a `dist/` path. `vue-select/dist/vue-select.css` is unchanged. | shipped |
| `exports` map blocks deep imports (`vue-select/src/...`) | Import from the package root. | shipped |
| Build target is ES2020 (v3 targeted ES5 through Babel) | None for browsers Vue 3 supports. | done |
| Types ship with the package (`dist/types`); CSS is also exported as `vue-select/style.css` | Remove `@types/vue-select` (#1843). `vue-select/dist/vue-select.css` still works. | done |

## v-model

| Change | Migration | Status |
|--------|-----------|--------|
| `value` prop is now `modelValue` | `v-model` needs no change. Replace explicit `:value` with `:model-value`. | shipped |
| `input` event is now `update:modelValue` | Replace `@input` with `@update:model-value`. | shipped |

## Props

| Removed or changed | Migration | Status |
|--------------------|-----------|--------|
| `onTab`, `selectOnTab` | `:map-keydown="(map, ctx) => ({ ...map, Tab: () => ctx.open.value && ctx.typeAheadSelect() })"`. Don't map Tab to `map.Enter`: Enter prevents the default, which would trap focus. | done |
| `selectOnKeyCodes` | `:map-keydown="map => ({ ...map, ',': map.Enter })"` | done |
| `mapKeydown` keys are `KeyboardEvent.key` names instead of key codes; second argument is the combobox context instead of the component instance | Replace `13` with `'Enter'`, `9` with `'Tab'`, `188` with `','`, etc. | done |
| `searchInputQuerySelector` | Not needed: bind the attributes from the `search` slot to your input. | done |
| `noDrop` | `:open="false"`. Tagging still works: Enter creates the tag while the dropdown is held closed. | done |
| `dropdownShouldOpen` | `v-model:open`, deciding in your `@update:open` handler. | done |
| `pushTags` | `@option:created="tag => options.push(tag)"` | done |
| `filter` receives `(options, search)`; v3 also passed the component instance | Use the arguments; there is no instance. | done |
| `filterBy` | `:filter="(options, search) => options.filter(o => match(o, search))"` | done |
| `components` | `open-indicator` and `deselect` slots. | done |
| `inputId`, `tabindex`, `autocomplete` | `:input-attrs="{ id, tabindex, autocomplete }"` | done |
| `uid` | Not needed: ids are generated with `useId()`. Use `inputAttrs.id` to target the input. | done |
| `appendToBody` | `append-to="body"` | done |
| `clearSearchOnBlur` takes a boolean instead of a function | Pass the boolean your function returned. | done |
| `calculatePosition` receives the combobox context instead of the component instance | Read state from the context argument; the toggle element is `position.toggle` (v3: `component.$refs.toggle`). | done |

## Behavior

| Change | Migration | Status |
|--------|-----------|--------|
| Deselecting in single-select mode sets the value to `null`. v3 set it to `[]`. | Remove any `[]` checks for an empty single-select value. | done (T1) |
| Backspace deselection emits `option:deselecting` / `option:deselected` (#1430) | None; listeners now fire for every deselection. | done |
| `searchable: false` renders a focusable `div[role=combobox]` (ARIA select-only combobox) instead of a read-only `<input>` | Style `.vs--unsearchable .vs__search` as before; don't rely on it being an `<input>`. | done |
| The search input has `role="combobox"` (ARIA 1.2). v3 put it on `.vs__dropdown-toggle` with `aria-owns`. | Update selectors or tests that look for the role on the toggle. | done |
| Options' `aria-selected` reflects selection. v3 set it on the highlighted option. | Use `.vs__dropdown-option--highlight` / `aria-activedescendant` for the highlighted option. | done |
| Focusing or clicking the input no longer opens the dropdown. Typing, ↓/Alt+↓ and the toggle button open it (WAI-ARIA APG pattern; same model as Headless UI). Select-only fields (`searchable: false`) still toggle on click. | Set `openOnFocus` to open on focus and on clicks in the field, as v3 did. | done |
| The open indicator is wrapped in a toggle button (`button.vs__open-indicator-button`, `tabindex="-1"`, `aria-label` from `ariaLabels.toggle`, `aria-expanded`, `aria-controls`). | Custom `open-indicator` slot content renders inside the button; avoid nesting another button. | done |
| Keyboard follows the WAI-ARIA APG combobox examples. Editable: Escape closes first, then clears the search (v3 cleared first); ↓/↑ on a closed dropdown with nothing selected highlight the first/last option; the highlight wraps at the ends (v3 stopped); Enter with nothing highlighted closes. Select-only (`searchable: false`): no wrapping; Home/End, PageUp/PageDown, Tab and Alt+↑ select; repeating a letter cycles matches. | Use `mapKeydown` to restore specific keys. | done |
| Escape keeps focus on the input. v3 blurred it on an empty search. | None for users; keyboard focus no longer drops to the page. | done |
| Enter on a closed dropdown does its default (e.g. submits the form) instead of selecting the highlighted option; with `taggable` and search text it still creates the tag. | None for most forms. Handle `Enter` in `mapKeydown` to select instead. | done |
| `toggleDropdown()` on a template ref takes no event argument. | Call it without arguments. | done |
| The open indicator icon is `aria-hidden`; the toggle button carries the name and state. | None. | done |
| New icons: Heroicons 20px chevron-down (toggle) and x-mark (clear), 16px x-mark on tags, sized with CSS (`--vs-controls-icon-size`, `--vs-deselect-icon-size`). `--vs-controls-size` now scales them through their size instead of a `transform: scale()`. | Custom CSS that targeted the old SVG dimensions or the `scale()` transform may need adjusting. Use the `open-indicator`, `clear` and `deselect` slots to supply your own icons. | done |
| CSS variables: `--vs-dropdown-option-bg` removed (it was never applied). `--vs-transition-*` are defined once, with the values v3 actually applied. `--vs-disabled-color` and `--vs-state-disabled-controls-color` now style disabled text and icons. New: `--vs-focus-color`, `--vs-focus-ring`, `--vs-controls--spinner-size`. The dropdown fade-in now runs (v3 used Vue 2's class name). | Set `--vs-disabled-color` to keep disabled text dark; set `--vs-focus-ring: none` to remove the focus ring. | done |
| Default highlight color `--vs-dropdown-option--active-bg` is `#136cfb` (4.6:1 with white, WCAG AA). v3 used `#5897fb` (2.9:1). | Set the variable to restore the old color. | done |
| `vs--searching` is set whenever there is search text, including with `:open="false"`. v3 suppressed it with `noDrop`. | Combine with `.vs--open` in custom CSS if needed. | done |
| Element ids come from Vue's `useId()`, unique within one app. | Pages that mount several Vue apps should give each app a distinct `app.config.idPrefix`. | done |
| Clear button also shows in multi-select | Set `:clearable="false"` to hide it. | done |
| Template refs expose only `open`, `search`, `select`, `deselect`, `clearSelection`, `toggleDropdown`, `focus`, `blur` | Use props, events and slots instead of other internals. | done |

## Headless primitives

Only affect code written against unreleased `@beta/dev` builds. No published version contains them.

- `ListBoxKey` renamed to `ComboBoxKey`; `ListBoxProps` / `ResolvedListBoxProps` replaced by `ComboBoxProps` / `ComboBoxContext`.
- `ComboBoxOption` requires an `index` prop.
- `StyledComboBox` removed in favor of `VueSelect`.
