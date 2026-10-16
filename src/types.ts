import type { ComputedRef, Ref, ShallowRef } from 'vue'

/**
 * A single option can be a string, number, or object.
 */
// `object` rather than Record<string, unknown>, so options typed with an
// `interface` (which has no index signature) are accepted.
export type OptionValue = string | number | object

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
 * Props accepted by the ComboBox root component (and by VueSelect).
 * `Option` is the type of your options; it defaults to any option.
 */
export interface ComboBoxProps<Option extends OptionValue = OptionValue> {
  /**
   * The selected value (`v-model`). A single option, an array of options
   * with `multiple`, or the reduced value(s) when `reduce` is set. Leave
   * unbound to let the component track the selection itself.
   */
  modelValue?: unknown
  /** The options to choose from: strings, numbers or objects. Default: `[]`. */
  options?: Option[]
  /** Select several options; `modelValue` is then an array. Default: `false`. */
  multiple?: boolean
  /** Filter the options by the search text. Default: `true`. */
  filterable?: boolean
  /** Let the user create options from the search text. Default: `false`. */
  taggable?: boolean
  /** Show a button that clears the selection. Default: `true`. */
  clearable?: boolean
  /** Close the dropdown after selecting an option. Default: `true`. */
  closeOnSelect?: boolean
  /** Clear the search text after selecting an option. Default: `true`. */
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
  groupBy?: (option: Option) => string | null | undefined
  /** In multi-select, remove selected options from the dropdown. Default: `false`. */
  hideSelected?: boolean
  /**
   * Open the dropdown when the input receives focus (including focus from a
   * click). Default: `false`: the dropdown opens on typing, Down Arrow, or
   * the toggle button, as in the WAI-ARIA APG examples.
   */
  openOnFocus?: boolean
  /** Disable the whole component. Default: `false`. */
  disabled?: boolean
  /**
   * Control whether the dropdown is open (`v-model:open`). Leave unbound and
   * the component manages it; bound, it only requests changes through
   * `update:open`. `:open="false"` keeps the dropdown closed (tag inputs).
   */
  open?: boolean
  /** The key used as the label of object options. Default: `'label'`. */
  label?: string
  /**
   * Transform the selected option into the value emitted with
   * `update:modelValue`, e.g. `(country) => country.code`.
   */
  reduce?: (option: Option) => unknown
  /** Whether an option can be selected; unselectable options render disabled. */
  selectable?: (option: Option) => boolean
  /** The text for an option. Default: the option, or `option[label]` for objects. */
  getOptionLabel?: (option: Option) => string
  /**
   * A unique key for an option. Default: strings and numbers as-is, `option.id`
   * if present, otherwise the option serialized with sorted keys.
   */
  getOptionKey?: (option: Option) => OptionKey
  /** Filter the options while there is search text. Default: case-insensitive label match. */
  filter?: (options: Option[], search: string) => Option[]
  /**
   * Build a tag from the search text (with `taggable`). Throw to reject the
   * text. Default: the text, or `{ [label]: text }` when options are objects.
   */
  createOption?: (search: string) => Option
  /** Show the loading state; the dropdown stays hidden while loading. Default: `false`. */
  loading?: boolean
  /** Base for element ids. Default: generated with Vue's `useId()`. Headless only. */
  uid?: string
  /** Placeholder for the search input, shown while nothing is selected. */
  placeholder?: string
  /**
   * When false, the input is a select-only combobox: it can be focused and
   * navigated with the keyboard, but not typed into. Default: `true`.
   */
  searchable?: boolean
  /**
   * Customize keyboard handling. Receives the default handlers keyed by
   * `KeyboardEvent.key` and the combobox context; returns the handlers to use.
   * Example, select with comma: `(map) => ({ ...map, ',': map.Enter })`
   */
  mapKeydown?: (handlers: KeydownHandlers, ctx: ComboBoxContext) => KeydownHandlers
  /** Selecting a selected option in the dropdown deselects it. Default: `false`. */
  deselectFromDropdown?: boolean
  /** Scroll the highlighted option into view. Default: `true`. */
  autoscroll?: boolean
  /**
   * Clear the selection when `options` changes. A function receives the new
   * options, the old options and the selected options, and returns whether
   * to clear. Ignored when `taggable` is true. Default: `false`.
   */
  resetOnOptionsChange?:
    | boolean
    | ((newOptions: Option[], oldOptions: Option[], selected: Option[]) => boolean)
}

