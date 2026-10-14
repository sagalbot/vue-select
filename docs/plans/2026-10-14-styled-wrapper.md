# Styled VueSelect Wrapper Implementation Plan

**Goal:** Plan 2 from `2026-02-16-v4-release-design.md`. Replace the Options API `Select.vue` with a `VueSelect` component built on the headless primitives, at full v3 feature parity, plus the most requested features that have waited on v4.

**Scope decision (2026-10-14):** v4.0 ships everything in the design doc (primitives, styled wrapper, docs, release). No reduced-scope release.

**Depends on:** Plan 1 (headless primitives, PR #1877, on `@beta/dev`).

**Test command:** `pnpm exec vitest run --environment jsdom`
**Build command:** `pnpm exec vue-tsc --noEmit && pnpm exec vite build`

**Breaking changes:** tracked in `docs/plans/v4-breaking-changes.md`. Every task that breaks something adds an entry there in the same commit.

---

## Principles

1. **The v3 test suite is the compatibility spec.** The 20 legacy spec files in `tests/unit/*.spec.js` describe how vue-select behaves today. `VueSelect` must pass them, or each failure gets a recorded breaking change with a migration note.
2. **Keep the DOM and CSS contract.** `VueSelect` renders the same `vs__*` element classes and `vs--*` state classes as v3, so the CSS custom properties and users' existing style overrides keep working.
3. **Behavior lives in the primitives.** If `VueSelect` needs a behavior, it goes in `useComboBox` or a primitive, so headless users get it too. `VueSelect` only handles markup, slots, styling, and v3-compatible events.
4. **One component.** `Select.vue` is deleted, not kept alongside. The default export becomes `VueSelect`.
5. **Smaller prop surface, same capability.** Breaking changes that simplify the public props are encouraged, as long as users can still do everything they could before. A prop that encourages an anti-pattern or an inaccessible UI pattern is removed without a replacement, and the upgrade guide explains why.

## Decisions (confirmed 2026-10-14)

| # | Decision |
|---|----------|
| D1 | Option groups use a `groupBy` prop over a flat `options` array. Design in T9. |
| D2 | Peer dependency becomes `vue: ^3.5`, for `useId()`. |
| D3 | Prop surface is reduced following principle 5. Proposed changes in the prop audit below. |
| D4 | `appendToBody` is replaced by `appendTo?: string \| HTMLElement` using `<Teleport>`. `calculatePosition` stays. |
| D5 | New in v4.0: option groups (#78, #342), `clear` event and slot (#1429, #1104), configurable ARIA labels (#1030), `hideSelected` (#1144), generic typed props and slots (#1540), first-party types (#1843). |
| D6 | Virtual scrolling (#761) is a stretch goal: ships in 4.0 if ready, otherwise 4.x. A max selection limit (#881, PR #1823) gets no prop: it already works through `selectable` and is a documented recipe. |
| D7 | The six 3.19–3.20.x fixes that never reached the beta branch are required for 4.0 (T12). |

## Prop audit (proposal, review before Phase 2)

v3 has 41 props (39 in `Select.vue`, plus `loading` and `autoscroll` from mixins). This proposal removes 14 and adds 6, for 33.

**Kept unchanged (24):** `modelValue`, `options`, `multiple`, `disabled`, `placeholder`, `label`, `reduce`, `selectable`, `getOptionLabel`, `getOptionKey`, `taggable`, `createOption`, `filter`, `filterable`, `searchable`, `loading`, `clearable`, `closeOnSelect`, `clearSearchOnSelect`, `deselectFromDropdown`, `resetOnOptionsChange`, `autoscroll`, `dir`, `transition`.

**Changed (3):**

| Prop | Change | Why |
|------|--------|-----|
| `mapKeydown` | Handler map keyed by `KeyboardEvent.key` (`'Enter'`, `','`) instead of `keyCode` numbers. Second argument is the documented combobox context instead of the component instance. | `keyCode` is deprecated in the DOM. The instance exposes internals that v4 no longer has. |
| `clearSearchOnBlur` | `boolean` instead of `({ clearSearchOnSelect, multiple }) => boolean`. Default stays "single-select and `clearSearchOnSelect`". | The function only ever received two props the user already has. |
| `calculatePosition` | Receives the context instead of the component instance. | Same reason as `mapKeydown`. |

**Removed (14):**

| Prop | Replacement |
|------|-------------|
| `onTab`, `selectOnTab` | Deprecated since 3.3. `mapKeydown`: `map => ({ ...map, Tab: map.Enter })`. |
| `selectOnKeyCodes` | `mapKeydown`: `map => ({ ...map, ',': map.Enter })`. It duplicated `mapKeydown` with deprecated key codes. |
| `searchInputQuerySelector` | None needed. The `search` slot receives the input bindings, so the component no longer queries the DOM for its own input. |
| `noDrop`, `dropdownShouldOpen` | Controlled `v-model:open`. `noDrop` becomes `:open="false"`. Conditional opening handles `@update:open` (and `@search` when it depends on the search text). One mechanism instead of three, and no access to component internals. |
| `pushTags` | `@option:created="tag => options.push(tag)"`. `pushTags` kept a hidden copy of the options inside the component, so the options lived in two places and drifted (for example with `resetOnOptionsChange`). |
| `filterBy` | `filter`: `(options, search) => options.filter(o => match(o, search))`. Two props for one job. |
| `components` | Slots: the existing `open-indicator` slot plus a new `deselect` slot. Slots are typed and idiomatic in Vue 3. |
| `inputId`, `tabindex`, `autocomplete` | `inputAttrs` object bound to the search input, e.g. `:input-attrs="{ id: 'country' }"` for `<label for>`. |
| `uid` | None needed. IDs come from `useId()` and are SSR-safe. Target the element through `inputAttrs.id` or your own attributes. |
| `appendToBody` | `appendTo` (D4). |

**Added (6):** `open` (`v-model:open`), `inputAttrs`, `appendTo`, `groupBy`, `hideSelected`, `ariaLabels`.

**Behavior change:** the clear button now also shows in multi-select (#978, #1383, PR #1853). v3 hid it there.

**Not removed:** `searchable: false` is the ARIA "select-only combobox" pattern and stays, but must render as a focusable element with `role="combobox"`, not a read-only text input. `label` stays next to `getOptionLabel` because it covers the most common case in one string.

## Known primitive bugs (confirmed 2026-10-14)

- `deselect()` in single-select mode emits `update:modelValue` with `[]` instead of `null`.
- `getOptionKey()` falls back to `JSON.stringify`, so `{ b: 1, a: 2 }` and `{ a: 2, b: 1 }` are different options. v3 uses `sortAndStringify`.
- The module-level `uidCounter` produces different ids on server and client, which causes hydration mismatches. This is also an open review thread on #1877.

The other two open review threads on #1877 (`clearSearchOnBlur`, `search:focus`/`search:blur` events) are resolved by T8 and T16.

---

## Phase 1: Close primitive gaps (done 2026-10-14, branch `fix/combobox-core`)

Each task: failing test first, then the fix, in `src/hooks/useComboBox.ts`, `src/types.ts`, or `src/components/ComboBox/*`, with tests in `tests/unit/hooks/` or `tests/unit/ComboBox/`.

- ✅ **T1 `fix(useComboBox)`:** single-select `deselect()` emits `null`.
- ✅ **T2 `fix(useComboBox)`:** default `getOptionKey` matches v3: return primitives as-is, `id` if present, otherwise `sortAndStringify`. Move `src/utility/sortAndStringify.js` to TypeScript.
- ✅ **T3 `fix(useComboBox)!`:** replace `uidCounter` with `useId()`. Add an SSR test (`renderToString` + hydrate in jsdom, assert no mismatch warning). `BREAKING CHANGE:` requires Vue 3.5+.
- ✅ **T4 `fix(useComboBox)`:** remember full option objects for selected values. With `reduce` plus async or changing `options`, the selected label currently falls back to the raw reduced value once the option leaves `options`.
- ✅ **T5 `feat(useComboBox)`:** `resetOnOptionsChange` (boolean or function, same signature as v3).
- ✅ **T6 `feat(useComboBox)`:** `searchable`, and controlled `open` that fully replaces `noDrop`/`dropdownShouldOpen`: the component only requests changes through `update:open` and never opens itself while `open` is bound.
- ✅ **T7 `feat(ComboBoxInput)!`:** `mapKeydown` keyed by `KeyboardEvent.key`, receiving the default handler map and the context.
- ✅ **T8 `feat(ComboBoxInput)`:** `clearSearchOnBlur` as a boolean with the v3 default. Blur no longer always clears the search.
- ✅ **T9 `feat(ComboBoxGroup)`:** option groups.
  - `groupBy?: (option) => string | null | undefined`. The return value is both the group key and its label. Options returning `null`/`undefined` are ungrouped and render first, without a header.
  - Order: filter first, then group. Groups appear in the order their first option appears in `options`; empty groups are hidden. Keyboard order, the `typeAheadPointer` index and option ids follow the rendered order, so arrow keys never jump around visually.
  - New tags (taggable) are ungrouped, so they stay at the top.
  - Context gains `groupedOptions: { key, label, options: { option, index }[] }[]`. `index` is the flat index used by `ComboBoxOption`.
  - `ComboBoxGroup` renders `role="group"` with `aria-labelledby` pointing at its header (`role="presentation"`). It takes a `label` prop and a default slot.
  - Replaces the common workaround of inserting fake "heading" options and disabling them with `selectable`, which screen readers announce as disabled options rather than group labels.
- ✅ **T10 `feat(useComboBox)`:** emit `clear` from `clearSelection()`.
- ✅ **T11 `feat(useComboBox)`:** `hideSelected` removes selected options from `filteredOptions` in multi-select.
- ✅ **Added during Phase 1:**
  - Deselect rules now match v3: selecting a selected option deselects it only with `deselectFromDropdown`, and never empties a non-clearable value. Enter goes through the same path as a click. Backspace requires `clearable` and works in single-select; it emits `option:deselected`, which v3 did not (#1430).
  - `pushTags` and `filterBy` removed from the primitives, matching the prop audit.
  - Typing into the search reopens a closed dropdown (v3 behavior the primitives lacked).
  - Component tests share one mock context (`tests/unit/ComboBox/mockContext.ts`).

**Notes for Phase 2:**
- v3 hides the menu while `loading` (its default `dropdownShouldOpen`). The primitives don't; `VueSelect` should keep the v3 behavior in its own template.
- The docs dev server caches the prop types `ComboBox.vue` resolves from `types.ts`. After adding a prop to `ComboBoxProps`, restart the docs server.

## Phase 2: Build `VueSelect`

File: `src/components/VueSelect.vue`, `<script setup lang="ts" generic="Option">`.

- **T12 `fix`: the six missing 3.x fixes.** Each one gets a test in the new suite, ported from the commit on master that introduced it:
  - Focus stays on the input after selecting (#1727, `26f0827`).
  - Space opens the closed dropdown (#1735, `795feab`).
  - `aria-controls` on the toggle (#1802, `db9e899`).
  - `--vs-search-input-bg` CSS variable (3.20.0, `f69a026`).
  - `:host` on the CSS variable definitions, for shadow DOM (#1811, `77e52c1`).
  - Input keeps focus after adding a tag with the dropdown disabled (#755, `2427064`). In v4 this applies to `:open="false"`.
- **T13 skeleton:** compose `ComboBox`, `ComboBoxInput`, `ComboBoxMenu`, `ComboBoxOption`, `ComboBoxButton`, `ComboBoxClear`, `ComboBoxGroup`. Same markup tree and classes as v3: `vs__dropdown-toggle`, `vs__selected-options`, `vs__actions`, `vs__dropdown-menu`, `vs__dropdown-option--highlight/--selected/--disabled/--deselect`, and state classes `vs--open`, `vs--single`, `vs--multiple`, `vs--searching`, `vs--searchable`, `vs--unsearchable`, `vs--loading`, `vs--disabled`, plus `dir` for RTL.
- **T14 selected values:** tags with deselect buttons, single-select display, `Deselect` and `OpenIndicator` as slot defaults.
- **T15 slots:** every v3 slot with the same scope shape (`header`, `selected-option-container`, `selected-option`, `search`, `open-indicator`, `spinner`, `list-header`, `option`, `no-options`, `list-footer`, `footer`), plus new `clear`, `deselect` and `group-header`. Slot props typed through the `Option` generic.
- **T16 events:** the full v3 `emits` list (`open`, `close`, `update:modelValue`, `search`, `search:focus`, `search:blur`, `search:keydown`, `search:input`, `search:compositionstart`, `search:compositionend`, `option:created`, `option:selecting`, `option:selected`, `option:deselecting`, `option:deselected`) plus `clear` and `update:open`.
- **T17 positioning:** `appendTo` via `<Teleport>`, `calculatePosition`, `transition`.
- **T18 accessibility:** `ariaLabels` prop object for the search input, listbox, clear button, and per-tag deselect button (`(option) => string`). Defaults match v3 English text. Include `aria-multiselectable` (PR #1726). `inputAttrs` bound to the input.
- **T19 instance API:** `defineExpose` the members people reach for through template refs in v3: `open`, `search`, `select`, `deselect`, `clearSelection`, `toggleDropdown`, `focus`, `blur`.

## Phase 3: Compatibility harness

- **T20 harness:** rewrite `tests/helpers.js` to drive the DOM (type into the input, press keys) instead of mutating `vm.search` and `$refs`. Point all legacy specs at `VueSelect`, updating only the props removed by the audit. Each other failing assertion either gets fixed or gets an entry in `docs/plans/v4-breaking-changes.md` with a migration note.
- **T21 new coverage:** grouped options keyboard navigation, `appendTo` teleport cleanup on unmount, SSR hydration of `VueSelect`, controlled `open`.

## Phase 4: Cutover

- **T22 `feat!`:** default export becomes `VueSelect`. Restore the named `VueSelect` export that the beta dropped, so `import { VueSelect } from 'vue-select'` keeps working. Delete `Select.vue`, `src/mixins/`, `src/directives/appendToBody.js`, `src/components/childComponents.js`, `src/scss/`, `StyledComboBox.vue`, `useModelValue.ts`, and the deprecated `ListBox*` types and keys. `pnpm exec eslint .` passes with zero errors (the 22 current errors are in `Select.vue`, `Deselect.vue`, `dev/`, `postcss.config.js`, three legacy specs, and `useModelValue.ts`). `pnpm typecheck` (strict, `tsconfig.vitest.json`) passes: it currently reports 33 errors, mostly `ctx` possibly undefined in primitive templates.
- **T23 `build`:** `exports` map with `types`, `import`, and `require` conditions plus `./style.css`, keeping `./dist/vue-select.css` working. Emit `.d.ts` files. Set `output.exports: 'named'` to fix the mixed-export build warning. Update the bundlewatch limits.
- **T24 `chore(dev)`:** update the `dev/` playground to show `VueSelect` and a headless composition side by side.

## Phase 5: Stretch

- **T25 virtual scrolling (#761):** only if Phases 1–4 are done and it fits without changing the primitives' public API. Otherwise 4.x.

## Not in this plan

- Docs: Plan 3. The max-selection recipe moves from the v3 `selectable` guide into the v4 docs.
- Branch audit, comparison with the `@nextcloud/vue-select` fork, open PR and issue triage: Plan 4. The fork comparison can run any time and may feed fixes into Phase 1.
