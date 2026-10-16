<script setup lang="ts">
import { ref, watch } from 'vue'
import ComboBox from '@/components/ComboBox/ComboBox.vue'
import ComboBoxInput from '@/components/ComboBox/ComboBoxInput.vue'
import ComboBoxButton from '@/components/ComboBox/ComboBoxButton.vue'
import ComboBoxClear from '@/components/ComboBox/ComboBoxClear.vue'
import ComboBoxMenu from '@/components/ComboBox/ComboBoxMenu.vue'
import ComboBoxOption from '@/components/ComboBox/ComboBoxOption.vue'
import ComboBoxGroup from '@/components/ComboBox/ComboBoxGroup.vue'
import { countriesAndCodes } from '~/assets/static/data'
import type { ModelValue, OptionValue } from '@/types'

const multiple = ref(false)
const taggable = ref(false)
const useReduce = ref(false)
const deselectFromDropdown = ref(false)
const searchable = ref(true)
const grouped = ref(false)

const value = ref<ModelValue>(null)
const events = ref<string[]>([])

watch([multiple, useReduce], () => {
  value.value = multiple.value ? [] : null
  events.value = []
})

const groupByLetter = (option: OptionValue) =>
  typeof option === 'object' ? String(option.label)[0] : null

const reduce = (option: OptionValue) =>
  typeof option === 'object' ? (option as { value: string }).value : option

function log(name: string, ...args: unknown[]) {
  const payload = args
    .filter((a) => typeof a !== 'function')
    .map((a) => JSON.stringify(a))
    .join(', ')
  events.value = [`${name}(${payload})`, ...events.value].slice(0, 12)
}
</script>

<template>
  <div class="not-prose my-8 space-y-4">
    <div class="flex flex-wrap gap-4 text-sm text-slate-700 dark:text-slate-300">
      <label class="flex items-center gap-2">
        <input v-model="multiple" type="checkbox" /> multiple
      </label>
      <label class="flex items-center gap-2">
        <input v-model="taggable" type="checkbox" /> taggable
      </label>
      <label class="flex items-center gap-2">
        <input v-model="useReduce" type="checkbox" /> reduce to code
      </label>
      <label class="flex items-center gap-2">
        <input v-model="deselectFromDropdown" type="checkbox" />
        deselectFromDropdown
      </label>
      <label class="flex items-center gap-2">
        <input v-model="searchable" type="checkbox" /> searchable
      </label>
      <label class="flex items-center gap-2">
        <input v-model="grouped" type="checkbox" /> group by first letter
      </label>
    </div>

    <ComboBox
      :key="`${multiple}-${useReduce}`"
      v-model="value"
      :options="countriesAndCodes"
      :multiple="multiple"
      :taggable="taggable"
      :reduce="useReduce ? reduce : undefined"
      :deselect-from-dropdown="deselectFromDropdown"
      :searchable="searchable"
      :group-by="grouped ? groupByLetter : undefined"
      class="relative w-full max-w-md"
      @open="log('open')"
      @close="log('close')"
      @search="(s: string) => log('search', s)"
      @option:selected="(o: unknown) => log('option:selected', o)"
      @option:deselected="(o: unknown) => log('option:deselected', o)"
      @option:created="(o: unknown) => log('option:created', o)"
    >
      <template #default>
        <div
          class="flex flex-wrap items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 focus-within:ring-2 focus-within:ring-sky-400 dark:border-slate-600 dark:bg-slate-800"
        >
          <PlaygroundSelected />
          <ComboBoxInput
            class="min-w-0 flex-1 bg-transparent py-1 text-slate-900 outline-none dark:text-white"
            :class="{ 'h-8 cursor-pointer': !searchable }"
          />
          <ComboBoxClear class="px-1 text-slate-400 hover:text-slate-700">
            ✕
          </ComboBoxClear>
          <ComboBoxButton class="px-1 text-slate-400 hover:text-slate-700">
            ▾
          </ComboBoxButton>
        </div>
        <ComboBoxMenu
          class="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800"
        >
          <PlaygroundOptions />
        </ComboBoxMenu>
      </template>
    </ComboBox>

    <div class="grid gap-4 text-xs sm:grid-cols-2">
      <div class="rounded-md bg-slate-900 p-3 text-slate-100">
        <div class="mb-1 font-semibold text-slate-400">v-model</div>
        <pre class="whitespace-pre-wrap">{{ JSON.stringify(value, null, 2) }}</pre>
      </div>
      <div class="rounded-md bg-slate-900 p-3 text-slate-100">
        <div class="mb-1 font-semibold text-slate-400">events (newest first)</div>
        <div v-if="!events.length" class="text-slate-500">none yet</div>
        <div v-for="(e, i) in events" :key="i" class="font-mono break-all">{{ e }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, h, inject } from 'vue'
import { ComboBoxKey } from '@/keys'

// Shows the current selection inside the toggle, with a deselect
// button per value in multi-select.
const PlaygroundSelected = defineComponent({
  setup() {
    const ctx = inject(ComboBoxKey)!
    return () =>
      ctx.selectedValue.value.map((option) =>
        ctx.multiple.value
          ? h(
              'span',
              {
                key: String(ctx.getOptionKey(option)),
                class:
                  'flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-200',
              },
              [
                ctx.getOptionLabel(option),
                h(
                  'button',
                  {
                    type: 'button',
                    'aria-label': `Deselect ${ctx.getOptionLabel(option)}`,
                    class: 'text-slate-400 hover:text-slate-700',
                    onMousedown: (e: Event) => e.preventDefault(),
                    onClick: () => ctx.deselect(option),
                  },
                  '✕',
                ),
              ],
            )
          : ctx.search.value
            ? null
            : h(
                'span',
                {
                  key: 'single',
                  class: 'whitespace-nowrap text-slate-900 dark:text-white',
                },
                ctx.getOptionLabel(option),
              ),
      )
  },
})

// Renders the filtered options from the injected context, the way a
// headless user would.
const PlaygroundOptions = defineComponent({
  setup() {
    const ctx = inject(ComboBoxKey)!
    const renderOption = (option: OptionValue, index: number) =>
            h(
              ComboBoxOption,
              { key: String(ctx.getOptionKey(option)), value: option, index },
              {
                default: ({
                  isSelected,
                  isHighlighted,
                  isDisabled,
                }: Record<string, boolean>) =>
                  h(
                    'div',
                    {
                      class: [
                        'cursor-pointer px-3 py-1.5 text-sm',
                        isHighlighted
                          ? 'bg-sky-500 text-white'
                          : 'text-slate-700 dark:text-slate-200',
                        isSelected && !isHighlighted ? 'font-semibold' : '',
                        isDisabled ? 'opacity-40' : '',
                      ],
                    },
                    `${isSelected ? '✓ ' : ''}${ctx.getOptionLabel(option)}`,
                  ),
              },
            )
    return () =>
      ctx.groupedOptions.value.length
        ? ctx.groupedOptions.value.map((group) =>
            group.label === null
              ? group.options.map(({ option, index }) => renderOption(option, index))
              : h(
                  ComboBoxGroup,
                  { key: group.label, label: group.label },
                  {
                    label: ({ label }: { label: string }) =>
                      h(
                        'div',
                        {
                          class:
                            'px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400',
                        },
                        label,
                      ),
                    default: () =>
                      group.options.map(({ option, index }) => renderOption(option, index)),
                  },
                ),
          )
        : h('div', { class: 'px-3 py-1.5 text-sm text-slate-400' }, 'No options')
  },
})
</script>
