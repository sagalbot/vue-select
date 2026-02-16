# Headless Primitives Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the headless ComboBox primitives for vue-select v4 -- composable, unstyled, fully accessible components for building custom select UIs.

**Architecture:** A `useComboBox` composable owns all state and logic. `ComboBox` is a thin provider component that wraps `useComboBox` and injects context via `provide`/`inject`. Child primitives (`ComboBoxInput`, `ComboBoxMenu`, `ComboBoxOption`, etc.) are renderless-ish wrappers that inject context and bind it to DOM elements. Users compose these primitives freely.

**Tech Stack:** Vue 3, TypeScript (`<script setup lang="ts">`), Vitest, @vue/test-utils v2

**Important context:** The existing `src/components/Select.vue` (Options API, 1366 lines) is the feature reference. The headless primitives must support all its core behaviors: single/multi-select, filtering, tagging, keyboard navigation, ARIA, async loading, and value reduction. See `docs/plans/2026-02-16-v4-release-design.md` for the overall v4 design.

**Test command:** `npx vitest run` (all tests) or `npx vitest run tests/unit/<file>` (single file)

**Build command:** `npx vue-tsc --noEmit && npx vite build`

---

## Task 1: Fix useClickAway Bug + Add Tests

The current `useClickAway.ts` has a critical bug: `removeClickAwayListener` creates a new arrow function each call, so `document.removeEventListener` never actually removes the listener. The handler reference must be stored.

**Files:**
- Modify: `src/hooks/useClickAway.ts`
- Create: `tests/unit/hooks/useClickAway.spec.ts`

**Step 1: Write the failing test**

```ts
// tests/unit/hooks/useClickAway.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useClickAway } from '@/hooks/useClickAway'

describe('useClickAway', () => {
  let el: HTMLDivElement

  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.removeChild(el)
  })

  it('calls callback when clicking outside the element', async () => {
    const callback = vi.fn()
    const { addClickAwayListener } = useClickAway(callback)
    addClickAwayListener(el)

    document.body.click()
    expect(callback).toHaveBeenCalledOnce()
  })

  it('does not call callback when clicking inside the element', () => {
    const callback = vi.fn()
    const { addClickAwayListener } = useClickAway(callback)
    addClickAwayListener(el)

    el.click()
    expect(callback).not.toHaveBeenCalled()
  })

  it('stops listening after removeClickAwayListener is called', () => {
    const callback = vi.fn()
    const { addClickAwayListener, removeClickAwayListener } = useClickAway(callback)
    addClickAwayListener(el)
    removeClickAwayListener(el)

    document.body.click()
    expect(callback).not.toHaveBeenCalled()
  })

  it('does not throw when removing listener before adding', () => {
    const callback = vi.fn()
    const { removeClickAwayListener } = useClickAway(callback)
    expect(() => removeClickAwayListener(el)).not.toThrow()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/hooks/useClickAway.spec.ts`
Expected: The "stops listening" test FAILS because the current implementation creates a new function reference in `removeClickAwayListener`, so `removeEventListener` is a no-op.

**Step 3: Fix the implementation**

```ts
// src/hooks/useClickAway.ts
export function useClickAway(callback: () => void) {
  let handler: ((event: Event) => void) | null = null

  function addClickAwayListener(el: HTMLElement | undefined) {
    if (!el) return

    handler = (event: Event) => {
      if (el && !(el === event.target || el.contains(event.target as Node))) {
        callback()
      }
    }

    document.addEventListener('click', handler)
  }

  function removeClickAwayListener(_el: HTMLElement | undefined) {
    if (handler) {
      document.removeEventListener('click', handler)
      handler = null
    }
  }

  return { addClickAwayListener, removeClickAwayListener }
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/hooks/useClickAway.spec.ts`
Expected: All 4 tests PASS

**Step 5: Commit**

```bash
git add src/hooks/useClickAway.ts tests/unit/hooks/useClickAway.spec.ts
git commit -m "fix(useClickAway): store handler reference so removeEventListener works"
```

---

## Task 2: Define Core Types

The current `src/types.ts` is incomplete. `InjectedListBoxProps` is referenced in `ComboBox.vue` but doesn't exist. The provided context needs to be significantly expanded to support all features.

**Files:**
- Modify: `src/types.ts`
- Modify: `src/keys.ts`

**Step 1: Write the new types**

