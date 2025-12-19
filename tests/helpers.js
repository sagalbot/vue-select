import { shallowMount } from '@vue/test-utils'
import VueSelect from '../src/components/Select.vue'
import { createApp, nextTick, h } from 'vue'

/**
 * Trigger a submit event on the search
 * input with a provided search text.
 *
 * @param Wrapper
 * @param searchText
 */
export const searchSubmit = async (Wrapper, searchText = false) => {
  const search = Wrapper.find('.vs__search')
  await search.trigger('focus')

  if (searchText) {
    Wrapper.vm.search = searchText
    await nextTick()
  }

  await search.trigger('keydown.enter')
  await nextTick()
}

/**
 * Focus the input, enter some search text, hit return.
 * @param Wrapper
 * @param searchText
 * @return {Promise<void>}
 */
export const selectTag = async (Wrapper, searchText) => {
  const search = Wrapper.find('.vs__search')
  await search.trigger('focus')
  await nextTick()

  Wrapper.vm.search = searchText
  await nextTick()

  Wrapper.find('.vs__search').trigger('keydown.enter')
  await nextTick()
}

/**
 * Create a new VueSelect instance with
 * a provided set of props.
 * @param props
 * @returns {Wrapper}
 */
export const selectWithProps = (props = {}) => {
  return shallowMount(VueSelect, { props })
}

/**
 * Returns a Wrapper with a v-select component.
 * @param props
 * @param options
 * @return {Wrapper}
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
 * @return {Object}
 */
export const mountWithoutTestUtils = (props = {}, options = {}) => {
  const container = document.createElement('div')
  const app = createApp({
    render() {
      return h(VueSelect, {
        ref: 'select',
        options: ['one', 'two', 'three'],
        ...props,
        ...options,
      })
    },
  })
  const vm = app.mount(container)
  return vm.$refs.select
}
