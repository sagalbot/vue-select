/**
 * Helpers for the v3 compatibility suite.
 *
 * These specs are the v3 test suite pointed at the v4 VueSelect. They may
 * only use what users can use: props, events, slots, the DOM, and the
 * template-ref API (open, search, select, deselect, clearSelection,
 * toggleDropdown, focus, blur). No component internals.
 */
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import VueSelect from '@/components/VueSelect.vue'

/** Mount VueSelect with the given props. */
export const selectWithProps = (props = {}, options = {}) =>
  mount(VueSelect, { props, ...options })

/** Mount VueSelect with options ['one', 'two', 'three'] plus the given props. */
export const mountDefault = (props = {}, options = {}) =>
  selectWithProps({ options: ['one', 'two', 'three'], ...props }, options)

/** The search input (or select-only element). */
export const searchInput = (wrapper) => wrapper.get('.vs__search')

/**
 * Focus the search input and click it, which opens the dropdown. (In v4,
 * focus alone does not open it, following the WAI-ARIA APG examples.)
 */
export const searchFocus = async (wrapper) => {
  await searchInput(wrapper).trigger('focus')
  await searchInput(wrapper).trigger('click')
  await nextTick()
}

/** Type text into the search input, as a user would. */
export const typeSearch = async (wrapper, text) => {
  await searchInput(wrapper).setValue(text)
  await nextTick()
}

/** Press a key in the search input, e.g. 'Enter', 'ArrowDown', 'Escape'. */
export const pressKey = async (wrapper, key) => {
  await searchInput(wrapper).trigger('keydown', { key })
  await nextTick()
}

/** Focus, optionally type search text, then press Enter. */
export const searchSubmit = async (wrapper, searchText = undefined) => {
  await searchFocus(wrapper)
  if (searchText) await typeSearch(wrapper, searchText)
  await pressKey(wrapper, 'Enter')
}

/** Focus, type text, press Enter: creates a tag when taggable. */
export const selectTag = (wrapper, searchText) => searchSubmit(wrapper, searchText)

/** Open the dropdown through the template-ref API. */
export const openDropdown = async (wrapper) => {
  wrapper.vm.open = true
  await nextTick()
}

/** Whether the dropdown is open (v-select has vs--open). */
export const isOpen = (wrapper) => wrapper.classes().includes('vs--open')

/** Rendered dropdown options. */
export const dropdownOptions = (wrapper) => wrapper.findAll('.vs__dropdown-option')

/** Text of the rendered dropdown options. */
export const dropdownOptionLabels = (wrapper) =>
  dropdownOptions(wrapper).map((option) => option.text())

/** Text of the rendered selected values. */
export const selectedLabels = (wrapper) =>
  wrapper.findAll('.vs__selected').map((selected) => selected.text())

/** Index of the highlighted option, or -1. */
export const highlightedIndex = (wrapper) =>
  dropdownOptions(wrapper).findIndex((option) =>
    option.classes().includes('vs__dropdown-option--highlight')
  )

/** The last value emitted with update:modelValue. */
export const lastEmittedValue = (wrapper) => {
  const events = wrapper.emitted('update:modelValue')
  return events ? events[events.length - 1][0] : undefined
}
