import { it, describe, expect, vi } from 'vitest'
import {
  mountDefault,
  searchFocus,
  searchInput,
  pressKey,
  lastEmittedValue,
} from './helpers.js'

/** Focus the search (opens the dropdown) and highlight the first option. */
const focusAndHighlightFirst = async (wrapper) => {
  await searchFocus(wrapper)
  await pressKey(wrapper, 'ArrowDown')
}

describe('Custom Keydown Handlers', () => {
  it('can use the map-keydown prop to trigger custom behaviour', async () => {
    const onKeyDown = vi.fn()
    const Select = mountDefault({
      mapKeydown: (defaults) => ({ ...defaults, ' ': onKeyDown }),
    })

    await pressKey(Select, ' ')

    expect(onKeyDown.mock.calls.length).toBe(1)
  })

  it('selectOnKeyCodes should trigger a selection for custom keycodes', async () => {
    // v3 selectOnKeyCodes: [32] -> v4 mapKeydown mapping Space to Enter
    const Select = mountDefault({
      mapKeydown: (map) => ({ ...map, ' ': map.Enter }),
    })

    await focusAndHighlightFirst(Select)
    await pressKey(Select, ' ')

    expect(Select.emitted('update:modelValue')).toHaveLength(1)
    expect(lastEmittedValue(Select)).toEqual('one')
  })

  it('even works when combining selectOnKeyCodes with map-keydown', async () => {
    // v3 selectOnKeyCodes: [9] -> v4 mapKeydown mapping Tab to Enter
    const onKeyDown = vi.fn()
    const Select = mountDefault({
      mapKeydown: (map) => ({ ...map, ' ': onKeyDown, Tab: map.Enter }),
    })

    await focusAndHighlightFirst(Select)

    await pressKey(Select, ' ')
    expect(onKeyDown.mock.calls.length).toBe(1)
    expect(Select.emitted('update:modelValue')).toBeUndefined()

    await pressKey(Select, 'Tab')
    expect(Select.emitted('update:modelValue')).toHaveLength(1)
    expect(lastEmittedValue(Select)).toEqual('one')
  })

  describe('CompositionEvent support', () => {
    it('will not select a value with enter if the user is composing', async () => {
      const Select = mountDefault()
      await focusAndHighlightFirst(Select)

      await searchInput(Select).trigger('compositionstart')
      await pressKey(Select, 'Enter')
      expect(Select.emitted('update:modelValue')).toBeUndefined()

      await searchInput(Select).trigger('compositionend')
      await pressKey(Select, 'Enter')
      expect(Select.emitted('update:modelValue')).toHaveLength(1)
      expect(lastEmittedValue(Select)).toEqual('one')
    })

    it('will not select a value with tab if the user is composing', async () => {
      // v3 selectOnTab -> v4 mapKeydown mapping Tab to Enter
      const Select = mountDefault({
        mapKeydown: (map) => ({ ...map, Tab: map.Enter }),
      })
      await focusAndHighlightFirst(Select)

      await searchInput(Select).trigger('compositionstart')
      await pressKey(Select, 'Tab')
      expect(Select.emitted('update:modelValue')).toBeUndefined()

      await searchInput(Select).trigger('compositionend')
      await pressKey(Select, 'Tab')
      expect(Select.emitted('update:modelValue')).toHaveLength(1)
      expect(lastEmittedValue(Select)).toEqual('one')
    })
  })
})
