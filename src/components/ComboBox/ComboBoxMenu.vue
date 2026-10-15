<script setup lang="ts">
import { computed, ref, watch, nextTick, useAttrs } from 'vue'
import { useComboBoxContext } from '../../keys'

const props = withDefaults(
  defineProps<{
    /** Element to render, e.g. 'ul'. */
    as?: string
    /** Override visibility. Defaults to the combobox's open state. */
    show?: boolean
  }>(),
  { as: 'div', show: undefined }
)

const ctx = useComboBoxContext('ComboBoxMenu')

// A listbox needs an accessible name. Default to 'Options' unless one is
// given with aria-label or aria-labelledby.
const attrs = useAttrs()
const defaultLabel = computed(() =>
  'aria-label' in attrs || 'aria-labelledby' in attrs ? undefined : 'Options'
)
const menuEl = ref<HTMLElement>()

// Auto-scroll to keep highlighted option visible
watch(() => ctx.typeAheadPointer.value, async (pointer) => {
  await nextTick()
  if (!ctx.autoscroll.value || !menuEl.value || pointer < 0) return
  const option = menuEl.value.querySelector<HTMLElement>(`[id="vs-${ctx.uid.value}-option-${pointer}"]`)
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
  <component
    :is="as"
    v-show="props.show ?? ctx.open.value"
    ref="menuEl"
    :id="`vs-${ctx.uid.value}-listbox`"
    role="listbox"
    :aria-label="defaultLabel"
    :aria-multiselectable="ctx.multiple.value || undefined"
    tabindex="-1"
    @mousedown.prevent
  >
    <slot />
  </component>
</template>
