<style>
@import '../css/vue-select.css';
</style>

<script setup lang="ts">
import {
  computed,
  h,
  nextTick,
  onBeforeUnmount,
  provide,
  ref,
  useSlots,
  watch,
  type FunctionalComponent,
} from 'vue'
import { useComboBox } from '@/hooks/useComboBox'
import { ComboBoxKey } from '@/keys'
import ComboBoxInput from '@/components/ComboBox/ComboBoxInput.vue'
import ComboBoxMenu from '@/components/ComboBox/ComboBoxMenu.vue'
import ComboBoxOption from '@/components/ComboBox/ComboBoxOption.vue'
import ComboBoxGroup from '@/components/ComboBox/ComboBoxGroup.vue'
import Deselect from '@/components/Deselect.vue'
import OpenIndicator from '@/components/OpenIndicator.vue'
import type { CalculatePosition, OptionValue, VueSelectProps } from '@/types'

const props = withDefaults(defineProps<VueSelectProps>(), {
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
  deselectFromDropdown: false,
  autoscroll: true,
  placeholder: '',
  resetOnOptionsChange: false,
  searchable: true,
  hideSelected: false,
  // undefined = uncontrolled; bind `open` (or v-model:open) to control it
  open: undefined,
  // undefined = derive from clearSearchOnSelect and multiple
  clearSearchOnBlur: undefined,
  dir: 'auto',
  transition: 'vs__fade',
  inputAttrs: () => ({}),
  appendTo: undefined,
  ariaLabels: () => ({}),
  calculatePosition: ((menu, _ctx, { width, top, left }) => {
    menu.style.top = top
    menu.style.left = left
    menu.style.width = width
  }) as CalculatePosition,
})

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  'update:open': [value: boolean]
  open: []
  close: []
  clear: []
  search: [search: string, toggleLoading: (value?: boolean) => void]
  'search:focus': []
  'search:blur': []
  'search:keydown': [event: KeyboardEvent]
  'search:input': [event: Event]
  'search:compositionstart': [event: CompositionEvent]
  'search:compositionend': [event: CompositionEvent]
  'option:created': [option: OptionValue]
  'option:selecting': [option: OptionValue]
  'option:selected': [option: OptionValue]
  'option:deselecting': [option: OptionValue]
  'option:deselected': [option: OptionValue]
}>()

const slots = useSlots()
const ctx = useComboBox(props, emit as (event: string, ...args: unknown[]) => void)
provide(ComboBoxKey, ctx)

const toggleEl = ref<HTMLElement>()
const menuComponent = ref<InstanceType<typeof ComboBoxMenu>>()

// --- Display helpers ---

/** Slot props for an option: objects as-is, primitives as `{ [label]: value }`. */
function normalizeOptionForSlot(option: OptionValue) {
  return typeof option === 'object' ? option : { [props.label]: option }
}

const label = (option: OptionValue) => ctx.getOptionLabel(option)

const clearLabel = computed(() => props.ariaLabels.clear ?? 'Clear Selected')

function deselectLabel(option: OptionValue) {
  return props.ariaLabels.deselect
    ? props.ariaLabels.deselect(label(option), option)
    : `Deselect ${label(option)}`
}

const searchAttrs = computed(() => {
  const attrs = props.inputAttrs
  const labelled = 'id' in attrs || 'aria-label' in attrs || 'aria-labelledby' in attrs
  return labelled
    ? attrs
    : { 'aria-label': props.ariaLabels.search ?? 'Search for option', ...attrs }
})

// --- State ---

// v3 hides the dropdown while loading
const dropdownOpen = computed(() => ctx.open.value && !ctx.isLoading.value)

const showClearButton = computed(
  () => props.clearable && !ctx.open.value && !ctx.isValueEmpty.value
)

const stateClasses = computed(() => ({
  'vs--open': dropdownOpen.value,
  'vs--single': !props.multiple,
  'vs--multiple': props.multiple,
  'vs--searching': ctx.isSearching.value,
  'vs--searchable': ctx.searchable.value,
  'vs--unsearchable': !ctx.searchable.value,
  'vs--loading': ctx.isLoading.value,
  'vs--disabled': props.disabled,
}))

