import { it, describe, expect, afterEach } from 'vitest'
import { nextTick } from 'vue'
import {
  selectWithProps,
  searchInput,
  searchFocus,
  typeSearch,
  pressKey,
  isOpen,
  dropdownOptions,
} from './helpers.js'

/** Mousedown on an element inside the toggle, as a user click starts. */
const mousedown = async (wrapper, selector) => {
  await wrapper.get(selector).trigger('mousedown')
  await nextTick()
}

// A real click on an element: mousedown, then click
const press = async (wrapper, selector) => {
  await mousedown(wrapper, selector)
  await wrapper.get(selector).trigger('click')
}

describe('Toggling Dropdown', () => {
  let Select
  afterEach(() => {
    // Unmount attached wrappers so they don't leak into document.body
    if (Select) Select.unmount()
    Select = undefined
  })

  it('should not open the dropdown when the el is clicked but the component is disabled', async () => {
    Select = selectWithProps({ disabled: true })
    await mousedown(Select, '.vs__dropdown-toggle')
    expect(isOpen(Select)).toEqual(false)
    expect(Select.vm.open).toEqual(false)
  })

  // v4 change: clicking the field focuses the input without opening the
  // dropdown; the toggle button opens it (WAI-ARIA APG / Headless UI model).
  // `openOnFocus` restores v3's click-to-open.
  it('focuses without opening when the el is clicked', async () => {
    Select = selectWithProps(
      { modelValue: [{ label: 'one' }], options: [{ label: 'one' }] },
      { attachTo: document.body }
    )

    await press(Select, '.vs__search')
    await mousedown(Select, '.vs__selected')
    expect(isOpen(Select)).toEqual(false)
    expect(document.activeElement).toBe(searchInput(Select).element)
  })

  it('should open the dropdown when the el is clicked with openOnFocus', async () => {
    Select = selectWithProps(
      { modelValue: [{ label: 'one' }], options: [{ label: 'one' }], openOnFocus: true },
      { attachTo: document.body }
    )

    await mousedown(Select, '.vs__selected')
    expect(isOpen(Select)).toEqual(true)
  })

  it('can open and close the dropdown with the toggle button', async () => {
    Select = selectWithProps({}, { attachTo: document.body })
    const input = searchInput(Select).element

    // First click opens and focuses the search input
    await press(Select, '.vs__open-indicator-button')
    expect(isOpen(Select)).toEqual(true)
    expect(document.activeElement).toBe(input)

    // Second click closes it, keeping focus in the input
    await press(Select, '.vs__open-indicator-button')
    expect(isOpen(Select)).toEqual(false)
    expect(document.activeElement).toBe(input)
  })

  it('closes the dropdown when an option is selected, multiple is true, and closeOnSelect option is true', async () => {
    Select = selectWithProps({
      modelValue: [],
      options: ['one', 'two', 'three'],
      multiple: true,
    })

    await searchFocus(Select)
    expect(isOpen(Select)).toEqual(true)
    await dropdownOptions(Select)[0].trigger('click')

    expect(Select.emitted('update:modelValue')).toEqual([[['one']]])
    expect(isOpen(Select)).toEqual(false)
  })

  it('does not close the dropdown when the el is clicked, multiple is true, and closeOnSelect option is false', async () => {
    Select = selectWithProps({
      modelValue: [],
      options: ['one', 'two', 'three'],
      multiple: true,
      closeOnSelect: false,
    })

    await searchFocus(Select)
    expect(isOpen(Select)).toEqual(true)
    await dropdownOptions(Select)[0].trigger('click')

    expect(Select.emitted('update:modelValue')).toEqual([[['one']]])
    expect(isOpen(Select)).toEqual(true)
  })

  it('should close the dropdown on search blur', async () => {
    Select = selectWithProps({
      options: [{ label: 'one' }],
    })

    Select.vm.open = true
    await nextTick()
    expect(isOpen(Select)).toEqual(true)
    await Select.get('input').trigger('blur')

    expect(isOpen(Select)).toEqual(false)
  })

  it('will close the dropdown and emit the search:blur event from onSearchBlur', async () => {
    Select = selectWithProps()

    Select.vm.open = true
    await nextTick()
    await searchInput(Select).trigger('blur')

    expect(isOpen(Select)).toEqual(false)
    expect(Select.emitted('search:blur')).toHaveLength(1)
  })

  // v4 change (accessibility): focus alone no longer opens the dropdown,
  // following the WAI-ARIA APG combobox examples. A click opens it.
  it('emits search:focus on focus without opening', async () => {
    Select = selectWithProps()

    await searchInput(Select).trigger('focus')
    expect(Select.emitted('search:focus')).toHaveLength(1)
    expect(isOpen(Select)).toEqual(false)
  })

  it('opens on focus with openOnFocus', async () => {
    Select = selectWithProps({ openOnFocus: true })

    await searchInput(Select).trigger('focus')
    expect(Select.emitted('search:focus')).toHaveLength(1)
    expect(isOpen(Select)).toEqual(true)
  })

  it('will close the dropdown on escape, if search is empty', async () => {
    Select = selectWithProps()

    await searchFocus(Select)
    expect(isOpen(Select)).toEqual(true)
    await pressKey(Select, 'Escape')

    expect(isOpen(Select)).toEqual(false)
  })

  // v4 change (accessibility): v3 blurred the input on Escape with an empty
  // search, dropping keyboard focus to the page. v4 keeps focus on the
  // combobox, as the WAI-ARIA combobox pattern expects.
  it('keeps focus on the search input on escape, if search is empty', async () => {
    Select = selectWithProps({}, { attachTo: document.body })
    const input = searchInput(Select).element

    Select.vm.focus()
    await nextTick()
    expect(document.activeElement).toBe(input)
    await pressKey(Select, 'Escape')

    expect(document.activeElement).toBe(input)
    expect(isOpen(Select)).toBe(false)
    Select.unmount()
  })

  it('should remove existing search text on escape keydown', async () => {
    Select = selectWithProps({
      modelValue: [{ label: 'one' }],
      options: [{ label: 'one' }],
    })

    await typeSearch(Select, 'foo')
    expect(Select.vm.search).toEqual('foo')

    // v4 change (WAI-ARIA APG): the first Escape closes the dropdown, a
    // second one clears the search text. v3 cleared the text first.
    await pressKey(Select, 'Escape')
    expect(isOpen(Select)).toEqual(false)
    expect(Select.vm.search).toEqual('foo')
    await pressKey(Select, 'Escape')

    expect(Select.vm.search).toEqual('')
    expect(searchInput(Select).element.value).toEqual('')
  })

  it('should have an open class when dropdown is active', async () => {
    Select = selectWithProps()

    expect(Select.classes('vs--open')).toEqual(false)

    Select.vm.open = true
    await nextTick()
    expect(Select.classes('vs--open')).toEqual(true)
  })

  // v3 `noDrop` is `open: false` in v4: the dropdown never opens, and a
  // click only reports that it wants to open via update:open.
  it('should not display the dropdown if noDrop is true', async () => {
    Select = selectWithProps({
      open: false,
      options: ['one'],
    })

    await press(Select, '.vs__open-indicator-button')

    expect(Select.emitted('update:open')).toEqual([[true]])
    expect(Select.vm.open).toEqual(false)

    expect(Select.get('.vs__dropdown-menu').isVisible()).toBe(false)
    expect(Select.get('.vs__dropdown-option').isVisible()).toBe(false)
    expect(Select.classes('vs--open')).toBeFalsy()
  })

  // v4 change: noDrop is gone. vs--searching means "there is search text",
  // also when the dropdown is held closed with :open="false".
  it('adds the searching state class when the dropdown is held closed', async () => {
    Select = selectWithProps({
      open: false,
    })

    await typeSearch(Select, 'Canada')

    expect(Select.classes('vs--searching')).toBe(true)
    expect(Select.classes('vs--open')).toBe(false)
  })

  it('can be opened with dropdownShouldOpen', () => {
    Select = selectWithProps({
      open: true,
      options: ['one'],
    })

    expect(Select.classes('vs--open')).toBeTruthy()
    expect(Select.find('.vs__dropdown-menu li').exists()).toBeTruthy()
    expect(Select.get('.vs__dropdown-menu').isVisible()).toBe(true)
  })
})