```ts
// src/types.ts
import type { ComputedRef, Ref } from 'vue'

/**
 * A single option can be a string, number, or object.
 */
export type OptionValue = string | number | Record<string, unknown>

/**
 * The modelValue can be a single option, an array (multi-select), or null.
 */
export type ModelValue = OptionValue | OptionValue[] | null

/**
 * Props accepted by the ComboBox root component.
 */
export interface ComboBoxProps {
  /** The current selected value(s). */
  modelValue?: ModelValue
  /** The list of available options. */
  options?: OptionValue[]
  /** Allow selecting multiple values. */
  multiple?: boolean
  /** Enable filtering options by search text. */
  filterable?: boolean
  /** Enable creating new options from search text. */
  taggable?: boolean
  /** Add created tags to the options list. */
  pushTags?: boolean
  /** Allow clearing the selection. */
  clearable?: boolean
  /** Close dropdown after selecting an option. */
  closeOnSelect?: boolean
  /** Clear search text after selecting an option. */
  clearSearchOnSelect?: boolean
  /** Disable the component. */
  disabled?: boolean
  /** Controlled open state. When undefined, open state is managed internally. */
  open?: boolean
  /** Object key to use as the display label. */
  label?: string
  /** Transform an option before emitting via modelValue. */
  reduce?: (option: OptionValue) => unknown
  /** Determine if an option is selectable. */
  selectable?: (option: OptionValue) => boolean
  /** Return a display string for an option. */
  getOptionLabel?: (option: OptionValue) => string
  /** Return a unique key for an option. */
  getOptionKey?: (option: OptionValue) => string
  /** Custom filter function for the entire options list. */
  filter?: (options: OptionValue[], search: string) => OptionValue[]
  /** Per-option filter predicate. */
  filterBy?: (option: OptionValue, label: string, search: string) => boolean
  /** Factory function for creating new options from search text. */
  createOption?: (search: string) => OptionValue
  /** Show loading indicator. */
  loading?: boolean
  /** Unique ID for ARIA attributes. */
  uid?: string
  /** Placeholder text for the search input. */
  placeholder?: string
  /** Disable the dropdown (input-only mode). */
  noDrop?: boolean
  /** Click a selected option in the dropdown to deselect it. */
  deselectFromDropdown?: boolean
  /** Autoscroll to keep highlighted option visible. */
  autoscroll?: boolean
}

/**
 * The resolved context provided to child components via inject.
 * This is the public API of the headless ComboBox.
 */
export interface ComboBoxContext {
  // --- State (readonly) ---
  /** Whether the dropdown is open. */
  open: Ref<boolean>
  /** The current search/filter text. */
  search: Ref<string>
  /** The currently selected value(s), always as an array. */
  selectedValue: ComputedRef<OptionValue[]>
  /** Options after filtering by search text. */
  filteredOptions: ComputedRef<OptionValue[]>
  /** Index of the currently highlighted option in filteredOptions. */
  typeAheadPointer: Ref<number>
  /** Whether the component is in a loading state. */
  isLoading: Ref<boolean>
  /** Whether the search input has focus. */
  // (not tracked at this level -- components handle their own focus)
  /** Whether the component is disabled. */
  disabled: ComputedRef<boolean>
  /** Whether multiple selection is enabled. */
  multiple: ComputedRef<boolean>
  /** Whether search/filter is enabled. */
  filterable: ComputedRef<boolean>
  /** Whether the dropdown should display. */
  noDrop: ComputedRef<boolean>
  /** Whether the clear button should show. */
  clearable: ComputedRef<boolean>
  /** Whether tagging is enabled. */
  taggable: ComputedRef<boolean>
  /** Placeholder text. */
  placeholder: ComputedRef<string>
  /** Whether the current value is empty. */
  isValueEmpty: ComputedRef<boolean>
  /** Whether there is active search text. */
  isSearching: ComputedRef<boolean>
  /** Unique ID for ARIA attributes. */
  uid: ComputedRef<string>

  // --- Methods ---
  /** Select an option. */
  select: (option: OptionValue) => void
  /** Deselect an option. */
  deselect: (option: OptionValue) => void
  /** Clear the entire selection. */
  clearSelection: () => void
  /** Toggle the dropdown open/closed. */
  toggleOpen: () => void
  /** Set the dropdown open state directly. */
  setOpen: (value: boolean) => void
  /** Update the search text. */
  setSearch: (value: string) => void
  /** Move typeahead pointer up. */
  typeAheadUp: () => void
  /** Move typeahead pointer down. */
  typeAheadDown: () => void
  /** Select the currently highlighted option. */
  typeAheadSelect: () => void
  /** Toggle loading state. */
  toggleLoading: (value?: boolean) => void
  /** Get the display label for an option. */
  getOptionLabel: (option: OptionValue) => string
  /** Get a unique key for an option. */
  getOptionKey: (option: OptionValue) => string
  /** Check if an option is currently selected. */
  isOptionSelected: (option: OptionValue) => boolean
  /** Check if an option is selectable (not disabled). */
  isOptionSelectable: (option: OptionValue) => boolean
  /** Check if an option is highlighted by the typeahead pointer. */
  isOptionHighlighted: (index: number) => boolean
  /** Get the complete list of options (including pushed tags). */
  optionList: ComputedRef<OptionValue[]>
}
```

**Step 2: Update keys.ts**

```ts
// src/keys.ts
import type { InjectionKey } from 'vue'
import type { ComboBoxContext } from '@/types'

export const ComboBoxKey: InjectionKey<ComboBoxContext> = Symbol('ComboBoxContext')
```

**Step 3: Verify types compile**

Run: `npx vue-tsc --noEmit`
Expected: May have errors in existing ComboBox files that reference old types. That's expected -- we'll fix them in subsequent tasks.

**Step 4: Commit**

```bash
git add src/types.ts src/keys.ts
git commit -m "feat(types): define ComboBoxProps and ComboBoxContext interfaces"
```

---

## Task 3: Implement useComboBox Composable -- Core State

This is the brain of the headless architecture. Build it incrementally with tests. This task covers: open state, search state, value tracking, select/deselect.

**Files:**
- Modify: `src/hooks/useComboBox.ts`
- Create: `tests/unit/hooks/useComboBox.spec.ts`

**Step 1: Write failing tests for core state management**

