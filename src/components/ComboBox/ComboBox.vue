<script setup lang="ts">
import { computed, provide, ref, onMounted, onUnmounted } from 'vue'
import { useComboBox } from '../../hooks/useComboBox'
import { useClickAway } from '../../hooks/useClickAway'
import { ComboBoxKey } from '../../keys'
import { comboBoxDefaults } from '../../defaults'
import type { ComboBoxProps } from '../../types'

const props = withDefaults(defineProps<ComboBoxProps>(), comboBoxDefaults)

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  'update:open': [value: boolean]
  open: []
  close: []
  clear: []
  search: [search: string, toggleLoading: (value?: boolean) => void]
  'option:created': [option: unknown]
  'option:selecting': [option: unknown]
  'option:selected': [option: unknown]
  'option:deselecting': [option: unknown]
  'option:deselected': [option: unknown]
}>()

const ctx = useComboBox(props, emit as (event: string, ...args: unknown[]) => void)
provide(ComboBoxKey, ctx)

// Methods for the default slot and template refs
const methods = {
  select: ctx.select,
  deselect: ctx.deselect,
  clearSelection: ctx.clearSelection,
  setOpen: ctx.setOpen,
  toggleOpen: ctx.toggleOpen,
  setSearch: ctx.setSearch,
  focusInput: ctx.focusInput,
}

// State and methods for the default slot, so templates can render options
// without injecting the context: <ComboBox v-slot="{ filteredOptions }">
const slotProps = computed(() => ({
  open: ctx.open.value,
  search: ctx.search.value,
  selected: ctx.selectedValue.value,
  filteredOptions: ctx.filteredOptions.value,
  groupedOptions: ctx.groupedOptions.value,
  loading: ctx.isLoading.value,
  ...methods,
}))

defineExpose(methods)

// Click-away to close
const el = ref<HTMLElement>()
const { addClickAwayListener, removeClickAwayListener } = useClickAway(() => {
  ctx.setOpen(false)
})
onMounted(() => addClickAwayListener(el.value))
onUnmounted(() => removeClickAwayListener())
</script>

<template>
  <div ref="el">
    <slot v-bind="slotProps" />
  </div>
</template>
