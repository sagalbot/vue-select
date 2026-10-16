<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import { useComboBoxContext } from '../../keys'
import type { KeydownHandlers } from '../../types'

defineOptions({ inheritAttrs: false })
defineSlots<{
  /** Content of the select-only element (`searchable: false`). */
  default?: () => unknown
  /** Render your own input: bind `attributes` and `events` (`v-bind`/`v-on`). */
  input?: (props: {
    attributes: Record<string, unknown>
    events: Record<string, (e: Event) => void>
  }) => unknown
}>()

const ctx = useComboBoxContext('ComboBoxInput')
const attrs = useAttrs()
const isComposing = ref(false)

const ariaAttrs = computed(() => ({
  role: 'combobox',
  'aria-expanded': ctx.open.value,
  'aria-controls': `vs-${ctx.uid.value}-listbox`,
  // Only while open: a closed listbox has no active option
  'aria-activedescendant':
    ctx.open.value && ctx.typeAheadPointer.value > -1
      ? `vs-${ctx.uid.value}-option-${ctx.typeAheadPointer.value}`
      : undefined,
}))

// Defaults that attributes passed to ComboBoxInput (e.g. VueSelect's
// inputAttrs) may override.
const inputDefaults = computed(() => ({
  type: 'search',
  autocomplete: 'off',
  // Like v3: the selection takes the placeholder's place
  placeholder: (ctx.isValueEmpty.value && ctx.placeholder.value) || undefined,
}))

// State the combobox owns; attributes can't override these.
const inputAttrs = computed(() => ({
  ...ariaAttrs.value,
  'aria-autocomplete': 'list' as const,
  disabled: ctx.disabled.value || undefined,
  value: ctx.search.value,
}))

// Select-only combobox (WAI-ARIA APG): focusable, not editable.
const selectOnlyDefaults = computed(() => ({
  tabindex: ctx.disabled.value ? -1 : 0,
}))
const selectOnlyAttrs = computed(() => ({
  ...ariaAttrs.value,
  'aria-disabled': ctx.disabled.value || undefined,
}))

/** Register the rendered element so the context can focus it. */
function setEl(el: unknown) {
  ctx.inputEl.value = (el as HTMLElement | null) ?? null
}

const ownEvents: Record<string, (e: Event) => void> = {
  input: (e) => onInput(e),
  focus: () => onFocus(),
  keydown: (e) => onKeydown(e as KeyboardEvent),
  click: () => onClick(),
  blur: () => onBlur(),
  compositionstart: () => (isComposing.value = true),
  compositionend: () => (isComposing.value = false),
}

// For the input slot: our attributes and handlers, merged with whatever
// was passed to ComboBoxInput (`id`, `class`, `@focus`, ...).
const slotProps = computed(() => {
  const attributes: Record<string, unknown> = { ...inputDefaults.value }
  const events = { ...ownEvents }
  for (const [key, value] of Object.entries(attrs)) {
    const match = /^on([A-Z].*)$/.exec(key)
    if (!match || typeof value !== 'function') {
      attributes[key] = value
      continue
    }
    const name = match[1][0].toLowerCase() + match[1].slice(1)
    const own = events[name]
    events[name] = own
      ? (e: Event) => {
          own(e)
          ;(value as (e: Event) => void)(e)
        }
      : (value as (e: Event) => void)
  }
  Object.assign(attributes, inputAttrs.value, { ref: setEl })
  return { attributes, events }
})

function onInput(e: Event) {
  ctx.setSearch((e.target as HTMLInputElement).value)
}

/** Open if closed, otherwise run `whenOpen`. */
function openOr(whenOpen: () => void) {
  return (e: KeyboardEvent) => {
    e.preventDefault()
    if (ctx.open.value) whenOpen()
    else ctx.setOpen(true)
  }
}

/**
 * Open a closed dropdown. Opening highlights the selected option; with
 * nothing selected, highlight `fallback` (unless Alt is held, which opens
 * without moving the highlight).
 */
function openThen(e: KeyboardEvent, fallback: () => void) {
  ctx.setOpen(true)
  if (!e.altKey && ctx.typeAheadPointer.value === -1) fallback()
}

// Editable combobox, following the WAI-ARIA APG "List Autocomplete" example.
const searchHandlers: KeydownHandlers = {
  ArrowDown: (e) => {
    e.preventDefault()
    if (ctx.open.value) ctx.typeAheadDown()
    else openThen(e, ctx.typeAheadFirst)
  },
  ArrowUp: (e) => {
    e.preventDefault()
    if (ctx.open.value) ctx.typeAheadUp()
    else openThen(e, ctx.typeAheadLast)
  },
  Enter: (e) => {
    if (!ctx.open.value) {
      // A closed tagging input (e.g. :open="false") still creates the tag;
      // otherwise Enter does its default, such as submitting the form.
      if (ctx.taggable.value && ctx.isSearching.value) {
        e.preventDefault()
        ctx.typeAheadSelect()
      }
      return
    }
    e.preventDefault()
    if (ctx.typeAheadPointer.value > -1) ctx.typeAheadSelect()
    else ctx.setOpen(false)
  },
  // Close first; once closed, clear the search text. preventDefault stops
  // browsers from also clearing a type="search" input on the first press.
  Escape: (e) => {
    if (ctx.open.value) {
      e.preventDefault()
      ctx.setOpen(false)
    } else if (ctx.isSearching.value) {
      e.preventDefault()
      ctx.setSearch('')
    }
  },
  Backspace: () => {
    if (!ctx.search.value && !ctx.isValueEmpty.value && ctx.clearable.value) {
      const last = ctx.selectedValue.value[ctx.selectedValue.value.length - 1]
      ctx.deselect(last)
    }
  },
  // Space on an empty, closed input opens the dropdown instead of typing
  // (#1735). With search text it types a space, e.g. in "New York".
  ' ': (e) => {
    if (ctx.open.value || ctx.isSearching.value) return
    e.preventDefault()
    ctx.setOpen(true)
  },
}

