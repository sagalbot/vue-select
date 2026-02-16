<script setup lang="ts">
import { inject, ref, watch, nextTick } from 'vue'
import { ComboBoxKey } from '@/keys'

const ctx = inject(ComboBoxKey)
if (!ctx) throw new Error('ComboBoxMenu must be used inside a ComboBox component')
const menuEl = ref<HTMLElement>()

// Auto-scroll to keep highlighted option visible
watch(() => ctx.typeAheadPointer.value, async (pointer) => {
  await nextTick()
  if (!ctx.autoscroll.value || !menuEl.value || pointer < 0) return
  const option = menuEl.value.children[pointer] as HTMLElement | undefined
  if (!option) return

  const menuRect = menuEl.value.getBoundingClientRect()
  const optionRect = option.getBoundingClientRect()

  if (optionRect.bottom > menuRect.bottom) {
    menuEl.value.scrollTop += optionRect.bottom - menuRect.bottom
  } else if (optionRect.top < menuRect.top) {
    menuEl.value.scrollTop -= menuRect.top - optionRect.top
  }
})
</script>

<template>
  <div
    v-show="ctx.open.value && !ctx.noDrop.value"
    ref="menuEl"
    :id="`vs-${ctx.uid.value}-listbox`"
    role="listbox"
    tabindex="-1"
    @mousedown.prevent
  >
    <slot />
  </div>
</template>
