import type { InjectionKey } from 'vue'
import type { ComboBoxContext, ResolvedListBoxProps } from '@/types'

export const ComboBoxKey: InjectionKey<ComboBoxContext> = Symbol('ComboBoxContext')

/**
 * @deprecated Use ComboBoxKey instead. Will be removed in a future release.
 */
export const ListBoxKey: InjectionKey<ResolvedListBoxProps> = Symbol(
  'ListBoxInjectionKey',
)

/**
 * @deprecated Will be removed in a future release.
 */
export const ListBoxOptionInjectionKey = Symbol() as InjectionKey<string>
