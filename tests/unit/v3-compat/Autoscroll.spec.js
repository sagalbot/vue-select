import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import {
  mountDefault,
  searchFocus,
  typeSearch,
  pressKey,
  dropdownOptions,
  highlightedIndex,
} from './helpers.js'

/**
 * v3 spied on the private maybeAdjustScroll method. v4 has no such method,
 * so these tests observe its effect: the menu's scrollTop.
 *
 * jsdom has no layout, so fake one: options are 50px tall and stacked from
 * y=0 (option i spans [i*50, i*50+50]); the menu shows y=50..100, i.e.
 * exactly option 1. Option 0 sits above the viewport, option 2 below it.
 */
const OPTION_HEIGHT = 50
const MENU_RECT = { top: 50, bottom: 100 }
const INITIAL_SCROLL_TOP = 100

const rect = (top, bottom) => ({
  top,
  bottom,
  left: 0,
  right: 100,
  width: 100,
  height: bottom - top,
  x: 0,
  y: top,
  toJSON() {},
})

const fakeLayout = () =>
  vi
    .spyOn(Element.prototype, 'getBoundingClientRect')
    .mockImplementation(function () {
      if (this.getAttribute('role') === 'listbox') {
        return rect(MENU_RECT.top, MENU_RECT.bottom)
      }
      const match = /-option-(\d+)$/.exec(this.id)
      if (match) {
        const top = Number(match[1]) * OPTION_HEIGHT
        return rect(top, top + OPTION_HEIGHT)
      }
      return rect(0, 0)
    })

/** The menu element, with a writable scrollTop jsdom would otherwise ignore. */
const menu = (wrapper) => {
  const el = wrapper.get('.vs__dropdown-menu').element
  if (!Object.prototype.hasOwnProperty.call(el, 'scrollTop')) {
    let scrollTop = INITIAL_SCROLL_TOP
    Object.defineProperty(el, 'scrollTop', {
      configurable: true,
      get: () => scrollTop,
      set: (value) => (scrollTop = value),
    })
  }
  return el
}

/** Open the dropdown and point at option 1 (fully visible: no scroll needed). */
const openAtOption1 = async (wrapper) => {
  menu(wrapper)
  await searchFocus(wrapper)
  await dropdownOptions(wrapper)[1].trigger('mouseover')
  await flushPromises()
  expect(highlightedIndex(wrapper)).toEqual(1)
  expect(menu(wrapper).scrollTop).toEqual(INITIAL_SCROLL_TOP)
}

describe('Automatic Scrolling', () => {
  let spy

  beforeEach(() => {
    spy = fakeLayout()
  })

  afterEach(() => {
    spy.mockRestore()
  })

  it('should check if the scroll position needs to be adjusted on up arrow keyUp', async () => {
    //  Given
    const Select = mountDefault()
    await openAtOption1(Select)

    //  When
    await pressKey(Select, 'ArrowUp')
    await flushPromises()

    //  Then: option 0 was above the viewport, scrolled up by its overflow
    expect(highlightedIndex(Select)).toEqual(0)
    expect(menu(Select).scrollTop).toEqual(INITIAL_SCROLL_TOP - OPTION_HEIGHT)
  })

  it('should check if the scroll position needs to be adjusted on down arrow keyUp', async () => {
    //  Given
    const Select = mountDefault()
    await openAtOption1(Select)

    //  When
    await pressKey(Select, 'ArrowDown')
    await flushPromises()

    //  Then: option 2 was below the viewport, scrolled down by its overflow
    expect(highlightedIndex(Select)).toEqual(2)
    expect(menu(Select).scrollTop).toEqual(INITIAL_SCROLL_TOP + OPTION_HEIGHT)
  })

  it('should check if the scroll position needs to be adjusted when filtered options changes', async () => {
    //  Given
    const Select = mountDefault()
    await openAtOption1(Select)

    //  When
    await typeSearch(Select, 'two')
    await flushPromises()

    //  Then: 'two' is now option 0, above the viewport
    expect(highlightedIndex(Select)).toEqual(0)
    expect(menu(Select).scrollTop).toEqual(INITIAL_SCROLL_TOP - OPTION_HEIGHT)
  })

  it('should not adjust scroll position when autoscroll is false', async () => {
    //  Given
    const Select = mountDefault({
      autoscroll: false,
    })
    await openAtOption1(Select)

    // When
    await typeSearch(Select, 'two')
    await flushPromises()

    //  Then
    expect(highlightedIndex(Select)).toEqual(0)
    expect(menu(Select).scrollTop).toEqual(INITIAL_SCROLL_TOP)
  })
})
