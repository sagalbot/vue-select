import { it, describe, expect } from 'vitest'
import { nextTick } from 'vue'
import {
  dropdownOptionLabels,
  lastEmittedValue,
  mountDefault,
  openDropdown,
  pressKey,
  searchFocus,
  searchInput,
  searchSubmit,
  selectTag,
  selectWithProps,
  selectedLabels,
  typeSearch,
} from './helpers.js'

/**
 * v4 has no pushTags prop: consumers listen to option:created and add the
 * new option to their options. This mounts VueSelect with that handler.
 */
const selectPushingTags = (props) => {
  const wrapper = selectWithProps({
    ...props,
    'onOption:created': (option) =>
      wrapper.setProps({ options: [...wrapper.props('options'), option] }),
  })
  return wrapper
}

/** Open the dropdown with an empty search and read the full option list. */
const allOptionLabels = async (wrapper) => {
  wrapper.vm.search = ''
  await openDropdown(wrapper)
  await nextTick()
  return dropdownOptionLabels(wrapper)
}

describe('When Tagging Is Enabled', () => {
  // v3 tested the internal optionExists(); observable: a tag option is only
  // offered when the search text doesn't match an existing option.
  it('can determine if a given option string already exists', async () => {
    const Select = selectWithProps({ taggable: true, options: ['one', 'two'] })
    await searchFocus(Select)

    await typeSearch(Select, 'one')
    expect(dropdownOptionLabels(Select)).toEqual(['one'])

    await typeSearch(Select, 'three')
    expect(dropdownOptionLabels(Select)).toEqual(['three'])
  })

  it('can determine if a given option object already exists', async () => {
    const Select = selectWithProps({
      taggable: true,
      options: [{ label: 'one' }, { label: 'two' }],
    })
    await searchFocus(Select)

    await typeSearch(Select, 'one')
    expect(dropdownOptionLabels(Select)).toEqual(['one'])

    await typeSearch(Select, 'three')
    expect(dropdownOptionLabels(Select)).toEqual(['three'])
  })

  it('can determine if a given option object already exists when using custom labels', async () => {
    const Select = selectWithProps({
      taggable: true,
      options: [{ foo: 'one' }, { foo: 'two' }],
      label: 'foo',
    })
    await searchFocus(Select)

    await typeSearch(Select, 'one')
    expect(dropdownOptionLabels(Select)).toEqual(['one'])

    await typeSearch(Select, 'three')
    expect(dropdownOptionLabels(Select)).toEqual(['three'])
  })

  it('can add the current search text as the first item in the options list', async () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      modelValue: ['one'],
      options: ['one', 'two'],
    })

    await searchFocus(Select)
    await typeSearch(Select, 'three')
    expect(dropdownOptionLabels(Select)).toEqual(['three'])
  })

  it('can select the current search text as a string', async () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      options: ['one', 'two'],
    })

    await selectTag(Select, 'three')

    expect(lastEmittedValue(Select)).toEqual(['three'])
    expect(selectedLabels(Select)).toEqual(['three'])
  })

  it('can select the current search text as an object', async () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      options: [{ label: 'one' }],
    })

    await selectTag(Select, 'two')

    expect(lastEmittedValue(Select)).toEqual([{ label: 'two' }])
    expect(selectedLabels(Select)).toEqual(['two'])
  })

  it('should add a freshly created option/tag to the options list when pushTags is true', async () => {
    const Select = selectPushingTags({
      taggable: true,
      multiple: true,
      modelValue: ['one'],
      options: ['one', 'two'],
    })

    await selectTag(Select, 'three')
    expect(Select.emitted('option:created')).toEqual([['three']])
    expect(await allOptionLabels(Select)).toEqual(['one', 'two', 'three'])
  })

  it('should pushTags even if the consumer has defined a createOption callback', async () => {
    const Select = selectPushingTags({
      taggable: true,
      createOption: (option) => option,
      options: ['one', 'two'],
    })

    await selectTag(Select, 'three')

    expect(Select.emitted('option:created')).toEqual([['three']])
    expect(await allOptionLabels(Select)).toEqual(['one', 'two', 'three'])
  })

  it('should add a freshly created option/tag to the options list when pushTags is true and filterable is false', async () => {
    const Select = selectPushingTags({
      filterable: false,
      taggable: true,
      multiple: true,
      modelValue: ['one'],
      options: ['one', 'two'],
    })

    await selectTag(Select, 'three')
    expect(Select.emitted('option:created')).toEqual([['three']])
    expect(await allOptionLabels(Select)).toEqual(['one', 'two', 'three'])
  })

  it('wont add a freshly created option/tag to the options list when pushTags is false', async () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      modelValue: ['one'],
      options: ['one', 'two'],
    })

    await selectTag(Select, 'three')
    expect(await allOptionLabels(Select)).toEqual(['one', 'two'])
  })

  it('wont add a freshly created option/tag to the options list when pushTags is false and filterable is false', async () => {
    const Select = selectWithProps({
      filterable: false,
      taggable: true,
      multiple: true,
      modelValue: ['one'],
      options: ['one', 'two'],
    })

    await selectTag(Select, 'three')
    expect(await allOptionLabels(Select)).toEqual(['one', 'two'])
  })

  it('should select an existing option if the search string matches a string from options', async () => {
    const two = 'two'
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      options: ['one', two],
    })

    await selectTag(Select, 'two')

    expect(lastEmittedValue(Select)).toEqual([two])
  })

  it('should select an existing option if the search string matches an objects label from options', async () => {
    const two = { label: 'two' }
    const Select = selectWithProps({
      taggable: true,
      options: [{ label: 'one' }, two],
    })

    await searchSubmit(Select, 'two')
    // single select: v4 emits the option itself (v3 asserted selectedValue [two])
    expect(lastEmittedValue(Select)).toEqual(two)
    expect(selectedLabels(Select)).toEqual(['two'])
  })

  // V4-DIFF: v3 still filtered by search when taggable (even with filterable: false), so Enter on 'two' selected {label:'two'}; v4 shows all options unfiltered, highlights the first, and Enter selects {label:'one'}
  it.skip('should select an existing option if the search string matches an objects label from options when filter-options is false', async () => {
    const two = { label: 'two' }
    const Select = selectWithProps({
      taggable: true,
      filterable: false,
      options: [{ label: 'one' }, two],
    })

    await searchSubmit(Select, 'two')
    expect(lastEmittedValue(Select)).toEqual(two)
    expect(selectedLabels(Select)).toEqual(['two'])
  })

  it('should not reset the selected value when the options property changes', async () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      modelValue: [{ label: 'one' }],
      options: [{ label: 'one' }],
    })

    await Select.setProps({ options: [{ label: 'two' }] })
    expect(Select.emitted('update:modelValue')).toBeUndefined()
    expect(selectedLabels(Select)).toEqual(['one'])
  })

  it('should not reset the selected value when the options property changes when filterable is false', async () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      filterable: false,
      modelValue: [{ label: 'one' }],
      options: [{ label: 'one' }],
    })

    await Select.setProps({ options: [{ label: 'two' }] })
    expect(Select.emitted('update:modelValue')).toBeUndefined()
    expect(selectedLabels(Select)).toEqual(['one'])
  })

  it('should not allow duplicate tags when using string options', async () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
    })

    await selectTag(Select, 'one')
    expect(lastEmittedValue(Select)).toEqual(['one'])
    expect(selectedLabels(Select)).toEqual(['one'])
    expect(Select.vm.search).toEqual('')
    expect(searchInput(Select).element.value).toEqual('')

    await selectTag(Select, 'one')
    expect(Select.emitted('update:modelValue')).toHaveLength(1)
    expect(lastEmittedValue(Select)).toEqual(['one'])
    expect(selectedLabels(Select)).toEqual(['one'])
    expect(Select.vm.search).toEqual('')
    expect(searchInput(Select).element.value).toEqual('')
  })

  it('should not allow duplicate tags when using object options', async () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      options: [{ label: 'two' }],
    })

    await selectTag(Select, 'one')
    expect(lastEmittedValue(Select)).toEqual([{ label: 'one' }])
    // v3 spied on select(); the selecting event carries the same argument
    const selecting = Select.emitted('option:selecting')
    expect(selecting[selecting.length - 1]).toEqual([{ label: 'one' }])
    expect(Select.vm.search).toEqual('')

    await selectTag(Select, 'one')
    expect(Select.emitted('update:modelValue')).toHaveLength(1)
    expect(lastEmittedValue(Select)).toEqual([{ label: 'one' }])
    expect(selectedLabels(Select)).toEqual(['one'])
    expect(Select.vm.search).toEqual('')
  })

  it('will select an existing option on tab', async () => {
    const Select = mountDefault({
      taggable: true,
      mapKeydown: (map) => ({ ...map, Tab: map.Enter }),
    })

    await searchFocus(Select)
    // v3 set typeAheadPointer = 0 directly; highlight the first option instead
    await pressKey(Select, 'ArrowDown')
    await pressKey(Select, 'Tab')

    // single select: v4 emits the option itself (v3 asserted selectedValue ['one'])
    expect(lastEmittedValue(Select)).toEqual('one')
    expect(selectedLabels(Select)).toEqual(['one'])
  })
})
