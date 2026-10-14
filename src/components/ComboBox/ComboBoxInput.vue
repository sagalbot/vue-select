<script setup lang="ts">
import { inject, ref, computed, useAttrs } from 'vue'
import { ComboBoxKey } from '@/keys'
import type { KeydownHandlers } from '@/types'

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

const ctx = inject(ComboBoxKey)
if (!ctx) throw new Error('ComboBoxInput must be used inside a ComboBox component')
const attrs = useAttrs()
const isComposing = ref(false)

const ariaAttrs = computed(() => ({
  role: 'combobox',
  'aria-expanded': String(ctx.open.value),
  'aria-controls': `vs-${ctx.uid.value}-listbox`,
  'aria-activedescendant':
    ctx.typeAheadPointer.value > -1
      ? `vs-${ctx.uid.value}-option-${ctx.typeAheadPointer.value}`
      : undefined,
}))

const inputAttrs = computed(() => ({
  ...ariaAttrs.value,
  type: 'search',
  autocomplete: 'off',
  'aria-autocomplete': 'list' as const,
  disabled: ctx.disabled.value || undefined,
  value: ctx.search.value,
  // Like v3: the selection takes the placeholder's place
  placeholder: (ctx.isValueEmpty.value && ctx.placeholder.value) || undefined,
}))

// Select-only combobox (WAI-ARIA APG): focusable, not editable.
const selectOnlyAttrs = computed(() => ({
  ...ariaAttrs.value,
  tabindex: ctx.disabled.value ? -1 : 0,
  'aria-disabled': ctx.disabled.value || undefined,
}))

const ownEvents: Record<string, (e: Event) => void> = {
  input: (e) => onInput(e),
  keydown: (e) => onKeydown(e as KeyboardEvent),
  focus: () => onFocus(),
  blur: () => onBlur(),
  compositionstart: () => (isComposing.value = true),
  compositionend: () => (isComposing.value = false),
}

// For the input slot: our attributes and handlers, merged with whatever
// was passed to ComboBoxInput (`id`, `class`, `@focus`, ...).
const slotProps = computed(() => {
  const attributes: Record<string, unknown> = { ...inputAttrs.value }
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

const searchHandlers: KeydownHandlers = {
  // On a closed dropdown, arrows only open it (the highlight goes to the
  // selected option); the next press moves.
  ArrowDown: openOr(() => ctx.typeAheadDown()),
  ArrowUp: openOr(() => ctx.typeAheadUp()),
  Enter: (e) => {
    e.preventDefault()
    if (ctx.open.value) ctx.typeAheadSelect()
  },
  Escape: () => {
    if (ctx.isSearching.value) ctx.setSearch('')
    else ctx.setOpen(false)
  },
  Backspace: () => {
    if (!ctx.search.value && !ctx.isValueEmpty.value && ctx.clearable.value) {
      const last = ctx.selectedValue.value[ctx.selectedValue.value.length - 1]
      ctx.deselect(last)
    }
  },
  // Space opens a closed dropdown instead of typing (#1735)
  ' ': (e) => {
    if (ctx.open.value) return
    e.preventDefault()
    ctx.setOpen(true)
  },
}

const selectOnlyHandlers: KeydownHandlers = {
  ArrowDown: searchHandlers.ArrowDown,
  ArrowUp: searchHandlers.ArrowUp,
  Enter: openOr(() => ctx.typeAheadSelect()),
  ' ': openOr(() => ctx.typeAheadSelect()),
  Escape: () => ctx.setOpen(false),
}

// Type-to-highlight for select-only mode: typed characters within
// TYPEAHEAD_RESET_MS of each other build up a prefix to match.
const TYPEAHEAD_RESET_MS = 500
let typed = ''
let lastTypedAt = 0

function highlightByTypedText(char: string) {
  const now = Date.now()
  typed = now - lastTypedAt > TYPEAHEAD_RESET_MS ? char : typed + char
  lastTypedAt = now

  const options = ctx.filteredOptions.value
  const prefix = typed.toLocaleLowerCase()
  // A new prefix searches after the highlighted option; a longer one
  // re-checks the highlighted option first.
  const start = typed.length === 1 ? ctx.typeAheadPointer.value + 1 : Math.max(ctx.typeAheadPointer.value, 0)

  for (let i = 0; i < options.length; i++) {
    const index = (start + i) % options.length
    const option = options[index]
    if (
      ctx.isOptionSelectable(option) &&
      ctx.getOptionLabel(option).toLocaleLowerCase().startsWith(prefix)
    ) {
      ctx.typeAheadPointer.value = index
      if (!ctx.open.value) ctx.setOpen(true)
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

function onFocus() {
  if (ctx.searchable.value) ctx.setOpen(true)
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
    v-bind="{ ...$attrs, ...inputAttrs }"
    @input="onInput"
    @keydown="onKeydown"
    @focus="onFocus"
    @blur="onBlur"
    @compositionstart="isComposing = true"
    @compositionend="isComposing = false"
  />
  <div
    v-else
    v-bind="{ ...$attrs, ...selectOnlyAttrs }"
    @keydown="onKeydown"
    @blur="onBlur"
  >
    <slot />
  </div>
</template>
