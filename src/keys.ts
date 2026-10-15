import { inject, type InjectionKey } from 'vue'
import type { ComboBoxContext } from '@/types'

export const ComboBoxKey: InjectionKey<ComboBoxContext> = Symbol('ComboBoxContext')

/**
 * Inject the ComboBox context in a primitive, throwing a clear error when
 * the primitive is used outside a ComboBox.
 */
export function useComboBoxContext(component: string): ComboBoxContext {
  const ctx = inject(ComboBoxKey, null)
  if (!ctx) throw new Error(`${component} must be used inside a ComboBox component`)
  return ctx
}