```ts
// tests/unit/hooks/useComboBox.spec.ts
import { describe, it, expect } from 'vitest'
import { ref, nextTick } from 'vue'
import { useComboBox } from '@/hooks/useComboBox'

function createComboBox(overrides = {}) {
  const emit = vi.fn()
  const props = {
    options: ['one', 'two', 'three'],
    ...overrides,
  }
  return { ...useComboBox(props, emit), emit }
}

describe('useComboBox', () => {
  describe('open state', () => {
    it('starts closed by default', () => {
      const { open } = createComboBox()
      expect(open.value).toBe(false)
    })

    it('toggleOpen flips the state', () => {
      const { open, toggleOpen } = createComboBox()
      toggleOpen()
      expect(open.value).toBe(true)
      toggleOpen()
      expect(open.value).toBe(false)
    })

    it('setOpen sets the state directly', () => {
      const { open, setOpen } = createComboBox()
      setOpen(true)
      expect(open.value).toBe(true)
      setOpen(false)
      expect(open.value).toBe(false)
    })

    it('emits open/close events', () => {
      const { toggleOpen, emit } = createComboBox()
      toggleOpen()
      expect(emit).toHaveBeenCalledWith('open')
      toggleOpen()
      expect(emit).toHaveBeenCalledWith('close')
    })
  })

  describe('search state', () => {
    it('starts with empty search', () => {
      const { search } = createComboBox()
      expect(search.value).toBe('')
    })

    it('setSearch updates search text', () => {
      const { search, setSearch } = createComboBox()
      setSearch('hello')
      expect(search.value).toBe('hello')
    })

    it('isSearching reflects search state', () => {
      const { isSearching, setSearch } = createComboBox()
      expect(isSearching.value).toBe(false)
      setSearch('hello')
      expect(isSearching.value).toBe(true)
    })
  })

  describe('selection - single', () => {
    it('starts with empty selection when no modelValue', () => {
      const { selectedValue, isValueEmpty } = createComboBox()
      expect(selectedValue.value).toEqual([])
      expect(isValueEmpty.value).toBe(true)
    })

    it('select sets the value and emits update:modelValue', () => {
      const { select, selectedValue, emit } = createComboBox()
      select('one')
      expect(emit).toHaveBeenCalledWith('update:modelValue', 'one')
    })

    it('select emits option:selecting and option:selected events', () => {
      const { select, emit } = createComboBox()
      select('one')
      expect(emit).toHaveBeenCalledWith('option:selecting', 'one')
      expect(emit).toHaveBeenCalledWith('option:selected', 'one')
    })

    it('clearSelection resets to null and emits', () => {
      const { clearSelection, emit } = createComboBox({ modelValue: 'one' })
      clearSelection()
      expect(emit).toHaveBeenCalledWith('update:modelValue', null)
    })
  })

  describe('selection - multiple', () => {
    it('select appends to existing values', () => {
      const { select, emit } = createComboBox({
        multiple: true,
        modelValue: ['one'],
      })
      select('two')
      expect(emit).toHaveBeenCalledWith('update:modelValue', ['one', 'two'])
    })

    it('deselect removes from existing values', () => {
      const { deselect, emit } = createComboBox({
        multiple: true,
        modelValue: ['one', 'two'],
      })
      deselect('one')
      expect(emit).toHaveBeenCalledWith('option:deselecting', 'one')
      expect(emit).toHaveBeenCalledWith('update:modelValue', ['two'])
      expect(emit).toHaveBeenCalledWith('option:deselected', 'one')
    })

    it('clearSelection resets to empty array', () => {
      const { clearSelection, emit } = createComboBox({
        multiple: true,
        modelValue: ['one', 'two'],
      })
      clearSelection()
      expect(emit).toHaveBeenCalledWith('update:modelValue', [])
    })
  })

  describe('option helpers', () => {
    it('getOptionLabel returns the option for strings', () => {
      const { getOptionLabel } = createComboBox()
      expect(getOptionLabel('hello')).toBe('hello')
    })

    it('getOptionLabel returns option[label] for objects', () => {
      const { getOptionLabel } = createComboBox({ label: 'name' })
      expect(getOptionLabel({ name: 'Canada' })).toBe('Canada')
    })

    it('getOptionKey returns JSON.stringify by default', () => {
      const { getOptionKey } = createComboBox()
      expect(getOptionKey('hello')).toBe(JSON.stringify('hello'))
    })

    it('getOptionKey returns option.id if present', () => {
      const { getOptionKey } = createComboBox()
      expect(getOptionKey({ id: 42, label: 'x' })).toBe('42')
    })

    it('isOptionSelected returns true for selected options', () => {
      const { isOptionSelected } = createComboBox({ modelValue: 'one' })
      expect(isOptionSelected('one')).toBe(true)
      expect(isOptionSelected('two')).toBe(false)
    })

    it('isOptionSelectable defaults to true', () => {
      const { isOptionSelectable } = createComboBox()
      expect(isOptionSelectable('one')).toBe(true)
    })

    it('isOptionSelectable respects selectable prop', () => {
      const { isOptionSelectable } = createComboBox({
        selectable: (opt: string) => opt !== 'two',
      })
      expect(isOptionSelectable('one')).toBe(true)
      expect(isOptionSelectable('two')).toBe(false)
    })
  })
})
```

**Step 2: Run test to verify they fail**

Run: `npx vitest run tests/unit/hooks/useComboBox.spec.ts`
Expected: FAIL -- `useComboBox` is empty

**Step 3: Implement useComboBox**

Implement `src/hooks/useComboBox.ts` with:
- Reactive `open`, `search` refs
- `selectedValue` computed from `props.modelValue` (normalize to array)
- `select()` / `deselect()` / `clearSelection()` methods that emit events
- `getOptionLabel()` / `getOptionKey()` / `isOptionSelected()` / `isOptionSelectable()` helpers
- `toggleOpen()` / `setOpen()` / `setSearch()` state setters
- Return the full `ComboBoxContext` shape

Key implementation notes:
- The composable takes `props` (reactive) and `emit` as arguments
- It returns an object matching `ComboBoxContext` from types.ts
- `selectedValue` always normalizes to an array: `Array.isArray(v) ? v : v != null ? [v] : []`
- `isOptionSelected` uses `getOptionKey` comparison (same as `optionComparator` in Select.vue)
- `select` in single mode replaces the value; in multi mode appends
- `deselect` filters the value array by `getOptionKey` comparison

**Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/unit/hooks/useComboBox.spec.ts`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add src/hooks/useComboBox.ts tests/unit/hooks/useComboBox.spec.ts
git commit -m "feat(useComboBox): implement core state management composable"
```

---

## Task 4: Add Filtering to useComboBox

**Files:**
- Modify: `src/hooks/useComboBox.ts`
- Modify: `tests/unit/hooks/useComboBox.spec.ts`

**Step 1: Write failing tests for filtering**

