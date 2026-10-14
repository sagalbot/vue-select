// src/index.ts
import Select from './components/Select.vue'

// Headless primitives
export { default as ComboBox } from './components/ComboBox/ComboBox.vue'
export { default as ComboBoxInput } from './components/ComboBox/ComboBoxInput.vue'
export { default as ComboBoxMenu } from './components/ComboBox/ComboBoxMenu.vue'
export { default as ComboBoxOption } from './components/ComboBox/ComboBoxOption.vue'
export { default as ComboBoxButton } from './components/ComboBox/ComboBoxButton.vue'
export { default as ComboBoxClear } from './components/ComboBox/ComboBoxClear.vue'
export { default as ComboBoxGroup } from './components/ComboBox/ComboBoxGroup.vue'

// Composable
export { useComboBox } from './hooks/useComboBox'

// Types
export type {
  ComboBoxProps,
  ComboBoxContext,
  KeydownHandlers,
  ModelValue,
  OptionGroup,
  OptionKey,
  OptionValue,
} from './types'

// Default export: the batteries-included component
export default Select
