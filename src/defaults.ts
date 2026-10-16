/**
 * Default prop values for ComboBox. Use them when wrapping the primitives
 * in your own component:
 *
 *   const props = withDefaults(defineProps<ComboBoxProps>(), comboBoxDefaults)
 *
 * Without them Vue turns absent boolean props into `false`, which turns
 * off filtering, searching and clearing, and makes `open` controlled
 * (so the dropdown never opens).
 */
export const comboBoxDefaults = {
  options: () => [],
  multiple: false,
  filterable: true,
  taggable: false,
  clearable: true,
  closeOnSelect: true,
  clearSearchOnSelect: true,
  disabled: false,
  label: 'label',
  loading: false,
  searchable: true,
  hideSelected: false,
  openOnFocus: false,
  // undefined = derive from clearSearchOnSelect and multiple
  clearSearchOnBlur: undefined,
  // undefined = uncontrolled; bind `open` (or v-model:open) to control it
  open: undefined,
  deselectFromDropdown: false,
  autoscroll: true,
  placeholder: '',
  resetOnOptionsChange: false,
} as const