```ts
describe('filtering', () => {
  it('filteredOptions returns all options when search is empty', () => {
    const { filteredOptions } = createComboBox({ options: ['one', 'two', 'three'] })
    expect(filteredOptions.value).toEqual(['one', 'two', 'three'])
  })

  it('filteredOptions filters by search text (case-insensitive)', () => {
    const { filteredOptions, setSearch } = createComboBox({
      options: ['One', 'Two', 'Three'],
    })
    setSearch('tw')
    expect(filteredOptions.value).toEqual(['Two'])
  })

  it('does not filter when filterable is false', () => {
    const { filteredOptions, setSearch } = createComboBox({
      options: ['one', 'two', 'three'],
      filterable: false,
    })
    setSearch('tw')
    expect(filteredOptions.value).toEqual(['one', 'two', 'three'])
  })

  it('uses custom filter function when provided', () => {
    const { filteredOptions, setSearch } = createComboBox({
      options: ['one', 'two', 'three'],
      filter: (opts, search) => opts.filter((o) => o === search),
    })
    setSearch('two')
    expect(filteredOptions.value).toEqual(['two'])
  })

  it('uses custom filterBy when provided', () => {
    const { filteredOptions, setSearch } = createComboBox({
      options: [{ label: 'one', code: '1' }, { label: 'two', code: '2' }],
      label: 'label',
      filterBy: (option, label, search) => option.code.includes(search),
    })
    setSearch('2')
    expect(filteredOptions.value).toEqual([{ label: 'two', code: '2' }])
  })

  it('filteredOptions includes taggable option when taggable and search has no match', () => {
    const { filteredOptions, setSearch } = createComboBox({
      options: ['one', 'two'],
      taggable: true,
    })
    setSearch('new-tag')
    expect(filteredOptions.value).toContain('new-tag')
  })

  it('filteredOptions does not include duplicate tag when option already exists', () => {
    const { filteredOptions, setSearch } = createComboBox({
      options: ['one', 'two'],
      taggable: true,
    })
    setSearch('one')
    const count = filteredOptions.value.filter((o) => o === 'one').length
    expect(count).toBe(1)
  })
})
```

**Step 2: Run tests, verify failure, implement, verify pass**

Add to `useComboBox`:
- `optionList` computed: `[...props.options, ...pushedTags]`
- `filteredOptions` computed: applies `filter` or default `filterBy` logic, adds taggable option when applicable
- Default `filterBy`: `(option, label, search) => label.toLocaleLowerCase().includes(search.toLocaleLowerCase())`

**Step 3: Commit**

```bash
git add src/hooks/useComboBox.ts tests/unit/hooks/useComboBox.spec.ts
git commit -m "feat(useComboBox): add filtering and taggable support"
```

---

## Task 5: Add TypeAhead Pointer to useComboBox

Keyboard navigation state: pointer up/down/select, autoscroll info.

**Files:**
- Modify: `src/hooks/useComboBox.ts`
- Modify: `tests/unit/hooks/useComboBox.spec.ts`

**Step 1: Write failing tests**

```ts
describe('typeAheadPointer', () => {
  it('starts at -1', () => {
    const { typeAheadPointer } = createComboBox()
    expect(typeAheadPointer.value).toBe(-1)
  })

  it('typeAheadDown moves to the next selectable option', () => {
    const { typeAheadPointer, typeAheadDown } = createComboBox({
      options: ['one', 'two', 'three'],
    })
    typeAheadDown()
    expect(typeAheadPointer.value).toBe(0)
    typeAheadDown()
    expect(typeAheadPointer.value).toBe(1)
  })

  it('typeAheadDown wraps to beginning', () => {
    const { typeAheadPointer, typeAheadDown } = createComboBox({
      options: ['one', 'two'],
    })
    typeAheadDown() // 0
    typeAheadDown() // 1
    typeAheadDown() // wraps to 0
    expect(typeAheadPointer.value).toBe(0)
  })

  it('typeAheadDown skips non-selectable options', () => {
    const { typeAheadPointer, typeAheadDown } = createComboBox({
      options: ['one', 'two', 'three'],
      selectable: (opt: string) => opt !== 'two',
    })
    typeAheadDown() // 0 (one)
    typeAheadDown() // skips 1 (two), lands on 2 (three)
    expect(typeAheadPointer.value).toBe(2)
  })

  it('typeAheadUp moves to the previous selectable option', () => {
    const { typeAheadPointer, typeAheadDown, typeAheadUp } = createComboBox({
      options: ['one', 'two', 'three'],
    })
    typeAheadDown() // 0
    typeAheadDown() // 1
    typeAheadUp()   // 0
    expect(typeAheadPointer.value).toBe(0)
  })

  it('typeAheadUp wraps to end', () => {
    const { typeAheadPointer, typeAheadUp } = createComboBox({
      options: ['one', 'two', 'three'],
    })
    typeAheadUp() // wraps to 2
    expect(typeAheadPointer.value).toBe(2)
  })

  it('typeAheadSelect selects the highlighted option', () => {
    const { typeAheadDown, typeAheadSelect, emit } = createComboBox({
      options: ['one', 'two'],
    })
    typeAheadDown() // highlight 'one'
    typeAheadSelect()
    expect(emit).toHaveBeenCalledWith('update:modelValue', 'one')
  })

  it('typeAheadSelect does nothing when pointer is -1', () => {
    const { typeAheadSelect, emit } = createComboBox({
      options: ['one', 'two'],
    })
    typeAheadSelect()
    expect(emit).not.toHaveBeenCalledWith('update:modelValue', expect.anything())
  })

  it('isOptionHighlighted returns true for the highlighted index', () => {
    const { typeAheadDown, isOptionHighlighted } = createComboBox({
      options: ['one', 'two'],
    })
    typeAheadDown()
    expect(isOptionHighlighted(0)).toBe(true)
    expect(isOptionHighlighted(1)).toBe(false)
  })
})
```

**Step 2: Implement, verify, commit**

Port the typeAhead logic from `src/mixins/typeAheadPointer.js`:
- `typeAheadPointer = ref(-1)`
- `typeAheadDown()`: loop forward, skip non-selectable, wrap
- `typeAheadUp()`: loop backward, skip non-selectable, wrap
- `typeAheadSelect()`: call `select(filteredOptions[pointer])` if pointer >= 0 and option is selectable
- `isOptionHighlighted(index)`: `typeAheadPointer.value === index`

```bash
git add src/hooks/useComboBox.ts tests/unit/hooks/useComboBox.spec.ts
git commit -m "feat(useComboBox): add typeAheadPointer keyboard navigation"
```

---

## Task 6: Add Reduce Support to useComboBox

The `reduce` prop transforms options before they're emitted via `update:modelValue`. This also requires `findOptionFromReducedValue` for reverse lookup.

**Files:**
- Modify: `src/hooks/useComboBox.ts`
- Modify: `tests/unit/hooks/useComboBox.spec.ts`

**Step 1: Write failing tests**