const listSlotScope = computed(() => ({
  search: ctx.search.value,
  loading: ctx.isLoading.value,
  searching: ctx.isSearching.value,
  filteredOptions: ctx.filteredOptions.value,
}))

const noOptionsScope = computed(() => ({
  search: ctx.search.value,
  loading: ctx.isLoading.value,
  searching: ctx.isSearching.value,
}))

const openIndicatorAttrs = { role: 'presentation', class: 'vs__open-indicator' }

// --- Interaction ---

function searchEl(): HTMLElement | null {
  return toggleEl.value?.querySelector<HTMLElement>('[role="combobox"]') ?? null
}

/**
 * Clicking anywhere on the toggle opens and focuses; clicking it again
 * (outside the search input) closes. Deselect and clear buttons handle
 * their own clicks.
 */
function onToggleMousedown(event: MouseEvent) {
  const target = event.target as HTMLElement
  const input = searchEl()

  if (target.closest('.vs__deselect, .vs__clear')) {
    event.preventDefault()
    return
  }

  const targetIsSearch = target === input
  if (!targetIsSearch) event.preventDefault()

  if (ctx.open.value && !targetIsSearch) {
    input?.blur()
  } else if (!props.disabled) {
    ctx.setOpen(true)
    input?.focus()
  }
}

// --- Teleported dropdown positioning ---

let cleanupPosition: (() => void) | void

function releasePosition() {
  if (typeof cleanupPosition === 'function') cleanupPosition()
  cleanupPosition = undefined
}

watch(dropdownOpen, async (isOpen) => {
  releasePosition()
  if (!isOpen || !props.appendTo) return
  await nextTick()
  const menu = menuComponent.value?.$el as HTMLElement | undefined
  if (!menu || !toggleEl.value) return
  const { height, top, left, width } = toggleEl.value.getBoundingClientRect()
  cleanupPosition = props.calculatePosition(menu, ctx, {
    width: `${width}px`,
    top: `${window.scrollY + top + height}px`,
    left: `${window.scrollX + left}px`,
  })
})

onBeforeUnmount(releasePosition)

// --- Options ---

const OptionItem: FunctionalComponent<{ option: OptionValue; index: number }> = ({
  option,
  index,
}) => {
  const highlighted = ctx.isOptionHighlighted(index)
  return h(
    ComboBoxOption,
    {
      as: 'li',
      value: option,
      index,
      class: [
        'vs__dropdown-option',
        {
          'vs__dropdown-option--deselect': highlighted && ctx.isOptionDeselectable(option),
          'vs__dropdown-option--selected': ctx.isOptionSelected(option),
          'vs__dropdown-option--highlight': highlighted,
          'vs__dropdown-option--disabled': !ctx.isOptionSelectable(option),
        },
      ],
    },
    {
      default: () =>
        slots.option ? slots.option(normalizeOptionForSlot(option)) : label(option),
    }
  )
}

// --- Instance API (template refs) ---

defineExpose({
  open: computed({
    get: () => ctx.open.value,
    set: (value: boolean) => ctx.setOpen(value),
  }),
  search: computed({
    get: () => ctx.search.value,
    set: (value: string) => ctx.setSearch(value),
  }),
  select: ctx.select,
  deselect: ctx.deselect,
  clearSelection: ctx.clearSelection,
  toggleDropdown: () => ctx.toggleOpen(),
  focus: () => searchEl()?.focus(),
  blur: () => searchEl()?.blur(),
})
</script>