/** Move the highlight `steps` options without wrapping. */
function step(steps: number, down: boolean) {
  for (let i = 0; i < steps; i++) {
    if (down) ctx.typeAheadDown(false)
    else ctx.typeAheadUp(false)
  }
}

const PAGE_SIZE = 10

// Select-only combobox, following the WAI-ARIA APG "Select-Only" example.
// The highlight does not wrap at the ends.
const selectOnlyHandlers: KeydownHandlers = {
  ArrowDown: openOr(() => ctx.typeAheadDown(false)),
  ArrowUp: (e) => {
    e.preventDefault()
    if (!ctx.open.value) {
      ctx.setOpen(true)
      ctx.typeAheadFirst()
    } else if (e.altKey) {
      ctx.typeAheadSelect()
      ctx.setOpen(false)
    } else {
      ctx.typeAheadUp(false)
    }
  },
  Home: (e) => {
    e.preventDefault()
    ctx.setOpen(true)
    ctx.typeAheadFirst()
  },
  End: (e) => {
    e.preventDefault()
    ctx.setOpen(true)
    ctx.typeAheadLast()
  },
  PageDown: (e) => {
    if (!ctx.open.value) return
    e.preventDefault()
    step(PAGE_SIZE, true)
  },
  PageUp: (e) => {
    if (!ctx.open.value) return
    e.preventDefault()
    step(PAGE_SIZE, false)
  },
  Enter: openOr(() => ctx.typeAheadSelect()),
  ' ': openOr(() => ctx.typeAheadSelect()),
  // Select the highlighted option and let focus move on
  Tab: () => {
    if (ctx.open.value) ctx.typeAheadSelect()
  },
  Escape: () => ctx.setOpen(false),
}

// Type-to-highlight for select-only mode: characters typed within
// TYPEAHEAD_RESET_MS of each other build up a prefix to match. Repeating
// one character cycles through the options starting with it.
const TYPEAHEAD_RESET_MS = 500
let typed = ''
let lastTypedAt = 0

function highlightByTypedText(char: string) {
  const now = Date.now()
  typed = now - lastTypedAt > TYPEAHEAD_RESET_MS ? char : typed + char
  lastTypedAt = now

  const repeated = [...typed].every((c) => c === typed[0])
  const prefix = (repeated ? typed[0] : typed).toLocaleLowerCase()
  // A single (or repeated) character searches after the highlighted
  // option; a longer prefix re-checks the highlighted option first.
  const pointer = ctx.typeAheadPointer.value
  const start = repeated ? pointer + 1 : Math.max(pointer, 0)

  const options = ctx.filteredOptions.value
  for (let i = 0; i < options.length; i++) {
    const index = (start + i) % options.length
    const option = options[index]
    if (
      ctx.isOptionSelectable(option) &&
      ctx.getOptionLabel(option).toLocaleLowerCase().startsWith(prefix)
    ) {
      if (!ctx.open.value) ctx.setOpen(true)
      ctx.typeAheadPointer.value = index
      return
    }
  }
}

function onKeydown(e: KeyboardEvent) {
  if (isComposing.value) return

  const searchable = ctx.searchable.value
  const handler = ctx.mapKeydown(searchable ? searchHandlers : selectOnlyHandlers)[e.key]
  if (handler) return handler(e)

  if (!searchable && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    highlightByTypedText(e.key)
  }
}

// By default neither focus nor a click opens the editable dropdown: typing,
// Down Arrow or the toggle button do (WAI-ARIA APG; opening on Tab also
// interrupts screen readers announcing the field). `openOnFocus` opts in.
// The select-only element is the control itself, so a click toggles it.
function onFocus() {
  if (ctx.openOnFocus.value) ctx.setOpen(true)
}

function onClick() {
  if (!ctx.searchable.value) ctx.toggleOpen()
  else if (ctx.openOnFocus.value) ctx.setOpen(true)
}

function onBlur() {
  ctx.setOpen(false)
  if (ctx.searchable.value && ctx.clearSearchOnBlur.value) ctx.setSearch('')
}
</script>

<template>
  <slot
    v-if="ctx.searchable.value && $slots.input"
    name="input"
    v-bind="slotProps"
  />
  <input
    v-else-if="ctx.searchable.value"
    :ref="setEl"
    v-bind="{ ...inputDefaults, ...$attrs, ...inputAttrs }"
    @input="onInput"
    @keydown="onKeydown"
    @focus="onFocus"
    @click="onClick"
    @blur="onBlur"
    @compositionstart="isComposing = true"
    @compositionend="isComposing = false"
  />
  <div
    v-else
    :ref="setEl"
    v-bind="{ ...selectOnlyDefaults, ...$attrs, ...selectOnlyAttrs }"
    @keydown="onKeydown"
    @focus="onFocus"
    @click="onClick"
    @blur="onBlur"
  >
    <slot />
  </div>
</template>