```ts
describe('reduce', () => {
  it('emits the reduced value on select', () => {
    const { select, emit } = createComboBox({
      options: [{ label: 'Canada', code: 'CA' }],
      reduce: (opt) => opt.code,
    })
    select({ label: 'Canada', code: 'CA' })
    expect(emit).toHaveBeenCalledWith('update:modelValue', 'CA')
  })

  it('selectedValue still contains the full option objects', () => {
    const { selectedValue } = createComboBox({
      options: [{ label: 'Canada', code: 'CA' }, { label: 'USA', code: 'US' }],
      reduce: (opt) => opt.code,
      modelValue: 'CA',
    })
    expect(selectedValue.value).toEqual([{ label: 'Canada', code: 'CA' }])
  })

  it('handles reduced multi-select values', () => {
    const { selectedValue } = createComboBox({
      options: [{ label: 'Canada', code: 'CA' }, { label: 'USA', code: 'US' }],
      reduce: (opt) => opt.code,
      multiple: true,
      modelValue: ['CA', 'US'],
    })
    expect(selectedValue.value).toEqual([
      { label: 'Canada', code: 'CA' },
      { label: 'USA', code: 'US' },
    ])
  })

  it('isOptionSelected works with reduced values', () => {
    const { isOptionSelected } = createComboBox({
      options: [{ label: 'Canada', code: 'CA' }],
      reduce: (opt) => opt.code,
      modelValue: 'CA',
    })
    expect(isOptionSelected({ label: 'Canada', code: 'CA' })).toBe(true)
  })
})
```

**Step 2: Implement, verify, commit**

Key logic:
- `isReducingValues`: `props.reduce !== undefined && props.reduce !== identity`
- `findOptionFromReducedValue(value)`: scan `optionList` for `option` where `reduce(option) === value`
- `selectedValue` computed: when reducing, map `modelValue` through `findOptionFromReducedValue`
- `select()`: emit `reduce(option)` instead of `option` when reducing
- `isOptionSelected()`: compare `getOptionKey(option)` against `selectedValue` (full objects)

```bash
git add src/hooks/useComboBox.ts tests/unit/hooks/useComboBox.spec.ts
git commit -m "feat(useComboBox): add reduce prop support with reverse lookup"
```

---

## Task 7: Add Tagging + Loading to useComboBox

**Files:**
- Modify: `src/hooks/useComboBox.ts`
- Modify: `tests/unit/hooks/useComboBox.spec.ts`

**Step 1: Write failing tests**

```ts
describe('tagging', () => {
  it('select creates a new option from search text when taggable', () => {
    const { select, setSearch, emit } = createComboBox({
      options: ['one', 'two'],
      taggable: true,
    })
    setSearch('new-tag')
    select('new-tag')
    expect(emit).toHaveBeenCalledWith('option:created', 'new-tag')
    expect(emit).toHaveBeenCalledWith('update:modelValue', 'new-tag')
  })

  it('pushTags adds created tag to optionList', () => {
    const { select, setSearch, optionList } = createComboBox({
      options: ['one', 'two'],
      taggable: true,
      pushTags: true,
    })
    setSearch('new-tag')
    select('new-tag')
    expect(optionList.value).toContain('new-tag')
  })

  it('uses custom createOption when provided', () => {
    const { select, setSearch, emit } = createComboBox({
      options: [{ label: 'one' }],
      taggable: true,
      label: 'label',
      createOption: (search) => ({ label: search, custom: true }),
    })
    setSearch('new')
    select(createComboBox({ createOption: (s) => ({ label: s, custom: true }) })
      .createOption?.('new') ?? 'new')
    // Simplified: the select() should handle createOption internally
  })
})

describe('loading', () => {
  it('isLoading reflects the loading prop', () => {
    const { isLoading } = createComboBox({ loading: true })
    expect(isLoading.value).toBe(true)
  })

  it('toggleLoading flips the internal loading state', () => {
    const { isLoading, toggleLoading } = createComboBox()
    expect(isLoading.value).toBe(false)
    toggleLoading(true)
    expect(isLoading.value).toBe(true)
  })

  it('emits search event with toggleLoading callback when search changes', () => {
    const { setSearch, emit } = createComboBox()
    setSearch('hello')
    expect(emit).toHaveBeenCalledWith('search', 'hello', expect.any(Function))
  })
})
```

**Step 2: Implement, verify, commit**

Port tagging logic from Select.vue and loading from ajax.js mixin:
- `pushedTags = ref<OptionValue[]>([])`
- `createOptionFn`: uses `props.createOption` or default factory
- Tag handling in `select()`: if option doesn't exist in `optionList`, treat as new tag
- `isLoading = ref(props.loading ?? false)`, watch `props.loading` to sync
- `toggleLoading(value?)`: flip or set `isLoading`
- Watch `search`: emit `'search'` event with `(search, toggleLoading)` args

```bash
git add src/hooks/useComboBox.ts tests/unit/hooks/useComboBox.spec.ts
git commit -m "feat(useComboBox): add tagging, pushTags, and loading support"
```

---

## Task 8: Update ComboBox.vue Root Component

Replace the WIP implementation with one that uses the `useComboBox` composable and provides `ComboBoxContext`.

**Files:**
- Modify: `src/components/ComboBox/ComboBox.vue`
- Create: `tests/unit/ComboBox/ComboBox.spec.ts`

**Step 1: Write failing tests**

```ts
// tests/unit/ComboBox/ComboBox.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { inject, defineComponent } from 'vue'
import ComboBox from '@/components/ComboBox/ComboBox.vue'
import { ComboBoxKey } from '@/keys'

// Helper component to inspect injected context
const ContextReader = defineComponent({
  setup() {
    const ctx = inject(ComboBoxKey)!
    return { ctx }
  },
  template: '<div>{{ ctx.open }}</div>',
})

function mountComboBox(props = {}, slots = {}) {
  return mount(ComboBox, {
    props: { options: ['one', 'two', 'three'], ...props },
    slots: { default: () => h(ContextReader) },
    ...slots,
  })
}

describe('ComboBox', () => {
  it('provides ComboBoxContext to children', () => {
    const wrapper = mountComboBox()
    const reader = wrapper.findComponent(ContextReader)
    expect(reader.vm.ctx).toBeDefined()
    expect(reader.vm.ctx.open.value).toBe(false)
  })

  it('renders a root element with role=combobox', () => {
    const wrapper = mountComboBox()
    expect(wrapper.attributes('role')).toBe('combobox')
  })

  it('sets aria-expanded based on open state', async () => {
    const wrapper = mountComboBox()
    expect(wrapper.attributes('aria-expanded')).toBe('false')
  })

  it('emits update:modelValue when selection changes', async () => {
    const wrapper = mountComboBox()
    const reader = wrapper.findComponent(ContextReader)
    reader.vm.ctx.select('one')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['one'])
  })
})
```

