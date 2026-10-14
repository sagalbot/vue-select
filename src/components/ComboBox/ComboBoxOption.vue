<script setup lang="ts">
import { inject, computed } from 'vue'
import { ComboBoxKey } from '@/keys'
import type { OptionValue } from '@/types'

const props = withDefaults(
  defineProps<{
    value: OptionValue
    index: number
    /** Element to render, e.g. 'li'. */
    as?: string
  }>(),
  { as: 'div' }
)

const ctx = inject(ComboBoxKey)
if (!ctx) throw new Error('ComboBoxOption must be used inside a ComboBox component')

const isSelected = computed(() => ctx.isOptionSelected(props.value))
const isHighlighted = computed(() => ctx.isOptionHighlighted(props.index))
const isDisabled = computed(() => !ctx.isOptionSelectable(props.value))

function onClick() {
  if (!isDisabled.value) ctx.select(props.value)
}
</script>

<template>
  <component
    :is="as"
    :id="`vs-${ctx.uid.value}-option-${index}`"
    role="option"
    :aria-selected="String(isSelected)"
    :aria-disabled="isDisabled || undefined"
    @click="onClick"
    @mouseover="isDisabled || (ctx.typeAheadPointer.value = index)"
  >
    <slot v-bind="{ isSelected, isHighlighted, isDisabled }" />
  </component>
</template>
