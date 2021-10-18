import { DOMWrapper } from '@vue/test-utils'
import typeAheadPointer from '../../src/mixins/typeAheadPointer'
import { mountDefault } from '../helpers'

describe('Custom Keydown Handlers', () => {
  let spy
  afterEach(() => {
    if (spy) spy.mockClear()
  })

  it('can use the map-keydown prop to trigger custom behaviour', async () => {
    const onKeyDown = jest.fn()
    const Select = mountDefault({
      mapKeydown: (defaults, vm) => ({ ...defaults, 32: onKeyDown }),
    })

    await Select.get('input').trigger('keydown.space')

    expect(onKeyDown.mock.calls.length).toBe(1)
  })

  it('selectOnKeyCodes should trigger a selection for custom keycodes', () => {
    spy = jest.spyOn(typeAheadPointer.methods, 'typeAheadSelect')

    const Select = mountDefault({
      selectOnKeyCodes: [32],
    })

    Select.get('input').trigger('keydown.space')

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('even works when combining selectOnKeyCodes with map-keydown', () => {
    spy = jest.spyOn(typeAheadPointer.methods, 'typeAheadSelect')

    const onKeyDown = jest.fn()
    const Select = mountDefault({
      mapKeydown: (defaults, vm) => ({ ...defaults, 32: onKeyDown }),
      selectOnKeyCodes: [9],
    })

    Select.get('input').trigger('keydown.space')
    expect(onKeyDown.mock.calls.length).toBe(1)

    Select.get('input').trigger('keydown.tab')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  describe('CompositionEvent support', () => {
    it('will not select a value with enter if the user is composing', () => {
      spy = jest.spyOn(typeAheadPointer.methods, 'typeAheadSelect')

      const Select = mountDefault()

      Select.get('input').trigger('compositionstart')
      Select.get('input').trigger('keydown.enter')
      expect(spy).toHaveBeenCalledTimes(0)

      Select.get('input').trigger('compositionend')
      Select.get('input').trigger('keydown.enter')
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('will not select a value with tab if the user is composing', () => {
      spy = jest.spyOn(typeAheadPointer.methods, 'typeAheadSelect')

      const Select = mountDefault({ selectOnTab: true })

      Select.get('input').trigger('compositionstart')
      Select.get('input').trigger('keydown.tab')
      expect(spy).toHaveBeenCalledTimes(0)

      Select.get('input').trigger('compositionend')
      Select.get('input').trigger('keydown.tab')
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})