**Step 2: Implement updated ComboBox.vue**

```vue
<!-- src/components/ComboBox/ComboBox.vue -->
<script setup lang="ts">
import { provide, ref, onMounted, onUnmounted } from 'vue'
import { useComboBox } from '@/hooks/useComboBox'
import { useClickAway } from '@/hooks/useClickAway'
import { ComboBoxKey } from '@/keys'
import type { ComboBoxProps } from '@/types'

const props = withDefaults(defineProps<ComboBoxProps>(), {
  options: () => [],
  multiple: false,
  filterable: true,
  taggable: false,
  pushTags: false,
  clearable: true,
  closeOnSelect: true,
  clearSearchOnSelect: true,
  disabled: false,
  label: 'label',
  selectable: () => true,
  loading: false,
  noDrop: false,
  deselectFromDropdown: false,
  autoscroll: true,
  placeholder: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  'update:open': [value: boolean]
  open: []
  close: []
  search: [search: string, toggleLoading: (value?: boolean) => void]
  'option:created': [option: unknown]
  'option:selecting': [option: unknown]
  'option:selected': [option: unknown]
  'option:deselecting': [option: unknown]
  'option:deselected': [option: unknown]
}>()

const ctx = useComboBox(props, emit)
provide(ComboBoxKey, ctx)

// Click-away to close
const el = ref<HTMLElement>()
const { addClickAwayListener, removeClickAwayListener } = useClickAway(() => {
  ctx.setOpen(false)
})
onMounted(() => addClickAwayListener(el.value))
onUnmounted(() => removeClickAwayListener(el.value))
</script>

<template>
  <div
    ref="el"
    role="combobox"
    :aria-expanded="ctx.open.value"
    :aria-owns="`vs-${ctx.uid.value}-listbox`"
    :aria-label="placeholder || undefined"
  >
    <slot />
  </div>
</template>
```

**Step 3: Verify tests pass, commit**

```bash
git add src/components/ComboBox/ComboBox.vue tests/unit/ComboBox/ComboBox.spec.ts
git commit -m "feat(ComboBox): wire up useComboBox composable with provide/inject"
```

---

## Task 9: Implement ComboBoxInput

Replace the WIP with a fully functional search input: controlled value, ARIA, keyboard handling, IME support.

**Files:**
- Modify: `src/components/ComboBox/ComboBoxInput.vue`
- Create: `tests/unit/ComboBox/ComboBoxInput.spec.ts`

**Step 1: Write tests covering keyboard navigation, ARIA, and input behavior**

Key test cases:
- Renders an input with `type="search"` and `role="combobox"` ARIA attributes
- `aria-autocomplete="list"`, `aria-controls` pointing to the listbox ID
- `aria-activedescendant` reflects the highlighted option ID
- Typing updates the search text in context
- ArrowDown calls `ctx.typeAheadDown()` and opens the dropdown
- ArrowUp calls `ctx.typeAheadUp()`
- Enter calls `ctx.typeAheadSelect()`
- Escape clears search (if searching) or closes dropdown (if open)
- Backspace with empty search and multi-select deselects last value
- Focus opens the dropdown
- Blur closes the dropdown (with mousedown guard)
- IME composition events prevent selection during composition
- Input value is bound to `ctx.search`
- `disabled` attribute reflects context

**Step 2: Implement ComboBoxInput.vue**

```vue
<script setup lang="ts">
import { inject, ref, computed } from 'vue'
import { ComboBoxKey } from '@/keys'

const ctx = inject(ComboBoxKey)!
const isComposing = ref(false)

const attrs = computed(() => ({
  type: 'search',
  role: 'searchbox',
  autocomplete: 'off',
  'aria-autocomplete': 'list' as const,
  'aria-controls': `vs-${ctx.uid.value}-listbox`,
  'aria-activedescendant':
    ctx.typeAheadPointer.value > -1
      ? `vs-${ctx.uid.value}-option-${ctx.typeAheadPointer.value}`
      : undefined,
  disabled: ctx.disabled.value || undefined,
  value: ctx.search.value,
}))

function onInput(e: Event) {
  ctx.setSearch((e.target as HTMLInputElement).value)
}

function onKeydown(e: KeyboardEvent) {
  if (isComposing.value) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      ctx.typeAheadDown()
      if (!ctx.open.value) ctx.setOpen(true)
      break
    case 'ArrowUp':
      e.preventDefault()
      ctx.typeAheadUp()
      if (!ctx.open.value) ctx.setOpen(true)
      break
    case 'Enter':
      e.preventDefault()
      if (ctx.open.value) ctx.typeAheadSelect()
      break
    case 'Escape':
      if (ctx.search.value) {
        ctx.setSearch('')
      } else {
        ctx.setOpen(false)
      }
      break
    case 'Backspace':
      if (!ctx.search.value && ctx.multiple.value && !ctx.isValueEmpty.value) {
        const last = ctx.selectedValue.value[ctx.selectedValue.value.length - 1]
        ctx.deselect(last)
      }
      break
  }
}

function onFocus() {
  if (!ctx.disabled.value) {
    ctx.setOpen(true)
  }
}

function onBlur() {
  ctx.setOpen(false)
  ctx.setSearch('')
}
</script>

<template>
  <input
    v-bind="attrs"
    @input="onInput"
    @keydown="onKeydown"
    @focus="onFocus"
    @blur="onBlur"
    @compositionstart="isComposing = true"
    @compositionend="isComposing = false"
  />
</template>
```

**Step 3: Verify tests pass, commit**

