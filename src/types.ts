import { PropType } from 'vue'

export type VueSelectValue = PropType<unknown>
export type VueSelectOption = PropType<unknown>

export interface ListBoxProps {
  modelValue: VueSelectValue
  open?: boolean | undefined
}
export interface ResolvedListBoxProps extends Omit<ListBoxProps, 'open'> {
  open: boolean
  inputText: string
  toggleOpen: () => boolean
  setInputText: (text: string) => void
  setModelValue: (value: unknown) => void
}
