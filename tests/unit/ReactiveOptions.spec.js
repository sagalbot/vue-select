import { nextTick } from "vue"
import { mount, shallowMount } from '@vue/test-utils'
import VueSelect from '../../src/components/Select.vue'
import { mountDefault } from '../helpers'

describe('Reset on options change', () => {
  it('should not reset the selected value by default when the options property changes', () => {
    const Select = shallowMount(VueSelect, {
      props: { options: ['one'] },
    })

    Select.vm.$data._value = 'one'

    Select.setProps({ options: ['four', 'five', 'six'] })
    expect(Select.vm.selectedValue).toEqual(['one'])
  })

  describe('resetOnOptionsChange as a function', () => {
    it('will yell at you if resetOnOptionsChange is not a function or boolean', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})

      mountDefault({ resetOnOptionsChange: 1 })
      if (spy.mock.calls.length > 0) {
        expect(spy.mock.calls[0][0]).toContain(
          'Invalid prop: custom validator check failed for prop "resetOnOptionsChange"'
        )
      }

      mountDefault({ resetOnOptionsChange: 'one' })
      if (spy.mock.calls.length > 1) {
        expect(spy.mock.calls[1][0]).toContain(
          'Invalid prop: custom validator check failed for prop "resetOnOptionsChange"'
        )
      }

      mountDefault({ resetOnOptionsChange: [] })
      if (spy.mock.calls.length > 2) {
        expect(spy.mock.calls[2][0]).toContain(
          'Invalid prop: custom validator check failed for prop "resetOnOptionsChange"'
        )
      }

      mountDefault({ resetOnOptionsChange: {} })
      if (spy.mock.calls.length > 3) {
        expect(spy.mock.calls[3][0]).toContain(
          'Invalid prop: custom validator check failed for prop "resetOnOptionsChange"'
        )
      }

      spy.mockRestore()
    })

    it('should receive the new options, old options, and current value', async () => {
      let resetOnOptionsChange = jest.fn((option) => option)
      const Select = mountDefault({
        resetOnOptionsChange,
        options: ['bear'],
        modelValue: 'selected',
      })

      Select.setProps({ options: ['lake', 'kite'] })
      await nextTick()

      expect(resetOnOptionsChange).toHaveBeenCalledTimes(1)
      expect(resetOnOptionsChange).toHaveBeenCalledWith(
        ['lake', 'kite'],
        ['bear'],
        ['selected']
      )
    })

    it('should allow resetOnOptionsChange to be a function that returns true', async () => {
      let resetOnOptionsChange = () => true
      const Select = shallowMount(VueSelect, {
        props: { resetOnOptionsChange, options: ['one'], modelValue: 'one' },
      })
      const spy = jest.spyOn(Select.vm, 'clearSelection')

      Select.setProps({ options: ['one', 'two'] })
      await nextTick()

      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should allow resetOnOptionsChange to be a function that returns false', () => {
      let resetOnOptionsChange = () => false
      const Select = shallowMount(VueSelect, {
        props: { resetOnOptionsChange, options: ['one'], modelValue: 'one' },
      })
      const spy = jest.spyOn(Select.vm, 'clearSelection')

      Select.setProps({ options: ['one', 'two'] })
      expect(spy).not.toHaveBeenCalled()
    })

    it('should reset the options if the selectedValue does not exist in the new options', async () => {
      let resetOnOptionsChange = (options, old, val) =>
        val.some((val) => options.includes(val))
      const Select = shallowMount(VueSelect, {
        props: { resetOnOptionsChange, options: ['one'], modelValue: 'one' },
      })
      const spy = jest.spyOn(Select.vm, 'clearSelection')

      Select.setProps({ options: ['one', 'two'] })
      await nextTick()

      expect(Select.vm.selectedValue).toEqual(['one'])

      Select.setProps({ options: ['two'] })
      await nextTick()

      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  it('should reset the selected value when the options property changes', async () => {
    const Select = shallowMount(VueSelect, {
      props: { resetOnOptionsChange: true, options: ['one'] },
    })

    Select.vm.$data._value = 'one'

    Select.setProps({ options: ['four', 'five', 'six'] })
    await nextTick()

    expect(Select.vm.selectedValue).toEqual([])
  })

  it('should return correct selected value when the options property changes and a new option matches', async () => {
    const Select = shallowMount(VueSelect, {
      props: {
        modelValue: 'one',
        options: [],
        reduce(option) {
          return option.modelValue
        },
      },
    })

    Select.setProps({ options: [{ label: 'oneLabel', modelValue: 'one' }] })
    await nextTick()

    expect(Select.vm.selectedValue).toEqual([
      { label: 'oneLabel', modelValue: 'one' },
    ])
  })

  it('clearSearchOnBlur returns false when multiple is true', async () => {
    const Select = mountDefault({})
    let clearSearchOnBlur = jest.spyOn(Select.vm, 'clearSearchOnBlur')
    await Select.find('.vs__search').trigger('click')
    Select.vm.search = 'one'
    await Select.find('.vs__search').trigger('blur')

    expect(clearSearchOnBlur).toHaveBeenCalledTimes(1)
    expect(clearSearchOnBlur).toHaveBeenCalledWith({
      clearSearchOnSelect: true,
      multiple: false,
    })
    expect(Select.vm.search).toBe('')
  })

  it('clearSearchOnBlur accepts a function', async () => {
    let clearSearchOnBlur = jest.fn(() => false)
    const Select = mountDefault({ clearSearchOnBlur })

    await Select.find('.vs__search').trigger('click')
    Select.vm.search = 'one'
    await Select.find('.vs__search').trigger('blur')

    expect(clearSearchOnBlur).toHaveBeenCalledTimes(1)
    expect(Select.vm.search).toBe('one')
  })
})