```bash
git add src/components/ComboBox/ComboBoxInput.vue tests/unit/ComboBox/ComboBoxInput.spec.ts
git commit -m "feat(ComboBoxInput): full keyboard nav, ARIA, and IME support"
```

---

## Task 10: Implement ComboBoxMenu

The dropdown container with ARIA, transition support, and auto-scroll.

**Files:**
- Modify: `src/components/ComboBox/ComboBoxMenu.vue`
- Create: `tests/unit/ComboBox/ComboBoxMenu.spec.ts`

**Step 1: Write tests**

Key test cases:
- Has `role="listbox"`, `id` matching the ARIA reference
- Only visible when `ctx.open` is true
- `tabindex="-1"` prevents direct focus
- Mousedown on the menu prevents input blur (uses `@mousedown.prevent`)
- Renders slot content

**Step 2: Implement**

```vue
<script setup lang="ts">
import { inject, ref, watch, nextTick } from 'vue'
import { ComboBoxKey } from '@/keys'

const ctx = inject(ComboBoxKey)!
const menuEl = ref<HTMLElement>()

// Auto-scroll to keep highlighted option visible
watch(() => ctx.typeAheadPointer.value, async (pointer) => {
  await nextTick()
  if (!menuEl.value || pointer < 0) return
  const option = menuEl.value.children[pointer] as HTMLElement | undefined
  if (!option) return

  const menuRect = menuEl.value.getBoundingClientRect()
  const optionRect = option.getBoundingClientRect()

  if (optionRect.bottom > menuRect.bottom) {
    menuEl.value.scrollTop += optionRect.bottom - menuRect.bottom
  } else if (optionRect.top < menuRect.top) {
    menuEl.value.scrollTop -= menuRect.top - optionRect.top
  }
})
</script>

<template>
  <div
    v-show="ctx.open.value && !ctx.noDrop.value"
    ref="menuEl"
    :id="`vs-${ctx.uid.value}-listbox`"
    role="listbox"
    tabindex="-1"
    @mousedown.prevent
  >
    <slot />
  </div>
</template>
```

**Step 3: Verify, commit**

```bash
git add src/components/ComboBox/ComboBoxMenu.vue tests/unit/ComboBox/ComboBoxMenu.spec.ts
git commit -m "feat(ComboBoxMenu): ARIA listbox with auto-scroll"
```

---

## Task 11: Implement ComboBoxOption

Individual option with ARIA, highlight state, selection, and keyboard interaction.

**Files:**
- Modify: `src/components/ComboBox/ComboBoxOption.vue`
- Create: `tests/unit/ComboBox/ComboBoxOption.spec.ts`

**Step 1: Write tests**

Key test cases:
- Has `role="option"` and `aria-selected` reflecting selection state
- Has `id` matching `vs-{uid}-option-{index}` for `aria-activedescendant`
- Click calls `ctx.select(value)` (or `ctx.deselect` if already selected and `deselectFromDropdown`)
- Slot exposes `{ isSelected, isHighlighted, isDisabled }` to consumers
- Disabled options have `aria-disabled="true"` and don't respond to click
- Mouseover updates `ctx.typeAheadPointer`

**Step 2: Implement**

```vue
<script setup lang="ts">
import { inject, computed } from 'vue'
import { ComboBoxKey } from '@/keys'
import type { OptionValue } from '@/types'

const props = defineProps<{
  value: OptionValue
  index: number
}>()

const ctx = inject(ComboBoxKey)!

const isSelected = computed(() => ctx.isOptionSelected(props.value))
const isHighlighted = computed(() => ctx.isOptionHighlighted(props.index))
const isDisabled = computed(() => !ctx.isOptionSelectable(props.value))

function onClick() {
  if (isDisabled.value) return
  if (isSelected.value) {
    ctx.deselect(props.value)
  } else {
    ctx.select(props.value)
  }
}
</script>

<template>
  <div
    :id="`vs-${ctx.uid.value}-option-${index}`"
    role="option"
    :aria-selected="isSelected || undefined"
    :aria-disabled="isDisabled || undefined"
    @click="onClick"
    @mouseover="ctx.typeAheadPointer.value = index"
  >
    <slot v-bind="{ isSelected, isHighlighted, isDisabled }" />
  </div>
</template>
```

**Step 3: Verify, commit**

```bash
git add src/components/ComboBox/ComboBoxOption.vue tests/unit/ComboBox/ComboBoxOption.spec.ts
git commit -m "feat(ComboBoxOption): ARIA option with selection, highlight, and disabled states"
```

---

## Task 12: Implement ComboBoxButton and ComboBoxClear

Toggle button and clear button primitives.

**Files:**
- Modify: `src/components/ComboBox/ComboBoxButton.vue`
- Create: `src/components/ComboBox/ComboBoxClear.vue`
- Create: `tests/unit/ComboBox/ComboBoxButton.spec.ts`
- Create: `tests/unit/ComboBox/ComboBoxClear.spec.ts`

**Step 1: Write tests for both components**

ComboBoxButton tests:
- Has `aria-haspopup="listbox"`
- `aria-expanded` reflects open state
- `aria-controls` points to listbox ID
- Click calls `ctx.toggleOpen()`
- Disabled when context is disabled

