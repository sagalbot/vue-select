import { mountDefault } from '../helpers'

describe('Automatic Scrolling', () => {
  it('should check if the scroll position needs to be adjusted on up arrow keyUp', async () => {
    //  Given
    const Select = mountDefault()
    const spy = jest.spyOn(Select.vm, 'maybeAdjustScroll')
    Select.vm.typeAheadPointer = 1

    //  When
    Select.findComponent({ ref: 'search' }).trigger('keydown.up')
    await Select.vm.$nextTick()

    //  Then
    expect(spy).toHaveBeenCalled()
  })

  it('should check if the scroll position needs to be adjusted on down arrow keyUp', async () => {
    //  Given
    const Select = mountDefault()
    const spy = jest.spyOn(Select.vm, 'maybeAdjustScroll')
    Select.vm.typeAheadPointer = 1

    //  When
    Select.findComponent({ ref: 'search' }).trigger('keydown.down')
    await Select.vm.$nextTick()

    //  Then
    expect(spy).toHaveBeenCalled()
  })

  it('should check if the scroll position needs to be adjusted when filtered options changes', async () => {
    //  Given
    const Select = mountDefault()
    const spy = jest.spyOn(Select.vm, 'maybeAdjustScroll')
    Select.vm.typeAheadPointer = 1

    //  When
    Select.vm.search = 'two'
    await Select.vm.$nextTick()

    //  Then
    expect(spy).toHaveBeenCalled()
  })

  it('should not adjust scroll position when autoscroll is false', async () => {
    //  Given
    const Select = mountDefault({
      autoscroll: false,
    })
    const spy = jest.spyOn(Select.vm, 'maybeAdjustScroll')
    Select.vm.typeAheadPointer = 1

    // When
    Select.vm.search = 'two'
    await Select.vm.$nextTick()

    //  Then
    expect(spy).toHaveBeenCalledTimes(0)
  })
})
