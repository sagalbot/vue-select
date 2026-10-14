import { ref, computed, watch, getCurrentInstance, useId } from 'vue'
import type { ComboBoxProps, ComboBoxContext, OptionKey, OptionValue } from '@/types'
import sortAndStringify from '@/utility/sortAndStringify'

// Fallback for calls outside a component (e.g. unit tests), where useId() is unavailable.
let uidCounter = 0

export function useComboBox(
  props: ComboBoxProps,
  emit: (event: string, ...args: unknown[]) => void
): ComboBoxContext {
  // --- State ---

  const open = ref(props.open ?? false)
  const search = ref('')
  const typeAheadPointer = ref(-1)
  const isLoading = ref(props.loading ?? false)
  const pushedTags = ref<OptionValue[]>([])

  // Full option objects for reduced values, so a selection keeps its label
  // after the option leaves `options` (e.g. AJAX search results change).
  const knownOptions = new Map<string, OptionValue>()

  // useId() matches between server render and hydration
  const stableUid = getCurrentInstance() ? useId() : String(++uidCounter)

  // Sync controlled open prop
  watch(() => props.open, (val) => {
    if (val !== undefined) open.value = val
  })

  // Sync loading prop
  watch(() => props.loading, (val) => {
    if (val !== undefined) isLoading.value = val
  })

  // --- Computed ---

  const selectedValue = computed<OptionValue[]>(() => {
    const v = props.modelValue
    const values = Array.isArray(v) ? v : v != null ? [v] : []

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
  const noDrop = computed(() => props.noDrop ?? false)
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
   * in the original options list (props.options) or in pushedTags.
   */
  function isNewTagCandidate(option: OptionValue): boolean {
    const opts = props.options ?? []
    const optKey = getOptionKey(option)
    return !opts.some((o) => getOptionKey(o) === optKey) &&
      !pushedTags.value.some((o) => getOptionKey(o) === optKey)
  }

  // --- Filtering helpers ---

  function defaultFilterBy(option: OptionValue, label: string, search: string): boolean {
    return label.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  }

  function maybeAddTaggableOption(options: OptionValue[]): OptionValue[] {
    if (!taggable.value || !search.value) return options

    // Create the tag option
    const tagOption = props.createOption
      ? props.createOption(search.value)
      : search.value

    // Don't add if an option with the same key already exists
    const tagKey = getOptionKey(tagOption)
    const alreadyExists = options.some((o) => getOptionKey(o) === tagKey)

    if (alreadyExists) return options
    return [tagOption, ...options]
  }

  // --- Filtering computeds ---

  const optionList = computed<OptionValue[]>(() => [
    ...(props.options ?? []),
    ...pushedTags.value,
  ])

  const filteredOptions = computed<OptionValue[]>(() => {
    const opts = optionList.value

    // Custom filter function takes priority, but still add taggable option
    if (props.filter) {
      return maybeAddTaggableOption(props.filter(opts, search.value))
    }

    // If not filterable or no search, return all
    if (!filterable.value || !search.value) {
      return maybeAddTaggableOption(opts)
    }

    // Default filtering logic
    const filterFn = props.filterBy ?? defaultFilterBy
    const filtered = opts.filter((option) => {
      const label = getOptionLabel(option)
      return filterFn(option, label, search.value)
    })

    return maybeAddTaggableOption(filtered)
  })

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
    if (open.value === value) return
    open.value = value
    emit('update:open', value)
    emit(value ? 'open' : 'close')
  }

  function toggleOpen() {
    setOpen(!open.value)
  }

  // --- Search ---

  function setSearch(value: string) {
    search.value = value
    typeAheadPointer.value = -1
    emit('search', value, toggleLoading)
  }

  // --- Selection ---

  function select(option: OptionValue) {
    // Check if this is a new tag (not in the original options or pushedTags)
    if (taggable.value && isNewTagCandidate(option)) {
      emit('option:created', option)
      if (props.pushTags) {
        pushedTags.value = [...pushedTags.value, option]
      }
    }

    emit('option:selecting', option)
    const emitValue = props.reduce ? props.reduce(option) : option
    if (props.reduce) knownOptions.set(JSON.stringify(emitValue), option)
    if (props.multiple) {
      if (!isOptionSelected(option)) {
        const current = Array.isArray(props.modelValue)
          ? [...props.modelValue]
          : []
        current.push(emitValue)
        emit('update:modelValue', current)
      }
    } else {
      emit('update:modelValue', emitValue)
    }
    emit('option:selected', option)

    if (props.clearSearchOnSelect !== false) {
      search.value = ''
    }
    if (props.closeOnSelect !== false) {
      setOpen(false)
    }
  }

  function deselect(option: OptionValue) {
    if (!isOptionSelected(option)) return

    emit('option:deselecting', option)

    if (!props.multiple) {
      emit('update:modelValue', null)
      emit('option:deselected', option)
      return
    }

    const current = Array.isArray(props.modelValue)
      ? [...props.modelValue]
      : []
    const reducedKey = props.reduce
      ? JSON.stringify(props.reduce(option))
      : getOptionKey(option)
    const filtered = current.filter((v) => {
      const vKey = props.reduce ? JSON.stringify(v) : getOptionKey(v as OptionValue)
      return vKey !== reducedKey
    })
    emit('update:modelValue', filtered)
    emit('option:deselected', option)
  }

  function clearSelection() {
    emit('update:modelValue', props.multiple ? [] : null)
  }

  watch(
    () => props.options,
    (newOptions, oldOptions) => {
      if (taggable.value) return
      const reset = props.resetOnOptionsChange
      const shouldReset =
        typeof reset === 'function'
          ? reset(newOptions ?? [], oldOptions ?? [], selectedValue.value)
          : reset
      if (shouldReset) clearSelection()
    }
  )

  // --- TypeAhead navigation ---

  function typeAheadDown() {
    const opts = filteredOptions.value
    if (opts.length === 0) return

    let next = typeAheadPointer.value + 1
    if (next >= opts.length) next = 0

    let checked = 0
    while (!isOptionSelectable(opts[next]) && checked < opts.length) {
      next = (next + 1) % opts.length
      checked++
    }

    // If we checked all options and none are selectable, reset to -1
    if (checked >= opts.length) {
      typeAheadPointer.value = -1
      return
    }

    typeAheadPointer.value = next
  }

  function typeAheadUp() {
    const opts = filteredOptions.value
    if (opts.length === 0) return

    let prev = typeAheadPointer.value - 1
    if (prev < 0) prev = opts.length - 1

    let checked = 0
    while (!isOptionSelectable(opts[prev]) && checked < opts.length) {
      prev = prev - 1
      if (prev < 0) prev = opts.length - 1
      checked++
    }

    if (checked >= opts.length) {
      typeAheadPointer.value = -1
      return
    }

    typeAheadPointer.value = prev
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

  return {
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
    noDrop,
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
    typeAheadSelect,
    toggleLoading,
    getOptionLabel,
    getOptionKey,
    isOptionSelected,
    isOptionSelectable,
    isOptionHighlighted,
    optionList,
  }
}