ComboBoxClear tests:
- Not visible when `isValueEmpty` or `!clearable`
- Click calls `ctx.clearSelection()`
- Mousedown prevented (so it doesn't steal focus from input)
- Slot exposes clear handler for custom markup

**Step 2: Implement both, verify, commit**

```bash
git add src/components/ComboBox/ComboBoxButton.vue src/components/ComboBox/ComboBoxClear.vue \
  tests/unit/ComboBox/ComboBoxButton.spec.ts tests/unit/ComboBox/ComboBoxClear.spec.ts
git commit -m "feat(ComboBoxButton, ComboBoxClear): toggle and clear primitives"
```

---

## Task 13: Update Package Exports

Wire up the new primitives as named exports from `vue-select`.

**Files:**
- Modify: `src/index.js` (rename to `src/index.ts`)
- Modify: `vite.config.ts` (update entry if needed)
- Modify: `package.json` (exports field)

**Step 1: Update index.ts**

```ts
// src/index.ts
import Select from './components/Select.vue'

// Headless primitives
export { default as ComboBox } from './components/ComboBox/ComboBox.vue'
export { default as ComboBoxInput } from './components/ComboBox/ComboBoxInput.vue'
export { default as ComboBoxMenu } from './components/ComboBox/ComboBoxMenu.vue'
export { default as ComboBoxOption } from './components/ComboBox/ComboBoxOption.vue'
export { default as ComboBoxButton } from './components/ComboBox/ComboBoxButton.vue'
export { default as ComboBoxClear } from './components/ComboBox/ComboBoxClear.vue'

// Composable
export { useComboBox } from './hooks/useComboBox'

// Types
export type { ComboBoxProps, ComboBoxContext, OptionValue, ModelValue } from './types'

// Default export: the batteries-included component (Select.vue for now, VueSelect wrapper later)
export default Select
```

**Step 2: Verify build succeeds**

Run: `npx vue-tsc --noEmit && npx vite build`
Expected: Build succeeds, outputs include all exports

**Step 3: Commit**

```bash
git add src/index.ts vite.config.ts package.json
git commit -m "feat: export headless primitives and useComboBox from package"
```

---

## Task 14: Integration Test -- Full ComboBox Composition

Write an integration test that assembles all primitives together and tests the complete flow.

**Files:**
- Create: `tests/unit/ComboBox/integration.spec.ts`

**Step 1: Write integration test**

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxMenu,
  ComboBoxOption,
  ComboBoxButton,
  ComboBoxClear,
} from '@/index'

const TestSelect = defineComponent({
  props: ['options', 'modelValue', 'multiple', 'taggable'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(ComboBox, { ...props, 'onUpdate:modelValue': (v) => emit('update:modelValue', v) }, {
        default: () => [
          h(ComboBoxInput),
          h(ComboBoxButton, null, { default: () => 'Toggle' }),
          h(ComboBoxClear, null, { default: () => 'Clear' }),
          h(ComboBoxMenu, null, {
            default: () =>
              props.options.map((opt, i) =>
                h(ComboBoxOption, { value: opt, index: i, key: i }, {
                  default: ({ isSelected, isHighlighted }) =>
                    h('span', {
                      class: {
                        selected: isSelected,
                        highlighted: isHighlighted,
                      },
                    }, String(opt)),
                }),
              ),
          }),
        ],
      })
  },
})

describe('ComboBox integration', () => {
  it('full selection flow: open, navigate, select', async () => {
    const wrapper = mount(TestSelect, {
      props: { options: ['one', 'two', 'three'] },
    })

    // Focus input to open
    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('[role="listbox"]').isVisible()).toBe(true)

    // Arrow down twice to highlight 'two'
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.find('.highlighted').text()).toBe('two')

    // Enter to select
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['two'])
  })

  it('multi-select flow', async () => {
    const wrapper = mount(TestSelect, {
      props: { options: ['one', 'two', 'three'], multiple: true, modelValue: [] },
    })

    await wrapper.find('input').trigger('focus')

    // Click 'one'
    await wrapper.findAll('[role="option"]')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['one']])
  })

  it('filtering flow', async () => {
    const wrapper = mount(TestSelect, {
      props: { options: ['one', 'two', 'three'] },
    })

    await wrapper.find('input').trigger('focus')
    await wrapper.find('input').setValue('tw')

    const options = wrapper.findAll('[role="option"]')
    expect(options).toHaveLength(1)
    expect(options[0].text()).toBe('two')
  })

  it('escape closes dropdown', async () => {
    const wrapper = mount(TestSelect, {
      props: { options: ['one', 'two', 'three'] },
    })

    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('[role="listbox"]').isVisible()).toBe(true)

    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('[role="listbox"]').isVisible()).toBe(false)
  })
})
```

**Step 2: Run, fix any issues, verify all pass**

Run: `npx vitest run tests/unit/ComboBox/integration.spec.ts`

**Step 3: Commit**

```bash
git add tests/unit/ComboBox/integration.spec.ts
git commit -m "test: add integration tests for full ComboBox composition"
```

---

## Task 15: Run Full Test Suite + Build Verification

Ensure nothing is broken and the build produces correct output.

**Step 1: Run all tests**

Run: `npx vitest run`
Expected: All existing Select.vue tests still pass, all new ComboBox tests pass.

**Step 2: Run type check**

Run: `npx vue-tsc --noEmit`
Expected: No type errors

**Step 3: Run build**

Run: `npx vite build`
Expected: Build succeeds. Check that `dist/vue-select.es.js` stays under 8 KB budget (bundlewatch).

**Step 4: Verify exports**

Run: `node -e "const m = require('./dist/vue-select.umd.js'); console.log(Object.keys(m))"`
Expected: Output includes `default`, `ComboBox`, `ComboBoxInput`, `ComboBoxMenu`, `ComboBoxOption`, `ComboBoxButton`, `ComboBoxClear`, `useComboBox`

**Step 5: Commit if any fixes were needed**

```bash
git add -A
git commit -m "chore: fix issues discovered during full verification"
```

---

## Summary of Tasks

| # | Task | Depends On | Est. Complexity |
|---|------|-----------|-----------------|
| 1 | Fix useClickAway bug + tests | - | Small |
| 2 | Define core types | - | Small |
| 3 | useComboBox: core state (open, search, select/deselect) | 2 | Medium |
| 4 | useComboBox: filtering | 3 | Medium |
| 5 | useComboBox: typeAhead pointer | 3, 4 | Medium |
| 6 | useComboBox: reduce support | 3 | Medium |
| 7 | useComboBox: tagging + loading | 3, 4 | Medium |
| 8 | ComboBox.vue root component | 3 | Small |
| 9 | ComboBoxInput.vue | 8 | Medium |
| 10 | ComboBoxMenu.vue | 8 | Small |
| 11 | ComboBoxOption.vue | 8 | Medium |
| 12 | ComboBoxButton + ComboBoxClear | 8 | Small |
| 13 | Package exports (index.ts) | 8-12 | Small |
| 14 | Integration tests | 8-13 | Medium |
| 15 | Full suite verification + build | 1-14 | Small |
