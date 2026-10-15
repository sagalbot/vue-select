import type { ComputedRef, Ref, ShallowRef } from 'vue'

/**
 * A single option can be a string, number, or object.
 */
export type OptionValue = string | number | Record<string, unknown>

/**
 * A unique key identifying an option. See `getOptionKey`.
 */
export type OptionKey = string | number

/**
 * The modelValue can be a single option, an array (multi-select), or null.
 */
export type ModelValue = OptionValue | OptionValue[] | null

/**
 * A run of options rendered under one group header. `label` is null for
 * options without a group. `index` is the option's position in
 * `filteredOptions`, which is what `ComboBoxOption` expects.
 */
export interface OptionGroup {
  label: string | null
  options: { option: OptionValue; index: number }[]
}

/**
 * Keyboard handlers for the search input, keyed by `KeyboardEvent.key`.
 */
export type KeydownHandlers = Record<string, (e: KeyboardEvent) => void>

/**
 * Props accepted by the ComboBox root component.
 */
export interface ComboBoxProps {
  modelValue?: ModelValue
  options?: OptionValue[]
  multiple?: boolean
  filterable?: boolean
  taggable?: boolean
  clearable?: boolean
  closeOnSelect?: boolean
  clearSearchOnSelect?: boolean
  /**
   * Clear the search text when the input loses focus. Defaults to true for
   * single-select when `clearSearchOnSelect` is true, otherwise false.
   */
  clearSearchOnBlur?: boolean
  /**
   * Group options under headers. Returns the group label for an option, or
   * null/undefined for options without a group. Ungrouped options render
   * first; groups appear in the order of their first option.
   */
  groupBy?: (option: OptionValue) => string | null | undefined
  /** In multi-select, remove selected options from the dropdown. */
  hideSelected?: boolean
  /**
   * Open the dropdown when the input receives focus (including focus from a
   * click). Off by default: the dropdown opens on typing, Down Arrow, or
   * the toggle button, as in the WAI-ARIA APG examples.
   */
  openOnFocus?: boolean
  disabled?: boolean
  open?: boolean
  label?: string
  reduce?: (option: OptionValue) => unknown
  selectable?: (option: OptionValue) => boolean
  getOptionLabel?: (option: OptionValue) => string
  getOptionKey?: (option: OptionValue) => OptionKey
  filter?: (options: OptionValue[], search: string) => OptionValue[]
  /** Build a tag from the search text. Throw to reject the text. */
  createOption?: (search: string) => OptionValue
  loading?: boolean
  uid?: string
  placeholder?: string
  /**
   * When false, the input is a select-only combobox: it can be focused and
   * navigated with the keyboard, but not typed into.
   */
  searchable?: boolean
  /**
   * Customize keyboard handling. Receives the default handlers keyed by
   * `KeyboardEvent.key` and the combobox context; returns the handlers to use.
   * Example, select with comma: `(map) => ({ ...map, ',': map.Enter })`
   */
  mapKeydown?: (handlers: KeydownHandlers, ctx: ComboBoxContext) => KeydownHandlers
  deselectFromDropdown?: boolean
  autoscroll?: boolean
  /**
   * Clear the selection when `options` changes. A function receives the new
   * options, the old options and the selected options, and returns whether
   * to clear. Ignored when `taggable` is true.
   */
  resetOnOptionsChange?:
    | boolean
    | ((
        newOptions: OptionValue[],
        oldOptions: OptionValue[],
        selected: OptionValue[]
      ) => boolean)
}

/**
 * Text for the accessible names `VueSelect` renders. Defaults are English.
 */
export interface AriaLabels {
  /** The toggle (open indicator) button. */
  toggle?: string
  /** The search input. Only used when the input has no id, aria-label or aria-labelledby. */
  search?: string
  /** The clear button. */
  clear?: string
  /** A selected tag's deselect button. */
  deselect?: (label: string, option: OptionValue) => string
}

/**
 * Position a teleported dropdown (see `appendTo`). Return a function to
 * clean up when the dropdown closes.
 */
export type CalculatePosition = (
  menu: HTMLElement,
  ctx: ComboBoxContext,
  position: { width: string; top: string; left: string }
) => void | (() => void)

/**
 * Props accepted by the styled `VueSelect` component.
 */
export interface VueSelectProps extends Omit<ComboBoxProps, 'uid'> {
  /** Text direction: 'ltr', 'rtl' or 'auto'. */
  dir?: 'ltr' | 'rtl' | 'auto'
  /** Name of the Vue transition applied to the dropdown. */
  transition?: string
  /** Attributes for the search input, e.g. `{ id }` for a `<label for>`. */
  inputAttrs?: Record<string, unknown>
  /** Teleport the dropdown to this element or selector, e.g. 'body'. */
  appendTo?: string | HTMLElement
  /** Positions the dropdown when `appendTo` is set. */
  calculatePosition?: CalculatePosition
  /** Accessible names for the controls VueSelect renders. */
  ariaLabels?: AriaLabels
}

/**
 * The resolved context provided to child components via inject.
 */
export interface ComboBoxContext {
  // State (readonly)
  open: Readonly<Ref<boolean>>
  search: Ref<string>
  selectedValue: ComputedRef<OptionValue[]>
  filteredOptions: ComputedRef<OptionValue[]>
  typeAheadPointer: Ref<number>
  isLoading: Ref<boolean>
  disabled: ComputedRef<boolean>
  multiple: ComputedRef<boolean>
  filterable: ComputedRef<boolean>
  searchable: ComputedRef<boolean>
  mapKeydown: (handlers: KeydownHandlers) => KeydownHandlers
  clearSearchOnBlur: ComputedRef<boolean>
  openOnFocus: ComputedRef<boolean>
  /** The element registered by ComboBoxInput (input or select-only element). */
  inputEl: ShallowRef<HTMLElement | null>
  /** Move focus to the input, e.g. after using the toggle button. */
  focusInput: () => void
  groupedOptions: ComputedRef<OptionGroup[]>
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
  /** Move the highlight up; wraps around unless `wrap` is false. */
  typeAheadUp: (wrap?: boolean) => void
  /** Move the highlight down; wraps around unless `wrap` is false. */
  typeAheadDown: (wrap?: boolean) => void
  typeAheadFirst: () => void
  typeAheadLast: () => void
  typeAheadSelect: () => void
  toggleLoading: (value?: boolean) => void
  getOptionLabel: (option: OptionValue) => string
  getOptionKey: (option: OptionValue) => OptionKey
  isOptionSelected: (option: OptionValue) => boolean
  isOptionSelectable: (option: OptionValue) => boolean
  isOptionDeselectable: (option: OptionValue) => boolean
  isOptionHighlighted: (index: number) => boolean
  optionList: ComputedRef<OptionValue[]>
}