<template>
  <div :dir="dir" class="v-select" :class="stateClasses">
    <slot name="header" v-bind="listSlotScope" :deselect="ctx.deselect" />

    <div ref="toggleEl" class="vs__dropdown-toggle" @mousedown="onToggleMousedown">
      <div class="vs__selected-options">
        <template
          v-for="option in ctx.selectedValue.value"
          :key="ctx.getOptionKey(option)"
        >
          <slot
            name="selected-option-container"
            :option="normalizeOptionForSlot(option)"
            :deselect="ctx.deselect"
            :multiple="multiple"
            :disabled="disabled"
          >
            <span class="vs__selected">
              <slot name="selected-option" v-bind="normalizeOptionForSlot(option)">
                {{ label(option) }}
              </slot>
              <button
                v-if="multiple"
                :disabled="disabled"
                type="button"
                class="vs__deselect"
                :title="deselectLabel(option)"
                :aria-label="deselectLabel(option)"
                @click="ctx.deselect(option)"
              >
                <slot name="deselect" :option="normalizeOptionForSlot(option)">
                  <Deselect />
                </slot>
              </button>
            </span>
          </slot>
        </template>

        <ComboBoxInput
          class="vs__search"
          v-bind="searchAttrs"
          @focus="emit('search:focus')"
          @blur="emit('search:blur')"
          @keydown="(e: KeyboardEvent) => emit('search:keydown', e)"
          @input="(e: Event) => emit('search:input', e)"
          @compositionstart="(e: CompositionEvent) => emit('search:compositionstart', e)"
          @compositionend="(e: CompositionEvent) => emit('search:compositionend', e)"
        >
          <template v-if="$slots.search" #input="scope">
            <slot name="search" v-bind="scope" />
          </template>
          <template v-if="!ctx.searchable.value && ctx.isValueEmpty.value">
            {{ placeholder }}
          </template>
        </ComboBoxInput>
      </div>

      <div class="vs__actions">
        <button
          v-show="showClearButton"
          :disabled="disabled"
          type="button"
          class="vs__clear"
          :title="clearLabel"
          :aria-label="clearLabel"
          @click="ctx.clearSelection()"
        >
          <slot name="clear"><Deselect /></slot>
        </button>

        <slot name="open-indicator" :attributes="openIndicatorAttrs">
          <OpenIndicator v-bind="openIndicatorAttrs" />
        </slot>

        <slot name="spinner" :loading="ctx.isLoading.value">
          <div v-show="ctx.isLoading.value" class="vs__spinner">Loading...</div>
        </slot>
      </div>
    </div>

    <Teleport :to="appendTo ?? 'body'" :disabled="!appendTo">
      <Transition :name="transition">
        <ComboBoxMenu
          ref="menuComponent"
          as="ul"
          class="vs__dropdown-menu"
          :show="dropdownOpen"
        >
          <slot name="list-header" v-bind="listSlotScope" />
          <template v-for="group in ctx.groupedOptions.value" :key="group.label ?? ''">
            <template v-if="group.label === null">
              <OptionItem
                v-for="{ option, index } in group.options"
                :key="ctx.getOptionKey(option)"
                :option="option"
                :index="index"
              />
            </template>
            <li v-else role="none" class="vs__dropdown-group">
              <ComboBoxGroup
                as="ul"
                label-as="li"
                class="vs__dropdown-group-options"
                :label="group.label"
              >
                <template #label>
                  <span class="vs__dropdown-group-label">
                    <slot
                      name="group-header"
                      :label="group.label"
                      :options="group.options.map((o) => o.option)"
                    >
                      {{ group.label }}
                    </slot>
                  </span>
                </template>
                <OptionItem
                  v-for="{ option, index } in group.options"
                  :key="ctx.getOptionKey(option)"
                  :option="option"
                  :index="index"
                />
              </ComboBoxGroup>
            </li>
          </template>
          <li v-if="ctx.filteredOptions.value.length === 0" class="vs__no-options">
            <slot name="no-options" v-bind="noOptionsScope">
              Sorry, no matching options.
            </slot>
          </li>
          <slot name="list-footer" v-bind="listSlotScope" />
        </ComboBoxMenu>
      </Transition>
    </Teleport>

    <slot name="footer" v-bind="listSlotScope" :deselect="ctx.deselect" />
  </div>
</template>
