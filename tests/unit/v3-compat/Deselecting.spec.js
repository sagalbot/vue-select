import { it, describe, expect } from 'vitest'
import { nextTick } from 'vue'
import {
  mountDefault,
  selectWithProps,
  searchFocus,
  pressKey,
  selectedLabels,
  lastEmittedValue,
} from './helpers.js'

/**
 * Mount with v-model wired up: update:modelValue writes back to the
 * modelValue prop, as a parent using v-model would.
 */
const withVModel = (mountFn, props) => {
  const wrapper = mountFn({
    ...props,
    'onUpdate:modelValue': (value) => wrapper.setProps({ modelValue: value }),
  })
  return wrapper
}

describe('Removing values', () => {
  it('can remove the given tag when its close icon is clicked', async () => {
    const Select = withVModel(selectWithProps, {
      multiple: true,
      modelValue: ['one'],
    })
    expect(selectedLabels(Select)).toEqual(['one'])

    await Select.find('.vs__deselect').trigger('click')
    await nextTick()
    expect(Select.emitted()['update:modelValue']).toEqual([[[]]])
    expect(selectedLabels(Select)).toEqual([])
  })

  it('should not remove tag when close icon is clicked and component is disabled', async () => {
    const Select = withVModel(selectWithProps, {
      modelValue: ['one'],
      options: ['one', 'two', 'three'],
      multiple: true,
      disabled: true,
    })

    await Select.find('.vs__deselect').trigger('click')
    await nextTick()
    expect(Select.emitted('update:modelValue')).toBeUndefined()
    expect(selectedLabels(Select)).toEqual(['one'])
  })

  it('should remove the last item in the value array on delete keypress when multiple is true', async () => {
    const Select = withVModel(selectWithProps, {
      multiple: true,
      options: ['one', 'two', 'three'],
      modelValue: ['one', 'two'],
    })

    await pressKey(Select, 'Backspace')

    expect(Select.emitted()['update:modelValue']).toEqual([[['one']]])
    expect(selectedLabels(Select)).toEqual(['one'])
  })

  // v4: single-select deselection emits null (v3's selectedValue was []).
  it('should set value to null on delete keypress when multiple is false', async () => {
    const Select = withVModel(selectWithProps, {
      options: ['one', 'two', 'three'],
      modelValue: 'one',
    })

    await pressKey(Select, 'Backspace')
    expect(lastEmittedValue(Select)).toEqual(null)
    expect(selectedLabels(Select)).toEqual([])
  })

  it('will not emit update:modelValue event if value has not changed with backspace', async () => {
    const Select = withVModel(mountDefault, { modelValue: 'one' })
    await pressKey(Select, 'Backspace')
    expect(Select.emitted()['update:modelValue'].length).toBe(1)

    await pressKey(Select, 'Backspace')
    await pressKey(Select, 'Backspace')
    expect(Select.emitted()['update:modelValue'].length).toBe(1)
  })

  it('should deselect a selected option when clicked and deselectFromDropdown is true', async () => {
    const Select = withVModel(selectWithProps, {
      modelValue: 'one',
      options: ['one', 'two', 'three'],
      deselectFromDropdown: true,
    })

    await searchFocus(Select)

    await Select.find('.vs__dropdown-option--selected').trigger('click')
    await nextTick()

    expect(Select.emitted('option:deselected')).toEqual([['one']])
    expect(lastEmittedValue(Select)).toEqual(null)
    expect(selectedLabels(Select)).toEqual([])
  })

  it('should not deselect a selected option when clicked if clearable is false', async () => {
    const Select = withVModel(selectWithProps, {
      modelValue: 'one',
      options: ['one', 'two', 'three'],
      clearable: false,
      deselectFromDropdown: true,
    })

    await searchFocus(Select)

    await Select.find('.vs__dropdown-option--selected').trigger('click')
    await nextTick()

    expect(Select.emitted('option:deselected')).toBeUndefined()
    expect(Select.emitted('update:modelValue')).toBeUndefined()
    expect(selectedLabels(Select)).toEqual(['one'])
  })

  it('should not deselect a selected option when clicked if deselectFromDropdown is false', async () => {
    const Select = withVModel(selectWithProps, {
      modelValue: 'one',
      options: ['one', 'two', 'three'],
      deselectFromDropdown: false,
    })

    await searchFocus(Select)

    await Select.find('.vs__dropdown-option--selected').trigger('click')
    await nextTick()

    expect(Select.emitted('option:deselected')).toBeUndefined()
    expect(Select.emitted('update:modelValue')).toBeUndefined()
    expect(selectedLabels(Select)).toEqual(['one'])
  })

  describe('Clear button', () => {
    it('should be displayed on single select when value is selected', () => {
      const Select = selectWithProps({
        options: ['foo', 'bar'],
        modelValue: 'foo',
      })

      expect(Select.get('button.vs__clear').isVisible()).toEqual(true)
    })

    // v4 intended change: the clear button also shows in multi-select
    // (v3: "should not be displayed on multiple select").
    it('should be displayed on multiple select', () => {
      const Select = selectWithProps({
        options: ['foo', 'bar'],
        modelValue: 'foo',
        multiple: true,
      })

      expect(Select.get('button.vs__clear').isVisible()).toEqual(true)
    })

    it('should remove selected value when clicked', async () => {
      const Select = withVModel(selectWithProps, {
        options: ['foo', 'bar'],
        modelValue: 'foo',
      })

      expect(selectedLabels(Select)).toEqual(['foo'])
      await Select.find('button.vs__clear').trigger('click')
      await nextTick()

      expect(Select.emitted()['update:modelValue']).toEqual([[null]])
      expect(selectedLabels(Select)).toEqual([])
    })

    it('should be disabled when component is disabled', () => {
      const Select = selectWithProps({
        options: ['foo', 'bar'],
        modelValue: 'foo',
        disabled: true,
      })

      expect(
        Select.find('button.vs__clear').attributes().disabled
      ).toBeDefined()
    })
  })
})
