<script setup lang="ts">
import { ListBoxKey } from '@/keys'
import {
  provide,
  computed,
  reactive,
  watch,
  onMounted,
  ref,
  onUnmounted,
} from 'vue'
import { useClickAway } from '@/hooks/useClickAway'
import type {
  InjectedListBoxProps,
  ListBoxProps,
  ResolvedListBoxProps,
} from '@/types'

const emit = defineEmits(['update:modelValue', 'update:open', 'open', 'close'])

const props = withDefaults(defineProps<ListBoxProps>(), {
  open: undefined,
})

const el = ref<HTMLElement>()
const state = reactive<{
  open: boolean
}>({
  open: props.open === undefined ? false : props.open,
})

watch(
  () => state.open,
  (open) => emit('update:open', open),
)

const inputText = ref('')

const isOpen = computed<boolean>(() => {
  if (props.open !== undefined) {
    return props.open
  }
  return state.open
})

const { addClickAwayListener, removeClickAwayListener } = useClickAway(
  () => (state.open = false),
)

onMounted(() => addClickAwayListener(el.value))
onUnmounted(() => removeClickAwayListener(el.value))

provide<InjectedListBoxProps>(
  ListBoxKey,
  computed<ResolvedListBoxProps>(() => ({
    open: isOpen.value,
    modelValue: props.modelValue,
    inputText: inputText.value,
    toggleOpen: () => (state.open = !state.open),
    setModelValue: (modelValue) => emit('update:modelValue', modelValue),
    setInputText: (value: string) => (inputText.value = value),
  })),
)
</script>

<template>
  <div tabindex="0" role="combobox" ref="el">
    <slot></slot>
  </div>
</template>
