import { nextTick } from "vue"
import { mountDefault } from '../helpers'

describe('Automatic Scrolling', () => {
  it('should check if the scroll position needs to be adjusted on up arrow keyUp', async () => {
    //  Given
    const Select = mountDefault()
    const spy = jest.spyOn(Select.vm, 'maybeAdjustScroll')
    Select.vm.typeAheadPointer = 1

    //  When
    Select.find('.vs__search').trigger('keydown.up')
    await nextTick()

    //  Then
    expect(spy).toHaveBeenCalled()
  })

  it('should check if the scroll position needs to be adjusted on down arrow keyUp', async () => {
    //  Given
    const Select = mountDefault()
    const spy = jest.spyOn(Select.vm, 'maybeAdjustScroll')
    Select.vm.typeAheadPointer = 1

    //  When
    Select.find('.vs__search').trigger('keydown.down')
    await nextTick()

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
    await nextTick()

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
    await nextTick()

    //  Then
    expect(spy).toHaveBeenCalledTimes(0)
  })
})
