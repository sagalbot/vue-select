<script setup lang="ts">
import { h, ref, type FunctionalComponent } from 'vue'
import VueSelect from '@/components/VueSelect.vue'
import { countriesAndCodes } from '~/assets/static/data'

// Icon paths from Heroicons 2.2 (MIT, Tailwind Labs), the set Headless UI uses.
const solid20 = {
  chevronDown:
    'M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z',
  chevronUpDown:
    'M10.53 3.47a.75.75 0 0 0-1.06 0L6.22 6.72a.75.75 0 0 0 1.06 1.06L10 5.06l2.72 2.72a.75.75 0 1 0 1.06-1.06l-3.25-3.25Zm-4.31 9.81 3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L10 14.94l-2.72-2.72a.75.75 0 0 0-1.06 1.06Z',
  xMark:
    'M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z',
}
const solid16XMark =
  'M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z'
const outline24 = {
  chevronDown: 'm19.5 8.25-7.5 7.5-7.5-7.5',
  xMark: 'M6 18 18 6M6 6l12 12',
}

type IconProps = { d: string; size: number; viewBox: number; outline?: boolean; extraClass?: string }

const Icon: FunctionalComponent<IconProps> = ({ d, size, viewBox, outline, extraClass }) =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: `0 0 ${viewBox} ${viewBox}`,
      width: size,
      height: size,
      'aria-hidden': 'true',
      class: extraClass,
      // inline fill wins over .vs__open-indicator's CSS fill
      style: {
        display: 'block',
        color: 'var(--vs-controls-color)',
        fill: outline ? 'none' : 'currentColor',
      },
      ...(outline
        ? { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }
        : { fill: 'currentColor' }),
    },
    [
      h('path', {
        d,
        ...(outline
          ? { 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
          : { 'fill-rule': 'evenodd', 'clip-rule': 'evenodd' }),
      }),
    ]
  )

interface Variant {
  name: string
  note: string
  indicator?: IconProps
  clear?: IconProps
  deselect?: IconProps
}

const variants: Variant[] = [
  { name: 'Current', note: 'Filled 14×10 / 10×10 shapes, scaled with CSS transforms.' },
  {
    name: 'A — Heroicons mini (solid 20)',
    note: 'Chevron-down that rotates when open, 20px x-mark to clear, 16px x-mark on tags.',
    indicator: { d: solid20.chevronDown, size: 20, viewBox: 20, extraClass: 'vs__open-indicator' },
    clear: { d: solid20.xMark, size: 20, viewBox: 20 },
    deselect: { d: solid16XMark, size: 16, viewBox: 16 },
  },
  {
    name: 'B — Headless UI combobox (chevron-up-down)',
    note: 'Exactly what the Headless UI examples use: static up/down chevrons that don’t rotate.',
    indicator: { d: solid20.chevronUpDown, size: 20, viewBox: 20 },
    clear: { d: solid20.xMark, size: 20, viewBox: 20 },
    deselect: { d: solid16XMark, size: 16, viewBox: 16 },
  },
  {
    name: 'C — Heroicons outline (1.5 stroke)',
    note: 'Lighter line icons; chevron rotates when open.',
    indicator: {
      d: outline24.chevronDown,
      size: 18,
      viewBox: 24,
      outline: true,
      extraClass: 'vs__open-indicator',
    },
    clear: { d: outline24.xMark, size: 18, viewBox: 24, outline: true },
    deselect: { d: outline24.xMark, size: 14, viewBox: 24, outline: true },
  },
]

const single = ref<unknown>(countriesAndCodes[38])
const multiple = ref<unknown[]>([countriesAndCodes[38], countriesAndCodes[75]])
</script>

<template>
  <div class="not-prose my-8 space-y-8">
    <div v-for="variant in variants" :key="variant.name" class="space-y-2">
      <div>
        <div class="text-sm font-semibold text-slate-900 dark:text-white">{{ variant.name }}</div>
        <div class="text-xs text-slate-500">{{ variant.note }}</div>
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <VueSelect v-model="single" :options="countriesAndCodes">
          <template v-if="variant.indicator" #open-indicator>
            <Icon v-bind="variant.indicator" />
          </template>
          <template v-if="variant.clear" #clear>
            <Icon v-bind="variant.clear" />
          </template>
        </VueSelect>
        <VueSelect v-model="multiple" :options="countriesAndCodes" multiple>
          <template v-if="variant.indicator" #open-indicator>
            <Icon v-bind="variant.indicator" />
          </template>
          <template v-if="variant.clear" #clear>
            <Icon v-bind="variant.clear" />
          </template>
          <template v-if="variant.deselect" #deselect>
            <Icon v-bind="variant.deselect" />
          </template>
        </VueSelect>
      </div>
    </div>
  </div>
</template>
