import { selectWithProps } from '../helpers'

describe('Selectable prop', () => {
  it('should select selectable option if clicked', async () => {
    const Select = selectWithProps({
      options: ['one', 'two', 'three'],
      selectable: (option) => option === 'one',
    })

    Select.vm.$data.open = true
    await Select.vm.$nextTick()

    Select.find('.vs__dropdown-menu li:first-child').trigger('mousedown')

    await Select.vm.$nextTick()
    expect(Select.vm.selectedValue).toEqual(['one'])
  })

  it('should not select not selectable option if clicked', async () => {
    const Select = selectWithProps({
      options: ['one', 'two', 'three'],
      selectable: (option) => option === 'one',
    })

    Select.vm.$data.open = true
    await Select.vm.$nextTick()

    Select.find('.vs__dropdown-menu li:last-child').trigger('mousedown')
    await Select.vm.$nextTick()

    expect(Select.vm.selectedValue).toEqual([])
  })

  it('should skip non-selectable option on down arrow keyDown', () => {
    const Select = selectWithProps({
      options: ['one', 'two', 'three'],
      selectable: (option) => option !== 'two',
    })

    Select.vm.typeAheadPointer = 1

    Select.find({ ref: 'search' }).trigger('keydown.down')

    expect(Select.vm.typeAheadPointer).toEqual(2)
  })

  it('should skip non-selectable option on up arrow keyDown', () => {
    const Select = selectWithProps({
      options: ['one', 'two', 'three'],
      selectable: (option) => option !== 'two',
    })

    Select.vm.typeAheadPointer = 2

    Select.find({ ref: 'search' }).trigger('keydown.up')

    expect(Select.vm.typeAheadPointer).toEqual(0)
  })
})
