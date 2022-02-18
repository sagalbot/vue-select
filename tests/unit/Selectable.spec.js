import { searchSubmit, selectWithProps } from '../helpers'

describe('Selectable prop', () => {
  it('should select selectable option if clicked', async () => {
    const Select = selectWithProps({
      options: ['one', 'two', 'three'],
      selectable: (option) => option === 'one',
    })

    Select.vm.open = true
    await Select.vm.$nextTick()

    await Select.find('.vs__dropdown-menu li:first-child').trigger('click')

    expect(Select.vm.selectedValue).toEqual(['one'])
  })

  it('should not select not selectable option if clicked', async () => {
    const Select = selectWithProps({
      options: ['one', 'two', 'three'],
      selectable: (option) => option === 'one',
    })

    Select.vm.open = true
    await Select.vm.$nextTick()

    await Select.find('.vs__dropdown-menu li:last-child').trigger('click')

    expect(Select.vm.selectedValue).toEqual([])
  })

  it('should skip non-selectable option on down arrow keyDown', async () => {
    const Select = selectWithProps({
      options: ['one', 'two', 'three'],
      selectable: (option) => option !== 'two',
    })

    Select.vm.typeAheadPointer = 1

    await Select.get('input').trigger('keydown.down')

    expect(Select.vm.typeAheadPointer).toEqual(2)
  })

  it('should skip non-selectable option on up arrow keyDown', async () => {
    const Select = selectWithProps({
      options: ['one', 'two', 'three'],
      selectable: (option) => option !== 'two',
    })

    Select.vm.typeAheadPointer = 2

    await Select.get('input').trigger('keydown.up')

    expect(Select.vm.typeAheadPointer).toEqual(0)
  })

  it('should not let the user select an unselectable option with return', async () => {
    const Select = selectWithProps({
      options: ['one', 'two'],
      multiple: true,
      selectable: (option) => option !== 'two',
    })

    // this sets the typeAheadPointer to 0
    await searchSubmit(Select, 'one')
    expect(Select.vm.selectedValue).toEqual(['one'])

    await searchSubmit(Select, 'two')
    expect(Select.vm.selectedValue).toEqual(['one'])
  })
})
