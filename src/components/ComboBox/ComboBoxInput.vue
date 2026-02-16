<script setup lang="ts">
import { inject, ref, computed } from 'vue'
import { ComboBoxKey } from '@/keys'

const ctx = inject(ComboBoxKey)!
const isComposing = ref(false)

const attrs = computed(() => ({
  type: 'search',
  role: 'searchbox',
  autocomplete: 'off',
  'aria-autocomplete': 'list' as const,
  'aria-controls': `vs-${ctx.uid.value}-listbox`,
  'aria-activedescendant':
    ctx.typeAheadPointer.value > -1
      ? `vs-${ctx.uid.value}-option-${ctx.typeAheadPointer.value}`
      : undefined,
  disabled: ctx.disabled.value || undefined,
  value: ctx.search.value,
  placeholder: ctx.placeholder.value || undefined,
}))

function onInput(e: Event) {
  ctx.setSearch((e.target as HTMLInputElement).value)
}

function onKeydown(e: KeyboardEvent) {
  if (isComposing.value) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      ctx.typeAheadDown()
      if (!ctx.open.value) ctx.setOpen(true)
      break
    case 'ArrowUp':
      e.preventDefault()
      ctx.typeAheadUp()
      if (!ctx.open.value) ctx.setOpen(true)
      break
    case 'Enter':
      e.preventDefault()
      if (ctx.open.value) ctx.typeAheadSelect()
      break
    case 'Escape':
      if (ctx.isSearching.value) {
        ctx.setSearch('')
      } else {
        ctx.setOpen(false)
      }
      break
    case 'Backspace':
      if (!ctx.search.value && ctx.multiple.value && !ctx.isValueEmpty.value) {
        const last = ctx.selectedValue.value[ctx.selectedValue.value.length - 1]
        ctx.deselect(last)
      }
      break
  }
}

function onFocus() {
  if (!ctx.disabled.value) {
    ctx.setOpen(true)
  }
}

function onBlur() {
  ctx.setOpen(false)
  ctx.setSearch('')
}
</script>

<template>
  <input
    v-bind="attrs"
    @input="onInput"
    @keydown="onKeydown"
    @focus="onFocus"
    @blur="onBlur"
    @compositionstart="isComposing = true"
    @compositionend="isComposing = false"
  />
</template>
