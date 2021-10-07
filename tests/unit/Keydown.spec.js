import { mountDefault } from '../helpers'

describe('Custom Keydown Handlers', () => {
  it('can use the map-keydown prop to trigger custom behaviour', () => {
    const onKeyDown = jest.fn()
    const Select = mountDefault({
      mapKeydown: (defaults, vm) => ({ ...defaults, 32: onKeyDown }),
    })

    Select.findComponent({ ref: 'search' }).trigger('keydown.space')

    expect(onKeyDown.mock.calls.length).toBe(1)
  })

  it('selectOnKeyCodes should trigger a selection for custom keycodes', () => {
    const Select = mountDefault({
      selectOnKeyCodes: [32],
    })

    const spy = jest.spyOn(Select.vm, 'typeAheadSelect')

    Select.findComponent({ ref: 'search' }).trigger('keydown.space')

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('even works when combining selectOnKeyCodes with map-keydown', () => {
    const onKeyDown = jest.fn()
    const Select = mountDefault({
      mapKeydown: (defaults, vm) => ({ ...defaults, 32: onKeyDown }),
      selectOnKeyCodes: [9],
    })

    const spy = jest.spyOn(Select.vm, 'typeAheadSelect')

    Select.findComponent({ ref: 'search' }).trigger('keydown.space')
    expect(onKeyDown.mock.calls.length).toBe(1)

    Select.findComponent({ ref: 'search' }).trigger('keydown.tab')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  describe('CompositionEvent support', () => {
    it('will not select a value with enter if the user is composing', () => {
      const Select = mountDefault()
      const spy = jest.spyOn(Select.vm, 'typeAheadSelect')

      Select.findComponent({ ref: 'search' }).trigger('compositionstart')
      Select.findComponent({ ref: 'search' }).trigger('keydown.enter')
      expect(spy).toHaveBeenCalledTimes(0)

      Select.findComponent({ ref: 'search' }).trigger('compositionend')
      Select.findComponent({ ref: 'search' }).trigger('keydown.enter')
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('will not select a value with tab if the user is composing', () => {
      const Select = mountDefault({ selectOnTab: true })
      const spy = jest.spyOn(Select.vm, 'typeAheadSelect')

      Select.findComponent({ ref: 'search' }).trigger('compositionstart')
      Select.findComponent({ ref: 'search' }).trigger('keydown.tab')
      expect(spy).toHaveBeenCalledTimes(0)

      Select.findComponent({ ref: 'search' }).trigger('compositionend')
      Select.findComponent({ ref: 'search' }).trigger('keydown.tab')
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})
