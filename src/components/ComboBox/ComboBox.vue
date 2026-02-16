<script setup lang="ts">
import { provide, ref, onMounted, onUnmounted } from 'vue'
import { useComboBox } from '@/hooks/useComboBox'
import { useClickAway } from '@/hooks/useClickAway'
import { ComboBoxKey } from '@/keys'
import type { ComboBoxProps } from '@/types'

const props = withDefaults(defineProps<ComboBoxProps>(), {
  options: () => [],
  multiple: false,
  filterable: true,
  taggable: false,
  pushTags: false,
  clearable: true,
  closeOnSelect: true,
  clearSearchOnSelect: true,
  disabled: false,
  label: 'label',
  loading: false,
  noDrop: false,
  deselectFromDropdown: false,
  autoscroll: true,
  placeholder: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  'update:open': [value: boolean]
  open: []
  close: []
  search: [search: string, toggleLoading: (value?: boolean) => void]
  'option:created': [option: unknown]
  'option:selecting': [option: unknown]
  'option:selected': [option: unknown]
  'option:deselecting': [option: unknown]
  'option:deselected': [option: unknown]
}>()

const ctx = useComboBox(props, emit)
provide(ComboBoxKey, ctx)

// Click-away to close
const el = ref<HTMLElement>()
const { addClickAwayListener, removeClickAwayListener } = useClickAway(() => {
  ctx.setOpen(false)
})
onMounted(() => addClickAwayListener(el.value))
onUnmounted(() => removeClickAwayListener(el.value))
</script>

<template>
  <div ref="el">
    <slot />
  </div>
</template>
