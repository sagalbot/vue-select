<script setup lang="ts">
import { computed, provide, ref, onMounted, onUnmounted } from 'vue'
import { useComboBox } from '@/hooks/useComboBox'
import { useClickAway } from '@/hooks/useClickAway'
import { ComboBoxKey } from '@/keys'
import type { ComboBoxProps } from '@/types'

const props = withDefaults(defineProps<ComboBoxProps>(), {
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
})

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

// State for the default slot, so templates can render options without
// injecting the context: <ComboBox v-slot="{ filteredOptions }">
const slotProps = computed(() => ({
  open: ctx.open.value,
  search: ctx.search.value,
  selected: ctx.selectedValue.value,
  filteredOptions: ctx.filteredOptions.value,
  groupedOptions: ctx.groupedOptions.value,
  loading: ctx.isLoading.value,
}))

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
