import { mountDefault, selectWithProps } from '../helpers'

describe('Removing values', () => {
  it('can remove the given tag when its close icon is clicked', async () => {
    const Select = selectWithProps({ multiple: true })
    Select.vm.$data._value = 'one'
    await Select.vm.$nextTick()

    Select.find('.vs__deselect').trigger('click')
    expect(Select.emitted()['update:modelValue']).toEqual([[[]]])
    expect(Select.vm.selectedValue).toEqual([])
  })

  it('should not remove tag when close icon is clicked and component is disabled', () => {
    const Select = selectWithProps({
      modelValue: ['one'],
      options: ['one', 'two', 'three'],
      multiple: true,
      disabled: true,
    })

    Select.find('.vs__deselect').trigger('click')
    expect(Select.vm.selectedValue).toEqual(['one'])
  })

  it('should remove the last item in the value array on delete keypress when multiple is true', () => {
    const Select = selectWithProps({
      multiple: true,
      options: ['one', 'two', 'three'],
    })

    Select.vm.$data._value = ['one', 'two']

    Select.find('.vs__search').trigger('keydown.backspace')

    expect(Select.emitted()['update:modelValue']).toEqual([[['one']]])
    expect(Select.vm.selectedValue).toEqual(['one'])
  })

  it('should set value to null on delete keypress when multiple is false', () => {
    const Select = selectWithProps({
      options: ['one', 'two', 'three'],
    })

    Select.vm.$data._value = 'one'

    Select.vm.maybeDeleteValue()
    expect(Select.vm.selectedValue).toEqual([])
  })

  it('will not emit update:modelValue event if value has not changed with backspace', () => {
    const Select = mountDefault()
    Select.vm.$data._value = 'one'
    Select.get('input').trigger('keydown.backspace')
    expect(Select.emitted()['update:modelValue'].length).toBe(1)

    Select.get('input').trigger('keydown.backspace')
    Select.get('input').trigger('keydown.backspace')
    expect(Select.emitted()['update:modelValue'].length).toBe(1)
  })

  it('should deselect a selected option when clicked and deselectFromDropdown is true', async () => {
    const Select = selectWithProps({
      modelValue: 'one',
      options: ['one', 'two', 'three'],
      deselectFromDropdown: true,
    })
    const deselect = spyOn(Select.vm, 'deselect')

    Select.vm.open = true
    await Select.vm.$nextTick()

    Select.find('.vs__dropdown-option--selected').trigger('click')
    await Select.vm.$nextTick()

    expect(deselect).toHaveBeenCalledWith('one')
  })

  it('should not deselect a selected option when clicked if clearable is false', async () => {
    const Select = selectWithProps({
      modelValue: 'one',
      options: ['one', 'two', 'three'],
      clearable: false,
      deselectFromDropdown: true,
    })
    const deselect = spyOn(Select.vm, 'deselect')

    Select.vm.open = true
    await Select.vm.$nextTick()

    Select.find('.vs__dropdown-option--selected').trigger('click')
    await Select.vm.$nextTick()

    expect(deselect).not.toHaveBeenCalledWith('one')
  })

  it('should not deselect a selected option when clicked if deselectFromDropdown is false', async () => {
    const Select = selectWithProps({
      modelValue: 'one',
      options: ['one', 'two', 'three'],
      deselectFromDropdown: false,
    })
    const deselect = spyOn(Select.vm, 'deselect')

    Select.vm.open = true
    await Select.vm.$nextTick()

    Select.find('.vs__dropdown-option--selected').trigger('click')
    await Select.vm.$nextTick()

    expect(deselect).not.toHaveBeenCalledWith('one')
  })

  describe('Clear button', () => {
    it('should be displayed on single select when value is selected', () => {
      const Select = selectWithProps({
        options: ['foo', 'bar'],
        modelValue: 'foo',
      })

      expect(Select.vm.showClearButton).toEqual(true)
    })

    it('should not be displayed on multiple select', () => {
      const Select = selectWithProps({
        options: ['foo', 'bar'],
        modelValue: 'foo',
        multiple: true,
      })

      expect(Select.vm.showClearButton).toEqual(false)
    })

    it('should remove selected value when clicked', () => {
      const Select = selectWithProps({
        options: ['foo', 'bar'],
      })
      Select.vm.$data._value = 'foo'

      expect(Select.vm.selectedValue).toEqual(['foo'])
      Select.find('button.vs__clear').trigger('click')

      expect(Select.emitted()['update:modelValue']).toEqual([[null]])
      expect(Select.vm.selectedValue).toEqual([])
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
