import { it, describe, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import VueSelect from '@/components/VueSelect.vue'
import {
  dropdownOptionLabels,
  openDropdown,
  searchInput,
  selectWithProps,
} from './helpers.js'

describe('Labels', () => {
  it('can generate labels using a custom label key', () => {
    const Select = selectWithProps({
      options: [{ name: 'Foo' }],
      label: 'name',
      modelValue: { name: 'Foo' },
    })
    expect(Select.find('.vs__selected').text()).toBe('Foo')
  })
  it('will console.warn when options contain objects without a valid label key', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const Select = selectWithProps({
      options: [{}],
    })

    await openDropdown(Select)

    expect(spy).toHaveBeenCalledWith(
      '[vue-select warn]: Label key "option.label" does not exist in options object {}.' +
        '\nhttps://vue-select.org/api/props#getoptionlabel'
    )
    spy.mockRestore()
  })

  it('should display a placeholder if the value is empty', async () => {
    const Select = mount(VueSelect, {
      props: {
        options: ['one'],
      },
      attrs: {
        placeholder: 'foo',
      },
    })

    expect(searchInput(Select).attributes('placeholder')).toEqual('foo')
    await Select.vm.select('one')
    expect(searchInput(Select).attributes('placeholder')).not.toBeDefined()
  })

  // v3 called the default getOptionLabel directly; v4 has no public default,
  // so these check what it renders for an option.
  describe('getOptionLabel', () => {
    it('will return undefined if the option lacks the label key', async () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const Select = selectWithProps({
        options: [{ name: 'vue' }],
        label: 'label',
      })
      await openDropdown(Select)
      // v3 returned undefined, which renders as empty text
      expect(dropdownOptionLabels(Select)).toEqual([''])
      spy.mockRestore()
    })

    it('will return a string value for a valid key', async () => {
      const Select = selectWithProps({
        options: [{ label: 'vue' }],
        label: 'label',
      })
      await openDropdown(Select)
      expect(dropdownOptionLabels(Select)).toEqual(['vue'])
    })

    // v3 had to comment this out because of a Vue 2 bug (vuejs/vue#10224):
    // slot fallbacks ran even when the slot was provided. Vue 3 doesn't.
    it('will not call getOptionLabel if both option slots are used and a filter is provided', async () => {
      const getOptionLabel = vi.fn((option) => option.name)
      const Select = selectWithProps({
        options: [{ name: 'one' }],
        filter: (options) => options,
        getOptionLabel,
      }, {
        slots: {
          option: (option) => h('span', { class: 'option' }, option.name),
          'selected-option': (option) => h('span', { class: 'selected' }, option.name),
        },
      })

      Select.vm.open = true
      Select.vm.select({ name: 'one' })
      await Select.vm.$nextTick()

      expect(getOptionLabel).toHaveBeenCalledTimes(0)
      expect(Select.find('.selected').exists()).toBeTruthy()
      expect(Select.find('.option').exists()).toBeTruthy()
    })
  })
})
