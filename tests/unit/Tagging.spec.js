import {
  mountDefault,
  searchSubmit,
  selectTag,
  selectWithProps,
} from '../helpers'
import VueSelect from '../../src/components/Select'

describe('When Tagging Is Enabled', () => {
  it('can determine if a given option string already exists', () => {
    const Select = selectWithProps({ taggable: true, options: ['one', 'two'] })
    expect(Select.vm.optionExists('one')).toEqual(true)
    expect(Select.vm.optionExists('three')).toEqual(false)
  })

  it('can determine if a given option object already exists', () => {
    const Select = selectWithProps({
      taggable: true,
      options: [{ label: 'one' }, { label: 'two' }],
    })

    expect(Select.vm.optionExists({ label: 'one' })).toEqual(true)
    expect(Select.vm.optionExists({ label: 'three' })).toEqual(false)
  })

  it('can determine if a given option object already exists when using custom labels', () => {
    const Select = selectWithProps({
      taggable: true,
      options: [{ foo: 'one' }, { foo: 'two' }],
      label: 'foo',
    })

    const createOption = (text) => Select.vm.createOption(text)

    expect(Select.vm.optionExists(createOption('one'))).toEqual(true)
    expect(Select.vm.optionExists(createOption('three'))).toEqual(false)
  })

  it('can add the current search text as the first item in the options list', async () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      modelValue: ['one'],
      options: ['one', 'two'],
    })

    Select.vm.search = 'three'
    await Select.vm.$nextTick()
    expect(Select.vm.filteredOptions).toEqual(['three'])
  })

  it('can select the current search text as a string', async () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      options: ['one', 'two'],
    })

    await selectTag(Select, 'three')

    expect(Select.vm.selectedValue).toEqual(['three'])
  })

  it('can select the current search text as an object', async () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      options: [{ label: 'one' }],
    })

    await selectTag(Select, 'two')

    expect(Select.vm.selectedValue).toEqual([{ label: 'two' }])
  })

  it('should add a freshly created option/tag to the options list when pushTags is true', async () => {
    const Select = selectWithProps({
      pushTags: true,
      taggable: true,
      multiple: true,
      modelValue: ['one'],
      options: ['one', 'two'],
    })

    await selectTag(Select, 'three')
    expect(Select.vm.pushedTags).toEqual(['three'])
    expect(Select.vm.optionList).toEqual(['one', 'two', 'three'])
  })

  it('should pushTags even if the consumer has defined a createOption callback', async () => {
    const Select = selectWithProps({
      pushTags: true,
      taggable: true,
      createOption: (option) => option,
      options: ['one', 'two'],
    })

    await selectTag(Select, 'three')

    expect(Select.vm.pushedTags).toEqual(['three'])
    expect(Select.vm.optionList).toEqual(['one', 'two', 'three'])
  })

  it('should add a freshly created option/tag to the options list when pushTags is true and filterable is false', async () => {
    const Select = selectWithProps({
      filterable: false,
      pushTags: true,
      taggable: true,
      multiple: true,
      modelValue: ['one'],
      options: ['one', 'two'],
    })

    await selectTag(Select, 'three')
    expect(Select.vm.pushedTags).toEqual(['three'])
    expect(Select.vm.optionList).toEqual(['one', 'two', 'three'])
    expect(Select.vm.filteredOptions).toEqual(['one', 'two', 'three'])
  })

  it('wont add a freshly created option/tag to the options list when pushTags is false', async () => {
    const Select = selectWithProps({
      pushTags: false,
      taggable: true,
      multiple: true,
      modelValue: ['one'],
      options: ['one', 'two'],
    })

    await selectTag(Select, 'three')
    expect(Select.vm.optionList).toEqual(['one', 'two'])
  })

  it('wont add a freshly created option/tag to the options list when pushTags is false and filterable is false', async () => {
    const Select = selectWithProps({
      filterable: false,
      pushTags: false,
      taggable: true,
      multiple: true,
      modelValue: ['one'],
      options: ['one', 'two'],
    })

    await selectTag(Select, 'three')
    expect(Select.vm.optionList).toEqual(['one', 'two'])
    expect(Select.vm.filteredOptions).toEqual(['one', 'two'])
  })

  it('should select an existing option if the search string matches a string from options', async () => {
    let two = 'two'
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      options: ['one', two],
    })

    await selectTag(Select, 'two')

    expect(Select.vm.selectedValue).toEqual([two])
  })

  it('should select an existing option if the search string matches an objects label from options', async () => {
    let two = { label: 'two' }
    const Select = selectWithProps({
      taggable: true,
      options: [{ label: 'one' }, two],
    })

    await searchSubmit(Select, 'two')
    expect(Select.vm.selectedValue).toEqual([two])
  })

  it('should select an existing option if the search string matches an objects label from options when filter-options is false', async () => {
    let two = { label: 'two' }
    const Select = selectWithProps({
      taggable: true,
      filterable: false,
      options: [{ label: 'one' }, two],
    })

    await searchSubmit(Select, 'two')
    expect(Select.vm.selectedValue).toEqual([two])
  })

  it('should not reset the selected value when the options property changes', () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      modelValue: [{ label: 'one' }],
      options: [{ label: 'one' }],
    })

    Select.setProps({ options: [{ label: 'two' }] })
    expect(Select.vm.selectedValue).toEqual([{ label: 'one' }])
  })

  it('should not reset the selected value when the options property changes when filterable is false', () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      filterable: false,
      modelValue: [{ label: 'one' }],
      options: [{ label: 'one' }],
    })

    Select.setProps({ options: [{ label: 'two' }] })
    expect(Select.vm.selectedValue).toEqual([{ label: 'one' }])
  })

  it('should not allow duplicate tags when using string options', async () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
    })

    await selectTag(Select, 'one')
    expect(Select.vm.selectedValue).toEqual(['one'])
    expect(Select.vm.search).toEqual('')

    await selectTag(Select, 'one')
    expect(Select.vm.selectedValue).toEqual(['one'])
    expect(Select.vm.search).toEqual('')
  })

  it('should not allow duplicate tags when using object options', async () => {
    const spy = jest.spyOn(VueSelect.methods, 'select')
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      options: [{ label: 'two' }],
    })

    await selectTag(Select, 'one')
    expect(Select.vm.selectedValue).toEqual([{ label: 'one' }])
    expect(spy).lastCalledWith({ label: 'one' })
    expect(Select.vm.search).toEqual('')

    await selectTag(Select, 'one')
    expect(Select.vm.selectedValue).toEqual([{ label: 'one' }])
    expect(Select.vm.search).toEqual('')
  })

  it('will select an existing option on tab', async () => {
    const Select = mountDefault({
      taggable: true,
      selectOnTab: true,
    })

    Select.vm.typeAheadPointer = 0
    await Select.get('input').trigger('keydown.tab')

    expect(Select.vm.selectedValue).toEqual(['one'])
  })
})
