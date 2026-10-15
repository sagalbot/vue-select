import { ref, shallowRef, computed, watch, getCurrentInstance, useId } from 'vue'
import type {
  ComboBoxProps,
  ComboBoxContext,
  KeydownHandlers,
  OptionGroup,
  ModelValue,
  OptionKey,
  OptionValue,
} from '@/types'
import sortAndStringify from '@/utility/sortAndStringify'

// Fallback for calls outside a component (e.g. unit tests), where useId() is unavailable.
let uidCounter = 0

export function useComboBox(
  props: ComboBoxProps,
  emit: (event: string, ...args: unknown[]) => void
): ComboBoxContext {
  // --- State ---

  // Uncontrolled open state; ignored while the `open` prop is bound.
  const internalOpen = ref(false)
  const isOpenControlled = () => props.open !== undefined
  const open = computed(() =>
    isOpenControlled() ? Boolean(props.open) : internalOpen.value
  )
  const search = ref('')
  const typeAheadPointer = ref(-1)
  const isLoading = ref(props.loading ?? false)

  // Selection when no v-model is bound (modelValue undefined)
  const internalValue = ref<ModelValue>(null)
  const currentValue = computed<ModelValue | undefined>(() =>
    props.modelValue !== undefined ? props.modelValue : internalValue.value
  )
  watch(
    () => props.modelValue,
    (value, old) => {
      if (value === undefined && old !== undefined) internalValue.value = null
    }
  )

  function updateValue(value: unknown) {
    if (props.modelValue === undefined) internalValue.value = value as ModelValue
    emit('update:modelValue', value)
  }

  // Full option objects for reduced values, so a selection keeps its label
  // after the option leaves `options` (e.g. AJAX search results change).
  const knownOptions = new Map<string, OptionValue>()

  // useId() matches between server render and hydration
  const stableUid = getCurrentInstance() ? useId() : String(++uidCounter)

  // A bound `open` prop is the source of truth: report its changes.
  watch(() => props.open, (val, old) => {
    if (val === undefined || old === undefined || val === old) return
    emit(val ? 'open' : 'close')
  })

  // Sync loading prop
  watch(() => props.loading, (val) => {
    if (val !== undefined) isLoading.value = val
  })

  // --- Computed ---

  const selectedValue = computed<OptionValue[]>(() => {
    const v = currentValue.value
    const values = Array.isArray(v) ? v : v != null && v !== '' ? [v] : []

    // With reduce, null can be a real value: an option that reduces to null
    if (props.reduce && v === null) {
      const option = findOptionFromReducedValue(null)
      if (option !== undefined) return [option]
    }

    if (!props.reduce) return values as OptionValue[]

    // When reduce is in use, modelValue contains reduced values.
    // Map them back to full option objects.
    return values.map((val) => {
      const key = JSON.stringify(val)
      const option = findOptionFromReducedValue(val) ?? knownOptions.get(key)
      if (option === undefined) return val as OptionValue
      knownOptions.set(key, option)
      return option
    })
  })

  const isValueEmpty = computed(() => selectedValue.value.length === 0)
  const isSearching = computed(() => search.value.length > 0)
  const disabled = computed(() => props.disabled ?? false)
  const multiple = computed(() => props.multiple ?? false)
  const filterable = computed(() => props.filterable ?? true)
  const searchable = computed(() => props.searchable ?? true)
  const openOnFocus = computed(() => props.openOnFocus ?? false)
  const inputEl = shallowRef<HTMLElement | null>(null)

  function focusInput() {
    inputEl.value?.focus()
  }
  const clearSearchOnBlur = computed(
    () =>
      props.clearSearchOnBlur ??
      (props.clearSearchOnSelect !== false && !props.multiple)
  )
  const clearable = computed(() => props.clearable ?? true)
  const taggable = computed(() => props.taggable ?? false)
  const placeholder = computed(() => props.placeholder ?? '')
  const uid = computed(() => props.uid ?? stableUid)
  const deselectFromDropdown = computed(() => props.deselectFromDropdown ?? false)
  const autoscroll = computed(() => props.autoscroll ?? true)

  // --- Option helpers ---

  function getOptionLabel(option: OptionValue): string {
    if (props.getOptionLabel) return props.getOptionLabel(option)
    if (typeof option === 'object' && option !== null) {
      const key = props.label ?? 'label'
      if (!(key in option)) {
        console.warn(
          `[vue-select warn]: Label key "option.${key}" does not exist in ` +
            `options object ${JSON.stringify(option)}.\n` +
            'https://vue-select.org/api/props.html#getoptionlabel'
        )
        return ''
      }
      return String((option as Record<string, unknown>)[key] ?? '')
    }
    return String(option)
  }

  function getOptionKey(option: OptionValue): OptionKey {
    if (props.getOptionKey) return props.getOptionKey(option)
    if (typeof option !== 'object' || option === null) return option
    if ('id' in option) return option.id as OptionKey

    try {
      return sortAndStringify(option)
    } catch (e) {
      console.warn(
        '[vue-select warn]: Could not stringify this option to generate a ' +
          "unique key. Provide a 'getOptionKey' prop that returns a unique " +
          'key for each option.',
        option,
        e
      )
      return ''
    }
  }

  function isOptionSelected(option: OptionValue): boolean {
    return selectedValue.value.some(
      (selected) => getOptionKey(selected) === getOptionKey(option)
    )
  }

  function isOptionSelectable(option: OptionValue): boolean {
    return props.selectable ? props.selectable(option) : true
  }

  function isOptionHighlighted(index: number): boolean {
    return typeAheadPointer.value === index
  }

  // --- Tagging helpers ---

  /**
   * Checks if the option is a new tag candidate — i.e., its key doesn't exist
   * in props.options.
   */
  function isNewTagCandidate(option: OptionValue): boolean {
    const opts = props.options ?? []
    const optKey = getOptionKey(option)
    return !opts.some((o) => getOptionKey(o) === optKey)
  }

  // --- Filtering helpers ---

  function defaultFilterBy(label: string, search: string): boolean {
    return label.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  }

  // Match the shape of existing options, as v3 does
  function defaultCreateOption(text: string): OptionValue {
    const first = props.options?.[0]
    return typeof first === 'object' && first !== null
      ? { [props.label ?? 'label']: text }
      : text
  }

  function maybeAddTaggableOption(options: OptionValue[]): OptionValue[] {
    if (!taggable.value || !search.value) return options

    // Create the tag option. createOption can throw to reject the text
    // (e.g. validation), in which case no tag is offered.
    let tagOption: OptionValue
    try {
      tagOption = props.createOption
        ? props.createOption(search.value)
        : defaultCreateOption(search.value)
    } catch {
      return options
    }

    // Don't add if an option with the same key already exists
    const tagKey = getOptionKey(tagOption)
    const alreadyExists = options.some((o) => getOptionKey(o) === tagKey)

    if (alreadyExists) return options
    return [tagOption, ...options]
  }

  // --- Filtering computeds ---

  const optionList = computed<OptionValue[]>(() => [
    ...(props.options ?? []),
  ])

  const matchingOptions = computed<OptionValue[]>(() => {
    const opts = optionList.value

    // As in v3: tagging filters even when filterable is false, and filter
    // functions only run while there is search text.
    if ((!filterable.value && !taggable.value) || !search.value) {
      return maybeAddTaggableOption(opts)
    }

    const filtered = props.filter
      ? props.filter(opts, search.value)
      : opts.filter((option) => defaultFilterBy(getOptionLabel(option), search.value))

    return maybeAddTaggableOption(filtered)
  })

  const groupedOptions = computed<OptionGroup[]>(() => {
    const opts =
      props.hideSelected && multiple.value
        ? matchingOptions.value.filter((option) => !isOptionSelected(option))
        : matchingOptions.value
    const ungrouped: OptionValue[] = []
    const groups = new Map<string, OptionValue[]>()

    for (const option of opts) {
      // New tags stay ungrouped so they remain at the top
      const label =
        props.groupBy && !(taggable.value && isNewTagCandidate(option))
          ? props.groupBy(option)
          : null
      if (!label) {
        ungrouped.push(option)
      } else {
        if (!groups.has(label)) groups.set(label, [])
        groups.get(label)!.push(option)
      }
    }

    let index = 0
    const number = (options: OptionValue[]) =>
      options.map((option) => ({ option, index: index++ }))

    const result: OptionGroup[] = []
    if (ungrouped.length) result.push({ label: null, options: number(ungrouped) })
    for (const [label, options] of groups) {
      result.push({ label, options: number(options) })
    }
    return result
  })

  // Options in rendered order: keyboard navigation and option indices follow it.
  const filteredOptions = computed<OptionValue[]>(() =>
    groupedOptions.value.flatMap((group) => group.options.map(({ option }) => option))
  )

  // --- Reduce helpers ---

  function findOptionFromReducedValue(reducedValue: unknown): OptionValue | undefined {
    const opts = optionList.value
    return opts.find((option) => {
      const reduced = props.reduce ? props.reduce(option) : option
      return JSON.stringify(reduced) === JSON.stringify(reducedValue)
    })
  }

  // --- Open state ---

  function setOpen(value: boolean) {
    if (value && disabled.value) return
    if (open.value === value) return
    emit('update:open', value)
    if (isOpenControlled()) return
    internalOpen.value = value
    emit(value ? 'open' : 'close')
  }

  function toggleOpen() {
    setOpen(!open.value)
  }

  // --- Search ---

  function setSearch(value: string) {
    // Open first, so the highlight lands on the first match, not on the
    // last selected option.
    if (value && !open.value) setOpen(true)
    search.value = value
    emit('search', value, toggleLoading)
  }

  // --- Selection ---

  /**
   * Whether selecting an already selected option deselects it. Never
   * empties the value when the selection is not clearable.
   */
  function isOptionDeselectable(option: OptionValue): boolean {
    return (
      isOptionSelected(option) &&
      deselectFromDropdown.value &&
      (clearable.value || (multiple.value && selectedValue.value.length > 1))
    )
  }

  function select(option: OptionValue) {
    emit('option:selecting', option)

    if (!isOptionSelected(option)) {
      if (taggable.value && isNewTagCandidate(option)) {
        emit('option:created', option)
      }
      const emitValue = props.reduce ? props.reduce(option) : option
      if (props.reduce) knownOptions.set(JSON.stringify(emitValue), option)
      if (props.multiple) {
        const current = Array.isArray(currentValue.value) ? [...currentValue.value] : []
        updateValue([...current, emitValue])
      } else {
        updateValue(emitValue)
      }
      emit('option:selected', option)
    } else if (isOptionDeselectable(option)) {
      deselect(option)
    }

    if (props.clearSearchOnSelect !== false) {
      search.value = ''
    }
    if (props.closeOnSelect !== false) {
      setOpen(false)
    }
  }

  function deselect(option: OptionValue) {
    emit('option:deselecting', option)

    // As in v3, the events fire either way; the value only changes when the
    // option is selected (so a single-select never clears another value).
    if (!isOptionSelected(option)) {
      emit('option:deselected', option)
      return
    }

    if (!props.multiple) {
      updateValue(null)
      emit('option:deselected', option)
      return
    }

    const current = Array.isArray(currentValue.value)
      ? [...currentValue.value]
      : []
    const reducedKey = props.reduce
      ? JSON.stringify(props.reduce(option))
      : getOptionKey(option)
    const filtered = current.filter((v) => {
      const vKey = props.reduce ? JSON.stringify(v) : getOptionKey(v as OptionValue)
      return vKey !== reducedKey
    })
    updateValue(filtered)
    emit('option:deselected', option)
  }

  function resetSelection() {
    updateValue(props.multiple ? [] : null)
  }

  /** Clear the selection on the user's behalf (e.g. the clear button). */
  function clearSelection() {
    resetSelection()
    emit('clear')
  }

  // As in v3, switching between single and multi-select clears the value
  watch(
    () => props.multiple,
    () => resetSelection()
  )

  watch(
    () => props.options,
    (newOptions, oldOptions) => {
      if (taggable.value) return
      const reset = props.resetOnOptionsChange
      const shouldReset =
        typeof reset === 'function'
          ? reset(newOptions ?? [], oldOptions ?? [], selectedValue.value)
          : reset
      if (shouldReset) resetSelection()
    }
  )

  // --- TypeAhead navigation ---

  // As in v3: highlight the first selectable match whenever the list
  // changes, so typing then Enter selects it.
  watch(
    filteredOptions,
    (opts) => {
      typeAheadPointer.value = opts.findIndex((option) => isOptionSelectable(option))
    },
    { flush: 'sync' }
  )

  // On open, and when the selection changes while open, highlight the
  // last selected option (or nothing).
  function typeAheadToLastSelected() {
    const last = selectedValue.value[selectedValue.value.length - 1]
    if (last === undefined) {
      typeAheadPointer.value = -1
      return
    }
    const key = getOptionKey(last)
    typeAheadPointer.value = filteredOptions.value.findIndex(
      (option) => getOptionKey(option) === key
    )
  }

  watch(open, (isOpen) => isOpen && typeAheadToLastSelected(), { flush: 'sync' })
  watch(selectedValue, () => open.value && typeAheadToLastSelected(), { flush: 'sync' })

  /**
   * Index of the first selectable option from `from` in direction `step`,
   * wrapping around the list if `wrap`. -1 if there is none.
   */
  function findSelectable(from: number, step: 1 | -1, wrap: boolean): number {
    const opts = filteredOptions.value
    const count = opts.length
    for (let i = 0; i < count; i++) {
      let index = from + step * i
      if (wrap) index = ((index % count) + count) % count
      else if (index < 0 || index >= count) return -1
      if (isOptionSelectable(opts[index])) return index
    }
    return -1
  }

  /**
   * Highlight the next selectable option. With `wrap` (the default, as in
   * the APG editable combobox) the last option moves to the first;
   * without it (APG select-only) the highlight stays put.
   */
  function typeAheadDown(wrap = true) {
    if (filteredOptions.value.length === 0) return
    const next = findSelectable(typeAheadPointer.value + 1, 1, wrap)
    if (next !== -1 || wrap) typeAheadPointer.value = next
  }

  /** Highlight the previous selectable option. See `typeAheadDown`. */
  function typeAheadUp(wrap = true) {
    const count = filteredOptions.value.length
    if (count === 0) return
    const from = typeAheadPointer.value < 0 ? count - 1 : typeAheadPointer.value - 1
    const prev = findSelectable(from, -1, wrap)
    if (prev !== -1 || wrap) typeAheadPointer.value = prev
  }

  /** Highlight the first selectable option. */
  function typeAheadFirst() {
    const first = findSelectable(0, 1, false)
    if (first !== -1) typeAheadPointer.value = first
  }

  /** Highlight the last selectable option. */
  function typeAheadLast() {
    const last = findSelectable(filteredOptions.value.length - 1, -1, false)
    if (last !== -1) typeAheadPointer.value = last
  }

  function typeAheadSelect() {
    const opts = filteredOptions.value
    if (typeAheadPointer.value >= 0 && typeAheadPointer.value < opts.length) {
      const option = opts[typeAheadPointer.value]
      if (isOptionSelectable(option)) {
        select(option)
      }
    }
  }

  function toggleLoading(value?: boolean) {
    isLoading.value = value ?? !isLoading.value
  }

  function mapKeydown(handlers: KeydownHandlers): KeydownHandlers {
    return props.mapKeydown ? props.mapKeydown(handlers, context) : handlers
  }

  const context: ComboBoxContext = {
    // State
    open,
    search,
    selectedValue,
    filteredOptions,
    typeAheadPointer,
    isLoading,
    disabled,
    multiple,
    filterable,
    searchable,
    clearable,
    taggable,
    placeholder,
    isValueEmpty,
    isSearching,
    uid,
    deselectFromDropdown,
    autoscroll,

    // Methods
    select,
    deselect,
    clearSelection,
    toggleOpen,
    setOpen,
    setSearch,
    typeAheadUp,
    typeAheadDown,
    typeAheadFirst,
    typeAheadLast,
    typeAheadSelect,
    toggleLoading,
    getOptionLabel,
    getOptionKey,
    isOptionSelected,
    isOptionSelectable,
    isOptionDeselectable,
    isOptionHighlighted,
    optionList,
    mapKeydown,
    clearSearchOnBlur,
    groupedOptions,
    openOnFocus,
    inputEl,
    focusInput,
  }

  return context
}
