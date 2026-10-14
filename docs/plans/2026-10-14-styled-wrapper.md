# Styled VueSelect Wrapper Implementation Plan

**Goal:** Plan 2 from `2026-02-16-v4-release-design.md`. Replace the Options API `Select.vue` with a `VueSelect` component built on the headless primitives, at full v3 feature parity, plus the most requested features that have waited on v4.

**Scope decision (2026-10-14):** v4.0 ships everything in the design doc (primitives, styled wrapper, docs, release). No reduced-scope release.

**Depends on:** Plan 1 (headless primitives, PR #1877, on `@beta/dev`).

**Test command:** `pnpm exec vitest run --environment jsdom`
**Build command:** `pnpm exec vue-tsc --noEmit && pnpm exec vite build`

---

## Principles

1. **The v3 test suite is the compatibility spec.** The 20 legacy spec files in `tests/unit/*.spec.js` describe how vue-select behaves today. `VueSelect` must pass them, or each failure gets a recorded breaking change with a migration note.
2. **Keep the DOM and CSS contract.** `VueSelect` renders the same `vs__*` element classes and `vs--*` state classes as v3, so the CSS custom properties and users' existing style overrides keep working.
3. **Behavior lives in the primitives.** If `VueSelect` needs a behavior, it goes in `useComboBox` or a primitive, so headless users get it too. `VueSelect` only handles markup, slots, styling, and v3-compatible events.
4. **One component.** `Select.vue` is deleted, not kept alongside. The default export becomes `VueSelect`.

## Decisions to confirm

These are proposals. Veto any before the task that depends on it starts.

| # | Proposal | Why |
|---|----------|-----|
| D1 | Option groups use a `groupBy?: (option) => string` prop over a flat `options` array. Nested `{ label, options: [] }` input is not supported. | Keyboard navigation and `aria-activedescendant` stay on one flat index. Nested input can be flattened by users in one line. |
| D2 | Peer dependency becomes `vue: ^3.5`. | Needed for `useId()`, which fixes SSR hydration mismatches (see T3). |
| D3 | Drop `selectOnTab` (deprecated since 3.3, use `selectOnKeyCodes`) and `searchInputQuerySelector` (exists only to locate the input inside the `search` slot, which v4 gets from the primitive). | Smaller prop surface; both have direct replacements. |
| D4 | Replace `appendToBody` with `appendTo?: string \| HTMLElement` using `<Teleport>`. Keep `calculatePosition`. | `appendToBody` is a custom directive with known cleanup and styling bugs (#1266, PR #1745, PR #1775). Teleport is the Vue 3 native mechanism. |
| D5 | New in v4.0: option groups (#78, #342), `clear` event and slot (#1429, #1104), configurable ARIA labels (#1030), `hideSelected` (#1144), generic typed props and slots (#1540), first-party types (#1843). | These are the most requested open issues that fit the new architecture. |
| D6 | Out of scope for v4.0: virtual scrolling (#761), max selection limit (#881, PR #1823). | Can ship in 4.x without breaking changes. |

## Known primitive bugs (confirmed 2026-10-14)

- `deselect()` in single-select mode emits `update:modelValue` with `[]` instead of `null`.
- `getOptionKey()` falls back to `JSON.stringify`, so `{ b: 1, a: 2 }` and `{ a: 2, b: 1 }` are different options. v3 uses `sortAndStringify`.
- The module-level `uidCounter` produces different ids on server and client, which causes hydration mismatches. This is also an open review thread on #1877.

The other two open review threads on #1877 (`clearSearchOnBlur`, `search:focus`/`search:blur` events) are resolved by T8 and T15.

---

## Phase 1: Close primitive gaps

Each task: failing test first, then the fix, in `src/hooks/useComboBox.ts`, `src/types.ts`, or `src/components/ComboBox/*`, with tests in `tests/unit/hooks/` or `tests/unit/ComboBox/`.

- **T1 `fix(useComboBox)`:** single-select `deselect()` emits `null`.
- **T2 `fix(useComboBox)`:** default `getOptionKey` matches v3: return primitives as-is, `id` if present, otherwise `sortAndStringify`. Move `src/utility/sortAndStringify.js` to TypeScript.
- **T3 `fix(useComboBox)!`:** replace `uidCounter` with `useId()`. Add an SSR test (`renderToString` + hydrate in jsdom, assert no mismatch warning). `BREAKING CHANGE:` requires Vue 3.5+ (D2).
- **T4 `fix(useComboBox)`:** remember full option objects for selected values. With `reduce` plus async or changing `options`, the selected label currently falls back to the raw reduced value once the option leaves `options`.
- **T5 `feat(useComboBox)`:** `resetOnOptionsChange` (boolean or function, same signature as v3).
- **T6 `feat(useComboBox)`:** `searchable` and `dropdownShouldOpen` props.
- **T7 `feat(ComboBoxInput)`:** keyboard customization: `selectOnKeyCodes`, `mapKeydown`, Tab behavior, and Space via `keypress` (port of the #1735 fix). `mapKeydown` receives the default handler map and the context, mirroring v3.
- **T8 `feat(ComboBoxInput)`:** `clearSearchOnBlur` (function, v3 default). Blur no longer always clears the search.
- **T9 `feat(ComboBoxGroup)`:** new primitive with `role="group"` and `aria-labelledby`, plus `groupBy` in `useComboBox` exposing `groupedOptions` that keep flat indices (D1).
- **T10 `feat(useComboBox)`:** emit `clear` from `clearSelection()`.
- **T11 `feat(useComboBox)`:** `hideSelected` removes selected options from `filteredOptions` in multi-select.

## Phase 2: Build `VueSelect`

File: `src/components/VueSelect.vue`, `<script setup lang="ts" generic="Option">`.

- **T12 skeleton:** compose `ComboBox`, `ComboBoxInput`, `ComboBoxMenu`, `ComboBoxOption`, `ComboBoxButton`, `ComboBoxClear`. Same markup tree and classes as v3: `vs__dropdown-toggle`, `vs__selected-options`, `vs__actions`, `vs__dropdown-menu`, `vs__dropdown-option--highlight/--selected/--disabled/--deselect`, and state classes `vs--open`, `vs--single`, `vs--multiple`, `vs--searching`, `vs--searchable`, `vs--unsearchable`, `vs--loading`, `vs--disabled`, plus `dir` for RTL.
- **T13 selected values:** tags with deselect buttons, single-select display, `Deselect` and `OpenIndicator` child components, `components` prop for overriding them.
- **T14 slots:** every v3 slot with the same scope shape (`header`, `selected-option-container`, `selected-option`, `search`, `open-indicator`, `spinner`, `list-header`, `option`, `no-options`, `list-footer`, `footer`), plus new `clear` and `group-header`. Slot props typed through the `Option` generic.
- **T15 events:** the full v3 `emits` list (`open`, `close`, `update:modelValue`, `search`, `search:focus`, `search:blur`, `search:keydown`, `search:input`, `search:compositionstart`, `search:compositionend`, `option:created`, `option:selecting`, `option:selected`, `option:deselecting`, `option:deselected`) plus `clear`.
- **T16 positioning:** `appendTo` via `<Teleport>`, `calculatePosition`, `transition` (D4).
- **T17 accessibility:** `ariaLabels` prop object for the search input, listbox, clear button, and per-tag deselect button (`(option) => string`). Defaults match v3 English text. Include `aria-multiselectable` (PR #1726).
- **T18 instance API:** `defineExpose` the members people reach for through template refs in v3: `open`, `search`, `select`, `deselect`, `clearSelection`, `toggleDropdown`, `focus`, `blur`.

## Phase 3: Compatibility harness

- **T19 harness:** rewrite `tests/helpers.js` to drive the DOM (type into the input, press keys) instead of mutating `vm.search` and `$refs`. Point all legacy specs at `VueSelect`. Each failing assertion either gets fixed or gets an entry in `docs/plans/v4-breaking-changes.md` with a migration note. That file feeds the upgrade guide (Plan 3, Phase C).
- **T20 new coverage:** grouped options keyboard navigation, `appendTo` teleport cleanup on unmount, SSR hydration of `VueSelect`.

## Phase 4: Cutover

- **T21 `feat!`:** default export becomes `VueSelect`. Delete `Select.vue`, `src/mixins/`, `src/directives/appendToBody.js`, `src/components/childComponents.js`, `src/scss/`, `StyledComboBox.vue`, `useModelValue.ts`, and the deprecated `ListBox*` types and keys. `pnpm exec eslint .` passes with zero errors (the 22 current errors are in `Select.vue`, `Deselect.vue`, `dev/`, `postcss.config.js`, and three legacy specs).
- **T22 `build`:** `exports` map with `types`, `import`, and `require` conditions plus `./style.css`. Emit `.d.ts` files. Set `output.exports: 'named'` to fix the mixed-export build warning. Update the bundlewatch limits.
- **T23 `chore(dev)`:** update the `dev/` playground to show `VueSelect` and a headless composition side by side.

## Breaking changes collected so far

- `vue` peer dependency `^3.5` (T3)
- `selectOnTab` and `searchInputQuerySelector` removed (D3)
- `appendToBody` replaced by `appendTo` (D4)
- Default export is a new component. Template refs expose only the members listed in T18.
- Plus anything recorded by T19.

## Not in this plan

- Docs: Plan 3.
- Branch audit, comparison with the `@nextcloud/vue-select` fork, open PR and issue triage: Plan 4. The fork comparison can run any time and may feed fixes into Phase 1.
