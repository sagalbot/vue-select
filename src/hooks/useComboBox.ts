import { ref, computed } from 'vue'
import type { ComboBoxProps, ComboBoxContext, OptionValue } from '@/types'

export function useComboBox(
  props: ComboBoxProps,
  emit: (...args: any[]) => void
): ComboBoxContext {
  // --- State ---

  const open = ref(false)
  const search = ref('')
  const typeAheadPointer = ref(-1)
  const isLoading = ref(false)
  const pushedTags = ref<OptionValue[]>([])

  // Generate a stable uid once per instance
  const stableUid = String(Math.random()).slice(2, 8)

  // --- Computed ---

  const selectedValue = computed<OptionValue[]>(() => {
    const v = props.modelValue
    if (Array.isArray(v)) return v
    if (v != null) return [v]
    return []
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

  // --- Option helpers ---

  function getOptionLabel(option: OptionValue): string {
    if (props.getOptionLabel) return props.getOptionLabel(option)
    if (typeof option === 'object' && option !== null) {
      const key = props.label ?? 'label'
      return String((option as Record<string, unknown>)[key] ?? '')
    }
    return String(option)
  }

  function getOptionKey(option: OptionValue): string {
    if (props.getOptionKey) return props.getOptionKey(option)
    if (typeof option === 'object' && option !== null && 'id' in option) {
      return String((option as Record<string, unknown>).id)
    }
    return JSON.stringify(option)
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

    // Custom filter function takes priority
    if (props.filter) {
      return props.filter(opts, search.value)
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

  // --- Open state ---

  function setOpen(value: boolean) {
    open.value = value
    emit(value ? 'open' : 'close')
  }

  function toggleOpen() {
    setOpen(!open.value)
  }

  // --- Search ---

  function setSearch(value: string) {
    search.value = value
  }

  // --- Selection ---

  function select(option: OptionValue) {
    emit('option:selecting', option)
    if (props.multiple) {
      const current = Array.isArray(props.modelValue)
        ? [...props.modelValue]
        : []
      current.push(option)
      emit('update:modelValue', current)
    } else {
      emit('update:modelValue', option)
    }
    emit('option:selected', option)
  }

  function deselect(option: OptionValue) {
    emit('option:deselecting', option)
    const current = Array.isArray(props.modelValue)
      ? [...props.modelValue]
      : []
    const filtered = current.filter(
      (v) => getOptionKey(v) !== getOptionKey(option)
    )
    emit('update:modelValue', filtered)
    emit('option:deselected', option)
  }

  function clearSelection() {
    emit('update:modelValue', props.multiple ? [] : null)
  }

  // --- Stubs for later tasks ---

  function typeAheadUp() {}
  function typeAheadDown() {}
  function typeAheadSelect() {}

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
