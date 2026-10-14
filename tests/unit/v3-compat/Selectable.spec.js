import { it, describe, expect } from 'vitest'
import {
  searchSubmit,
  selectWithProps,
  searchFocus,
  pressKey,
  dropdownOptions,
  highlightedIndex,
  selectedLabels,
  lastEmittedValue,
} from './helpers.js'

/** Point the typeahead at an option by hovering it, as a user would. */
const hoverOption = async (wrapper, index) => {
  await dropdownOptions(wrapper)[index].trigger('mouseover')
}

describe('Selectable prop', () => {
  it('should select selectable option if clicked', async () => {
    const Select = selectWithProps({
      options: ['one', 'two', 'three'],
      selectable: (option) => option === 'one',
    })

    Select.vm.open = true
    await Select.vm.$nextTick()

    await Select.find('.vs__dropdown-menu li:first-child').trigger('click')

    expect(lastEmittedValue(Select)).toEqual('one')
    expect(selectedLabels(Select)).toEqual(['one'])
  })

  it('should not select not selectable option if clicked', async () => {
    const Select = selectWithProps({
      options: ['one', 'two', 'three'],
      selectable: (option) => option === 'one',
    })

    Select.vm.open = true
    await Select.vm.$nextTick()

    await Select.find('.vs__dropdown-menu li:last-child').trigger('click')

    expect(Select.emitted('update:modelValue')).toBeUndefined()
    expect(selectedLabels(Select)).toEqual([])
  })

  it('should skip non-selectable option on down arrow keyDown', async () => {
    const Select = selectWithProps({
      options: ['one', 'two', 'three'],
      selectable: (option) => option !== 'two',
    })

    // v3 put the pointer on 1 (the unselectable 'two') directly; a user
    // can't highlight it, so start from 'one' and step over 'two'.
    await searchFocus(Select)
    await hoverOption(Select, 0)
    expect(highlightedIndex(Select)).toEqual(0)

    await pressKey(Select, 'ArrowDown')

    expect(highlightedIndex(Select)).toEqual(2)
  })

  it('should skip non-selectable option on up arrow keyDown', async () => {
    const Select = selectWithProps({
      options: ['one', 'two', 'three'],
      selectable: (option) => option !== 'two',
    })

    await searchFocus(Select)
    await hoverOption(Select, 2)
    expect(highlightedIndex(Select)).toEqual(2)

    await pressKey(Select, 'ArrowUp')

    expect(highlightedIndex(Select)).toEqual(0)
  })

  it('should not let the user select an unselectable option with return', async () => {
    const Select = selectWithProps({
      options: ['one', 'two'],
      multiple: true,
      selectable: (option) => option !== 'two',
    })

    // this sets the typeAheadPointer to 0
    await searchSubmit(Select, 'one')
    expect(lastEmittedValue(Select)).toEqual(['one'])
    expect(selectedLabels(Select)).toEqual(['one'])

    await searchSubmit(Select, 'two')
    expect(Select.emitted('update:modelValue')).toHaveLength(1)
    expect(selectedLabels(Select)).toEqual(['one'])
  })
})
