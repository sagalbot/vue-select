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
  modelValue?: ModelValue
  options?: OptionValue[]
  multiple?: boolean
  filterable?: boolean
  taggable?: boolean
  pushTags?: boolean
  clearable?: boolean
  closeOnSelect?: boolean
  clearSearchOnSelect?: boolean
  disabled?: boolean
  open?: boolean
  label?: string
  reduce?: (option: OptionValue) => unknown
  selectable?: (option: OptionValue) => boolean
  getOptionLabel?: (option: OptionValue) => string
  getOptionKey?: (option: OptionValue) => string
  filter?: (options: OptionValue[], search: string) => OptionValue[]
  filterBy?: (option: OptionValue, label: string, search: string) => boolean
  createOption?: (search: string) => OptionValue
  loading?: boolean
  uid?: string
  placeholder?: string
  noDrop?: boolean
  deselectFromDropdown?: boolean
  autoscroll?: boolean
}

/**
 * The resolved context provided to child components via inject.
 */
export interface ComboBoxContext {
  // State (readonly)
  open: Ref<boolean>
  search: Ref<string>
  selectedValue: ComputedRef<OptionValue[]>
  filteredOptions: ComputedRef<OptionValue[]>
  typeAheadPointer: Ref<number>
  isLoading: Ref<boolean>
  disabled: ComputedRef<boolean>
  multiple: ComputedRef<boolean>
  filterable: ComputedRef<boolean>
  noDrop: ComputedRef<boolean>
  clearable: ComputedRef<boolean>
  taggable: ComputedRef<boolean>
  placeholder: ComputedRef<string>
  isValueEmpty: ComputedRef<boolean>
  isSearching: ComputedRef<boolean>
  uid: ComputedRef<string>
  deselectFromDropdown: ComputedRef<boolean>
  autoscroll: ComputedRef<boolean>

  // Methods
  select: (option: OptionValue) => void
  deselect: (option: OptionValue) => void
  clearSelection: () => void
  toggleOpen: () => void
  setOpen: (value: boolean) => void
  setSearch: (value: string) => void
  typeAheadUp: () => void
  typeAheadDown: () => void
  typeAheadSelect: () => void
  toggleLoading: (value?: boolean) => void
  getOptionLabel: (option: OptionValue) => string
  getOptionKey: (option: OptionValue) => string
  isOptionSelected: (option: OptionValue) => boolean
  isOptionSelectable: (option: OptionValue) => boolean
  isOptionHighlighted: (index: number) => boolean
  optionList: ComputedRef<OptionValue[]>
}

/**
 * @deprecated Use ComboBoxProps instead. Will be removed in a future release.
 */
export type VueSelectValue = unknown
/**
 * @deprecated Use ComboBoxProps instead. Will be removed in a future release.
 */
export type VueSelectOption = unknown
/**
 * @deprecated Use ComboBoxProps instead. Will be removed in a future release.
 */
export interface ListBoxProps {
  modelValue: VueSelectValue
  open?: boolean | undefined
}
/**
 * @deprecated Use ComboBoxContext instead. Will be removed in a future release.
 */
export interface ResolvedListBoxProps extends Omit<ListBoxProps, 'open'> {
  open: boolean
  inputText: string
  toggleOpen: () => boolean
  setInputText: (text: string) => void
  setModelValue: (value: unknown) => void
}
