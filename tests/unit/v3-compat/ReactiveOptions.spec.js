import { it, describe, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import VueSelect from '@/components/VueSelect.vue'
import {
  mountDefault,
  searchInput,
  searchFocus,
  typeSearch,
  selectedLabels,
  lastEmittedValue,
} from './helpers.js'

/** Select an option as a user would: focus, then click it in the dropdown. */
const clickOption = async (wrapper, label) => {
  await searchFocus(wrapper)
  const option = wrapper
    .findAll('.vs__dropdown-option')
    .find((o) => o.text() === label)
  await option.trigger('click')
  await nextTick()
}

/** The selection was cleared: update:modelValue was emitted with null. */
const clearedCount = (wrapper) =>
  (wrapper.emitted('update:modelValue') ?? []).filter(([value]) => value === null).length

describe('Reset on options change', () => {
  it('should not reset the selected value by default when the options property changes', async () => {
    const Select = mount(VueSelect, {
      props: { options: ['one'] },
    })

    await clickOption(Select, 'one')
    expect(selectedLabels(Select)).toEqual(['one'])

    await Select.setProps({ options: ['four', 'five', 'six'] })
    expect(selectedLabels(Select)).toEqual(['one'])
    expect(clearedCount(Select)).toBe(0)
  })

  describe('resetOnOptionsChange as a function', () => {
    let spy
    afterEach(() => {
      if (spy) spy.mockRestore()
    })

    it('will yell at you if resetOnOptionsChange is not a function or boolean', () => {
      spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // v4 declares the prop as `boolean | function`, so Vue's type check
      // warns (v3 used a custom validator, with a different message).
      const message = 'Invalid prop: type check failed for prop "resetOnOptionsChange"'

      mountDefault({ resetOnOptionsChange: 1 })
      expect(spy.mock.calls[0][0]).toContain(message)

      mountDefault({ resetOnOptionsChange: 'one' })
      expect(spy.mock.calls[1][0]).toContain(message)

      mountDefault({ resetOnOptionsChange: [] })
      expect(spy.mock.calls[2][0]).toContain(message)

      mountDefault({ resetOnOptionsChange: {} })
      expect(spy.mock.calls[3][0]).toContain(message)
    })

    it('should receive the new options, old options, and current value', async () => {
      const resetOnOptionsChange = vi.fn((option) => option)
      const Select = mountDefault({
        resetOnOptionsChange,
        options: ['bear'],
        modelValue: 'selected',
      })

      await Select.setProps({ options: ['lake', 'kite'] })

      expect(resetOnOptionsChange).toHaveBeenCalledTimes(1)
      expect(resetOnOptionsChange).toHaveBeenCalledWith(
        ['lake', 'kite'],
        ['bear'],
        ['selected']
      )
    })

    it('should allow resetOnOptionsChange to be a function that returns true', async () => {
      const resetOnOptionsChange = () => true
      const Select = mount(VueSelect, {
        props: { resetOnOptionsChange, options: ['one'], modelValue: 'one' },
      })

      await Select.setProps({ options: ['one', 'two'] })

      expect(clearedCount(Select)).toBe(1)
    })

    it('should allow resetOnOptionsChange to be a function that returns false', async () => {
      const resetOnOptionsChange = () => false
      const Select = mount(VueSelect, {
        props: { resetOnOptionsChange, options: ['one'], modelValue: 'one' },
      })

      await Select.setProps({ options: ['one', 'two'] })
      expect(Select.emitted('update:modelValue')).toBeUndefined()
      expect(selectedLabels(Select)).toEqual(['one'])
    })

    it('should reset the options if the selectedValue does not exist in the new options', async () => {
      const resetOnOptionsChange = (options, old, val) =>
        val.some((val) => options.includes(val))
      const Select = mount(VueSelect, {
        props: { resetOnOptionsChange, options: ['one'], modelValue: 'one' },
      })

      await Select.setProps({ options: ['one', 'two'] })

      expect(selectedLabels(Select)).toEqual(['one'])

      await Select.setProps({ options: ['two'] })

      expect(clearedCount(Select)).toBe(1)
    })
  })

  it('should reset the selected value when the options property changes', async () => {
    const Select = mount(VueSelect, {
      props: { resetOnOptionsChange: true, options: ['one'] },
    })

    await clickOption(Select, 'one')
    expect(selectedLabels(Select)).toEqual(['one'])

    await Select.setProps({ options: ['four', 'five', 'six'] })

    expect(lastEmittedValue(Select)).toBeNull()
    expect(selectedLabels(Select)).toEqual([])
  })

  it('should return correct selected value when the options property changes and a new option matches', async () => {
    const Select = mount(VueSelect, {
      props: {
        modelValue: 'one',
        options: [],
        reduce(option) {
          return option.value
        },
      },
    })

    await Select.setProps({ options: [{ label: 'oneLabel', value: 'one' }] })

    expect(selectedLabels(Select)).toEqual(['oneLabel'])
  })

  // v4: clearSearchOnBlur is a boolean that defaults to
  // `clearSearchOnSelect && !multiple` (v3: a function receiving those).
  it('clearSearchOnBlur returns false when multiple is true', async () => {
    const Select = mountDefault({})
    await searchFocus(Select)
    await typeSearch(Select, 'one')
    await searchInput(Select).trigger('blur')

    expect(Select.vm.search).toBe('')
    expect(searchInput(Select).element.value).toBe('')

    const Multiple = mountDefault({ multiple: true })
    await searchFocus(Multiple)
    await typeSearch(Multiple, 'one')
    await searchInput(Multiple).trigger('blur')

    expect(Multiple.vm.search).toBe('one')
  })

  // v4: clearSearchOnBlur is a boolean, not a function; `false` stands in
  // for v3's `() => false`.
  it('clearSearchOnBlur accepts a function', async () => {
    const Select = mountDefault({ clearSearchOnBlur: false })

    await searchFocus(Select)
    await typeSearch(Select, 'one')
    await searchInput(Select).trigger('blur')

    expect(Select.vm.search).toBe('one')
    expect(searchInput(Select).element.value).toBe('one')
  })
})
