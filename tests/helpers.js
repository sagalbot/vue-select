import { shallowMount } from '@vue/test-utils'
import VueSelect from '../src/components/Select.vue'
import Vue from 'vue'

/**
 * Trigger a submit event on the search
 * input with a provided search text.
 *
 * @param Wrapper {Wrapper<Vue>}
 * @param searchText
 */
export const searchSubmit = async (Wrapper, searchText = undefined) => {
  await Wrapper.get('input').trigger('focus')

  if (searchText) {
    Wrapper.vm.search = searchText
    await Wrapper.vm.$nextTick()
  }

  await Wrapper.get('input').trigger('keydown.enter')
}

/**
 * Focus the search input
 */
export const searchFocus = async (Wrapper) => {
  await Wrapper.get('input').trigger('focus')
  await Wrapper.vm.$nextTick()
}

/**
 * Focus the input, enter some search text, hit return.
 * @param Wrapper {Wrapper<Vue>}
 * @param searchText
 * @return {Promise<void>}
 */
export const selectTag = async (Wrapper, searchText) => {
  Wrapper.vm.$refs.search.focus()
  await Wrapper.vm.$nextTick()

  Wrapper.vm.search = searchText
  await Wrapper.vm.$nextTick()

  await Wrapper.get('input').trigger('keydown.enter')
}

/**
 * Create a new VueSelect instance with
 * a provided set of props.
 * @param props
 * @returns {Wrapper<Vue>}
 */
export const selectWithProps = (props = {}) => {
  return shallowMount(VueSelect, { props })
}

/**
 * Returns a Wrapper with a v-select component.
 * @param props
 * @param options
 * @return {Wrapper<Vue>}
 */
export const mountDefault = (props = {}, options = {}) => {
  return shallowMount(VueSelect, {
    props: {
      options: ['one', 'two', 'three'],
      ...props,
    },
    ...options,
  })
}

/**
 * Returns a v-select component directly.
 * @param props
 * @param options
 * @return {Vue | Element | Vue[] | Element[]}
 */
export const mountWithoutTestUtils = (props = {}, options = {}) => {
  return createApp({
    render: (createEl) =>
      createEl('vue-select', {
        ref: 'select',
        props: { options: ['one', 'two', 'three'], ...props },
        ...options,
      }),
    components: { VueSelect },
  }).mount().$refs.select
}
