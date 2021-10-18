import pointerScroll from '../../src/mixins/pointerScroll'
import { mountDefault } from '../helpers'

describe('Automatic Scrolling', () => {
  let spy
  afterEach(() => {
    if (spy) spy.mockClear()
  })

  it('should check if the scroll position needs to be adjusted on up arrow keyUp', async () => {
    //  Given
    spy = jest.spyOn(pointerScroll.methods, 'maybeAdjustScroll')
    const Select = mountDefault()
    Select.vm.typeAheadPointer = 1

    //  When
    await Select.get('input').trigger('keydown.up')

    //  Then
    expect(spy).toHaveBeenCalled()
  })

  it('should check if the scroll position needs to be adjusted on down arrow keyUp', async () => {
    //  Given
    spy = jest.spyOn(pointerScroll.methods, 'maybeAdjustScroll')
    const Select = mountDefault()
    Select.vm.typeAheadPointer = 1

    //  When
    await Select.get('input').trigger('keydown.down')

    //  Then
    expect(spy).toHaveBeenCalled()
  })

  it('should check if the scroll position needs to be adjusted when filtered options changes', async () => {
    //  Given
    spy = jest.spyOn(pointerScroll.methods, 'maybeAdjustScroll')
    const Select = mountDefault()
    Select.vm.typeAheadPointer = 1

    //  When
    Select.vm.search = 'two'
    await Select.vm.$nextTick()

    //  Then
    expect(spy).toHaveBeenCalled()
  })

  it('should not adjust scroll position when autoscroll is false', async () => {
    //  Given
    spy = jest.spyOn(pointerScroll.methods, 'maybeAdjustScroll')
    const Select = mountDefault({
      autoscroll: false,
    })
    Select.vm.typeAheadPointer = 1

    // When
    Select.vm.search = 'two'
    await Select.vm.$nextTick()

    //  Then
    expect(spy).toHaveBeenCalledTimes(0)
  })
})
