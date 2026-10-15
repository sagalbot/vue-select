<script setup lang="ts">
import { computed } from 'vue'
import { useComboBoxContext } from '@/keys'
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

const ctx = useComboBoxContext('ComboBoxOption')

const isSelected = computed(() => ctx.isOptionSelected(props.value))
const isHighlighted = computed(() => ctx.isOptionHighlighted(props.index))
const isDisabled = computed(() => !ctx.isOptionSelectable(props.value))

// mousemove, not mouseover: a list scrolling under a still pointer fires
// mouseover and would steal the keyboard highlight.
function onMousemove() {
  if (!isDisabled.value && ctx.typeAheadPointer.value !== props.index) {
    ctx.typeAheadPointer.value = props.index
  }
}

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
    @mousemove="onMousemove"
  >
    <slot v-bind="{ isSelected, isHighlighted, isDisabled }" />
  </component>
</template>