/**
 * Text for the accessible names `VueSelect` renders. Defaults are English.
 */
export interface AriaLabels {
  /** The toggle (open indicator) button. Default: 'Toggle options'. */
  toggle?: string
  /** The listbox of options. Default: 'Options'. */
  listbox?: string
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
  /** Pixel values from the toggle's position; `toggle` is the toggle element. */
  position: { width: string; top: string; left: string; toggle: HTMLElement }
) => void | (() => void)

/**
 * Props accepted by the styled `VueSelect` component.
 */
export interface VueSelectProps<Option extends OptionValue = OptionValue>
  extends Omit<ComboBoxProps<Option>, 'uid'> {
  /** Text direction: 'ltr', 'rtl' or 'auto'. Default: `'auto'`. */
  dir?: 'ltr' | 'rtl' | 'auto'
  /** Name of the Vue transition applied to the dropdown. Default: `'vs__fade'`. */
  transition?: string
  /**
   * Attributes for the search input, e.g. `{ id }` for a `<label for>`, or
   * `autocomplete`, `name`, `tabindex`. ARIA state and `value` stay managed.
   */
  inputAttrs?: Record<string, unknown>
  /** Teleport the dropdown to this element or selector, e.g. `'body'`. */
  appendTo?: string | HTMLElement
  /** Positions the dropdown when `appendTo` is set. Default: below the toggle, same width. */
  calculatePosition?: CalculatePosition
  /** Accessible names for the controls VueSelect renders. English by default. */
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

/**
 * What slots receive for an option: objects as-is, strings and numbers
 * wrapped as `{ [label]: value }` (`label` defaults to `'label'`).
 */
export type SlotOption<Option extends OptionValue = OptionValue> = Option extends object
  ? Option
  : Record<string, Option>

/** Scope of the list-header, list-footer, header and footer slots. */
export interface ListSlotScope<Option extends OptionValue = OptionValue> {
  search: string
  loading: boolean
  searching: boolean
  filteredOptions: Option[]
}

/** The slots of `VueSelect`, typed by option type. */
export interface VueSelectSlots<Option extends OptionValue = OptionValue> {
  header?: (props: ListSlotScope<Option> & { deselect: (option: Option) => void }) => unknown
  footer?: (props: ListSlotScope<Option> & { deselect: (option: Option) => void }) => unknown
  'list-header'?: (props: ListSlotScope<Option>) => unknown
  'list-footer'?: (props: ListSlotScope<Option>) => unknown
  'selected-option-container'?: (props: {
    option: SlotOption<Option>
    deselect: (option: Option | SlotOption<Option>) => void
    multiple: boolean
    disabled: boolean
  }) => unknown
  'selected-option'?: (props: SlotOption<Option>) => unknown
  option?: (props: SlotOption<Option>) => unknown
  search?: (props: {
    attributes: Record<string, unknown>
    events: Record<string, (e: Event) => void>
  }) => unknown
  'open-indicator'?: (props: { attributes: Record<string, string> }) => unknown
  spinner?: (props: { loading: boolean }) => unknown
  'no-options'?: (props: { search: string; loading: boolean; searching: boolean }) => unknown
  clear?: () => unknown
  deselect?: (props: { option: SlotOption<Option> }) => unknown
  'group-header'?: (props: { label: string; options: Option[] }) => unknown
}
