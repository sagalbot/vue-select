import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { ref, computed } from 'vue'
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

  it('ArrowDown calls typeAheadDown and opens dropdown', async () => {
    const { wrapper, ctx } = mountInput()
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    expect(ctx.typeAheadDown).toHaveBeenCalled()
    expect(ctx.setOpen).toHaveBeenCalledWith(true)
  })

  it('ArrowUp calls typeAheadUp', async () => {
    const { wrapper, ctx } = mountInput()
    await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
    expect(ctx.typeAheadUp).toHaveBeenCalled()
  })

  it('Enter calls typeAheadSelect when open', async () => {
    const { wrapper, ctx } = mountInput({ open: ref(true) })
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    expect(ctx.typeAheadSelect).toHaveBeenCalled()
  })

  it('Escape clears search when searching', async () => {
    const search = ref('hello')
    const { wrapper, ctx } = mountInput({
      search,
      isSearching: computed(() => search.value.length > 0),
    })
    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    expect(ctx.setSearch).toHaveBeenCalledWith('')
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

  it('focus opens the dropdown', async () => {
    const { wrapper, ctx } = mountInput()
    await wrapper.find('input').trigger('focus')
    expect(ctx.setOpen).toHaveBeenCalledWith(true)
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
      const { wrapper, ctx } = mountInput({ open: ref(true), mapKeydown })
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
      expect(ctx.typeAheadDown).toHaveBeenCalled()
    })

    it('includes attributes and listeners given to ComboBoxInput', async () => {
      const onFocus = vi.fn()
      const { wrapper, ctx } = mountWithSlot({ id: 'country', onFocus })
      const input = wrapper.find('input')
      expect(input.attributes('id')).toBe('country')
      await input.trigger('focus')
      expect(onFocus).toHaveBeenCalledTimes(1)
      expect(ctx.setOpen).toHaveBeenCalledWith(true)
    })
  })
})
