import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { ref, computed, shallowRef } from 'vue'
import ComboBoxInput from '@/components/ComboBox/ComboBoxInput.vue'
import { ComboBoxKey } from '@/keys'
import { createMockContext } from './mockContext'

function mountInput(ctxOverrides = {}) {
  const ctx = createMockContext(ctxOverrides)
  const wrapper = mount(ComboBoxInput, {
    global: {
      provide: { [ComboBoxKey as symbol]: ctx },
    },
  })
  return { wrapper, ctx }
}

describe('ComboBoxInput', () => {
  it('renders an input with type="search"', () => {
    const { wrapper } = mountInput()
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('search')
  })

  it('has correct ARIA attributes', () => {
    const { wrapper } = mountInput()
    const input = wrapper.find('input')
    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-autocomplete')).toBe('list')
    expect(input.attributes('aria-expanded')).toBe('false')
    expect(input.attributes('aria-controls')).toBe('vs-test-listbox')
    expect(input.attributes('autocomplete')).toBe('off')
  })

  it('sets aria-activedescendant when pointer is active', () => {
    const { wrapper } = mountInput({ typeAheadPointer: ref(2) })
    const input = wrapper.find('input')
    expect(input.attributes('aria-activedescendant')).toBe('vs-test-option-2')
  })

  it('does not set aria-activedescendant when pointer is -1', () => {
    const { wrapper } = mountInput()
    const input = wrapper.find('input')
    expect(input.attributes('aria-activedescendant')).toBeUndefined()
  })

  it('calls setSearch on input', async () => {
    const { wrapper, ctx } = mountInput()
    const input = wrapper.find('input')
    await input.setValue('hello')
    expect(ctx.setSearch).toHaveBeenCalledWith('hello')
  })

  it('ArrowDown opens a closed dropdown without moving the highlight', async () => {
    const { wrapper, ctx } = mountInput()
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    expect(ctx.setOpen).toHaveBeenCalledWith(true)
    expect(ctx.typeAheadDown).not.toHaveBeenCalled()
  })

  it('ArrowDown calls typeAheadDown when open', async () => {
    const { wrapper, ctx } = mountInput({ open: ref(true) })
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    expect(ctx.typeAheadDown).toHaveBeenCalled()
  })

  it('ArrowUp calls typeAheadUp when open', async () => {
    const { wrapper, ctx } = mountInput({ open: ref(true) })
    await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
    expect(ctx.typeAheadUp).toHaveBeenCalled()
  })

  it('Enter calls typeAheadSelect when open with an option highlighted', async () => {
    const { wrapper, ctx } = mountInput({ open: ref(true), typeAheadPointer: ref(0) })
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    expect(ctx.typeAheadSelect).toHaveBeenCalled()
  })

  it('Enter closes the dropdown when nothing is highlighted', async () => {
    const { wrapper, ctx } = mountInput({ open: ref(true) })
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    expect(ctx.typeAheadSelect).not.toHaveBeenCalled()
    expect(ctx.setOpen).toHaveBeenCalledWith(false)
  })

  it('Escape closes an open dropdown and keeps the search text', async () => {
    const { wrapper, ctx } = mountInput({
      open: ref(true),
      search: ref('hello'),
      isSearching: computed(() => true),
    })
    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    expect(ctx.setOpen).toHaveBeenCalledWith(false)
    expect(ctx.setSearch).not.toHaveBeenCalled()
  })

  it('Escape clears the search text once the dropdown is closed', async () => {
    const { wrapper, ctx } = mountInput({
      search: ref('hello'),
      isSearching: computed(() => true),
    })
    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    expect(ctx.setSearch).toHaveBeenCalledWith('')
  })

  it('ArrowDown on a closed dropdown with nothing selected highlights the first option', async () => {
    const { wrapper, ctx } = mountInput()
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    expect(ctx.typeAheadFirst).toHaveBeenCalled()
  })

  it('ArrowUp on a closed dropdown with nothing selected highlights the last option', async () => {
    const { wrapper, ctx } = mountInput()
    await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
    expect(ctx.setOpen).toHaveBeenCalledWith(true)
    expect(ctx.typeAheadLast).toHaveBeenCalled()
  })

  it('ArrowDown on a closed dropdown keeps the selected option highlighted', async () => {
    // opening highlighted the selected option (pointer 1)
    const { wrapper, ctx } = mountInput({ typeAheadPointer: ref(1) })
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    expect(ctx.typeAheadFirst).not.toHaveBeenCalled()
    expect(ctx.typeAheadDown).not.toHaveBeenCalled()
  })

  it('Alt+ArrowDown opens without moving the highlight', async () => {
    const { wrapper, ctx } = mountInput()
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown', altKey: true })
    expect(ctx.setOpen).toHaveBeenCalledWith(true)
    expect(ctx.typeAheadFirst).not.toHaveBeenCalled()
  })

  it('Escape closes dropdown when not searching', async () => {
    const { wrapper, ctx } = mountInput({ open: ref(true) })
    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    expect(ctx.setOpen).toHaveBeenCalledWith(false)
  })

  it('Backspace deselects last value when search empty and multiple', async () => {
    const lastOption = 'two'
    const { wrapper, ctx } = mountInput({
      multiple: computed(() => true),
      isValueEmpty: computed(() => false),
      selectedValue: computed(() => ['one', lastOption]),
    })
    await wrapper.find('input').trigger('keydown', { key: 'Backspace' })
    expect(ctx.deselect).toHaveBeenCalledWith(lastOption)
  })

  it('Backspace deselects the value in single-select', async () => {
    const { wrapper, ctx } = mountInput({
      isValueEmpty: computed(() => false),
      selectedValue: computed(() => ['one']),
    })
    await wrapper.find('input').trigger('keydown', { key: 'Backspace' })
    expect(ctx.deselect).toHaveBeenCalledWith('one')
  })

  it('Backspace does nothing when not clearable', async () => {
    const { wrapper, ctx } = mountInput({
      multiple: computed(() => true),
      clearable: computed(() => false),
      isValueEmpty: computed(() => false),
      selectedValue: computed(() => ['one', 'two']),
    })
    await wrapper.find('input').trigger('keydown', { key: 'Backspace' })
    expect(ctx.deselect).not.toHaveBeenCalled()
  })

  it('Backspace edits the search text instead when there is any', async () => {
    const { wrapper, ctx } = mountInput({
      search: ref('o'),
      isValueEmpty: computed(() => false),
      selectedValue: computed(() => ['one']),
    })
    await wrapper.find('input').trigger('keydown', { key: 'Backspace' })
    expect(ctx.deselect).not.toHaveBeenCalled()
  })

  it('focus does not open the dropdown', async () => {
    const { wrapper, ctx } = mountInput()
    await wrapper.find('input').trigger('focus')
    expect(ctx.setOpen).not.toHaveBeenCalled()
  })

  it('click does not open the dropdown', async () => {
    const { wrapper, ctx } = mountInput()
    await wrapper.find('input').trigger('click')
    expect(ctx.setOpen).not.toHaveBeenCalled()
    expect(ctx.toggleOpen).not.toHaveBeenCalled()
  })

  it('focus and click open the dropdown with openOnFocus', async () => {
    const { wrapper, ctx } = mountInput({ openOnFocus: computed(() => true) })
    await wrapper.find('input').trigger('focus')
    expect(ctx.setOpen).toHaveBeenCalledWith(true)
    ctx.setOpen = vi.fn()
    await wrapper.find('input').trigger('click')
    expect(ctx.setOpen).toHaveBeenCalledWith(true)
  })

  it('registers its element so the context can focus it', () => {
    const inputEl = shallowRef<HTMLElement | null>(null)
    const { wrapper } = mountInput({ inputEl })
    expect(inputEl.value).toBe(wrapper.find('input').element)
  })

  it('is disabled when context is disabled', () => {
    const { wrapper } = mountInput({ disabled: computed(() => true) })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  describe('when not searchable', () => {
    const fruit = ['Apple', 'Banana', 'Blueberry', 'Cherry']

    function mountSelectOnly(overrides = {}) {
      return mountInput({
        searchable: computed(() => false),
        filteredOptions: computed(() => fruit),
        ...overrides,
      })
    }

    it('renders a focusable combobox instead of a text input', () => {
      const { wrapper } = mountSelectOnly()
      expect(wrapper.find('input').exists()).toBe(false)
      const el = wrapper.find('[role="combobox"]')
      expect(el.element.tagName).toBe('DIV')
      expect(el.attributes('tabindex')).toBe('0')
      expect(el.attributes('aria-autocomplete')).toBeUndefined()
    })

    it('is removed from the tab order when disabled', () => {
      const { wrapper } = mountSelectOnly({ disabled: computed(() => true) })
      const el = wrapper.find('[role="combobox"]')
      expect(el.attributes('tabindex')).toBe('-1')
      expect(el.attributes('aria-disabled')).toBe('true')
    })

    it('Space and Enter open the dropdown when closed', async () => {
      const { wrapper, ctx } = mountSelectOnly()
      await wrapper.trigger('keydown', { key: ' ' })
      expect(ctx.setOpen).toHaveBeenCalledWith(true)
      await wrapper.trigger('keydown', { key: 'Enter' })
      expect(ctx.setOpen).toHaveBeenCalledTimes(2)
      expect(ctx.typeAheadSelect).not.toHaveBeenCalled()
    })

    it('typing a character highlights the first matching option', async () => {
      const typeAheadPointer = ref(-1)
      const { wrapper } = mountSelectOnly({ typeAheadPointer })
      await wrapper.trigger('keydown', { key: 'b' })
      expect(typeAheadPointer.value).toBe(1)
    })

    it('typing quickly matches the whole typed prefix', async () => {
      const typeAheadPointer = ref(-1)
      const { wrapper } = mountSelectOnly({ typeAheadPointer })
      await wrapper.trigger('keydown', { key: 'b' })
      await wrapper.trigger('keydown', { key: 'l' })
      expect(typeAheadPointer.value).toBe(2)
    })

    it('does not open on focus', async () => {
      const { wrapper, ctx } = mountSelectOnly()
      await wrapper.trigger('focus')
      expect(ctx.setOpen).not.toHaveBeenCalled()
    })

    it('click toggles the dropdown', async () => {
      const { wrapper, ctx } = mountSelectOnly()
      await wrapper.trigger('click')
      expect(ctx.toggleOpen).toHaveBeenCalled()
    })

    it('arrows do not wrap at the ends', async () => {
      const { wrapper, ctx } = mountSelectOnly({ open: ref(true) })
      await wrapper.trigger('keydown', { key: 'ArrowDown' })
      await wrapper.trigger('keydown', { key: 'ArrowUp' })
      expect(ctx.typeAheadDown).toHaveBeenCalledWith(false)
      expect(ctx.typeAheadUp).toHaveBeenCalledWith(false)
    })

    it('ArrowUp on a closed dropdown opens and highlights the first option', async () => {
      const { wrapper, ctx } = mountSelectOnly()
      await wrapper.trigger('keydown', { key: 'ArrowUp' })
      expect(ctx.setOpen).toHaveBeenCalledWith(true)
      expect(ctx.typeAheadFirst).toHaveBeenCalled()
    })

    it('Home and End highlight the first and last option', async () => {
      const { wrapper, ctx } = mountSelectOnly({ open: ref(true) })
      await wrapper.trigger('keydown', { key: 'Home' })
      expect(ctx.typeAheadFirst).toHaveBeenCalled()
      await wrapper.trigger('keydown', { key: 'End' })
      expect(ctx.typeAheadLast).toHaveBeenCalled()
    })

    it('PageDown moves ten options without wrapping', async () => {
      const { wrapper, ctx } = mountSelectOnly({ open: ref(true) })
      await wrapper.trigger('keydown', { key: 'PageDown' })
      expect(ctx.typeAheadDown).toHaveBeenCalledTimes(10)
      expect(ctx.typeAheadDown).toHaveBeenCalledWith(false)
    })

    it('Tab selects the highlighted option when open', async () => {
      const { wrapper, ctx } = mountSelectOnly({ open: ref(true) })
      await wrapper.trigger('keydown', { key: 'Tab' })
      expect(ctx.typeAheadSelect).toHaveBeenCalled()
    })

    it('Tab does nothing when closed', async () => {
      const { wrapper, ctx } = mountSelectOnly()
      await wrapper.trigger('keydown', { key: 'Tab' })
      expect(ctx.typeAheadSelect).not.toHaveBeenCalled()
    })

    it('Alt+ArrowUp selects and closes', async () => {
      const { wrapper, ctx } = mountSelectOnly({ open: ref(true) })
      await wrapper.trigger('keydown', { key: 'ArrowUp', altKey: true })
      expect(ctx.typeAheadSelect).toHaveBeenCalled()
      expect(ctx.setOpen).toHaveBeenCalledWith(false)
    })

    it('repeating a character cycles through options starting with it', async () => {
      const typeAheadPointer = ref(-1)
      const { wrapper } = mountSelectOnly({ typeAheadPointer })
      await wrapper.trigger('keydown', { key: 'b' })
      expect(typeAheadPointer.value).toBe(1) // Banana
      await wrapper.trigger('keydown', { key: 'b' })
      expect(typeAheadPointer.value).toBe(2) // Blueberry
      await wrapper.trigger('keydown', { key: 'b' })
      expect(typeAheadPointer.value).toBe(1) // back to Banana
    })
  })

  describe('Space (#1735)', () => {
    it('opens a closed dropdown instead of typing a space', async () => {
      const { wrapper, ctx } = mountInput()
      const event = new KeyboardEvent('keydown', { key: ' ', cancelable: true })
      wrapper.find('input').element.dispatchEvent(event)
      expect(ctx.setOpen).toHaveBeenCalledWith(true)
      expect(event.defaultPrevented).toBe(true)
    })

    it('types a space when the dropdown is open', async () => {
      const { wrapper, ctx } = mountInput({ open: ref(true) })
      const event = new KeyboardEvent('keydown', { key: ' ', cancelable: true })
      wrapper.find('input').element.dispatchEvent(event)
      expect(ctx.setOpen).not.toHaveBeenCalled()
      expect(event.defaultPrevented).toBe(false)
    })
  })

  describe('mapKeydown', () => {
    it('receives the default handlers and can add a key', async () => {
      const mapKeydown = vi.fn((map) => ({ ...map, ',': map.Enter }))
      const { wrapper, ctx } = mountInput({
        open: ref(true),
        typeAheadPointer: ref(0),
        mapKeydown,
      })
      await wrapper.find('input').trigger('keydown', { key: ',' })
      expect(Object.keys(mapKeydown.mock.calls[0][0])).toEqual(
        expect.arrayContaining(['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Backspace', ' '])
      )
      expect(ctx.typeAheadSelect).toHaveBeenCalled()
    })

    it('can remove a default handler', async () => {
      const mapKeydown = (map: Record<string, unknown>) => {
        const { Escape, ...rest } = map
        void Escape
        return rest
      }
      const { wrapper, ctx } = mountInput({ open: ref(true), mapKeydown })
      await wrapper.find('input').trigger('keydown', { key: 'Escape' })
      expect(ctx.setOpen).not.toHaveBeenCalled()
    })
  })

  describe('blur', () => {
    it('closes and clears the search when clearSearchOnBlur is true', async () => {
      const { wrapper, ctx } = mountInput({ clearSearchOnBlur: computed(() => true) })
      await wrapper.find('input').trigger('blur')
      expect(ctx.setOpen).toHaveBeenCalledWith(false)
      expect(ctx.setSearch).toHaveBeenCalledWith('')
    })

    it('keeps the search when clearSearchOnBlur is false', async () => {
      const { wrapper, ctx } = mountInput({ clearSearchOnBlur: computed(() => false) })
      await wrapper.find('input').trigger('blur')
      expect(ctx.setOpen).toHaveBeenCalledWith(false)
      expect(ctx.setSearch).not.toHaveBeenCalled()
    })
  })

  describe('input slot', () => {
    function mountWithSlot(attrs = {}) {
      const ctx = createMockContext()
      const wrapper = mount(ComboBoxInput, {
        attrs,
        global: { provide: { [ComboBoxKey as symbol]: ctx } },
        slots: {
          input: ({ attributes, events }: { attributes: object; events: object }) =>
            h('input', { class: 'custom', ...attributes, ...toListeners(events) }),
        },
      })
      return { wrapper, ctx }
    }

    // v-on="events" equivalent for a render function
    function toListeners(events: object) {
      return Object.fromEntries(
        Object.entries(events).map(([name, fn]) => [
          'on' + name[0].toUpperCase() + name.slice(1),
          fn,
        ])
      )
    }

    it('renders the slot instead of the default input, with combobox attributes', () => {
      const { wrapper } = mountWithSlot()
      const inputs = wrapper.findAll('input')
      expect(inputs).toHaveLength(1)
      expect(inputs[0].classes()).toContain('custom')
      expect(inputs[0].attributes('role')).toBe('combobox')
      expect(inputs[0].attributes('aria-controls')).toBe('vs-test-listbox')
    })

    it('passes events that drive the combobox', async () => {
      const { wrapper, ctx } = mountWithSlot()
      await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
      expect(ctx.setOpen).toHaveBeenCalledWith(true)
    })

    it('includes attributes and listeners given to ComboBoxInput', async () => {
      const onFocus = vi.fn()
      const { wrapper, ctx } = mountWithSlot({ id: 'country', onFocus })
      const input = wrapper.find('input')
      expect(input.attributes('id')).toBe('country')
      await input.trigger('focus')
      expect(onFocus).toHaveBeenCalledTimes(1)
      expect(ctx.inputEl.value).toBe(input.element)
    })
  })

  describe('placeholder', () => {
    it('shows while nothing is selected', () => {
      const { wrapper } = mountInput({ placeholder: computed(() => 'Pick one') })
      expect(wrapper.find('input').attributes('placeholder')).toBe('Pick one')
    })

    it('hides once something is selected', () => {
      const { wrapper } = mountInput({
        placeholder: computed(() => 'Pick one'),
        isValueEmpty: computed(() => false),
      })
      expect(wrapper.find('input').attributes('placeholder')).toBeUndefined()
    })
  })
})
