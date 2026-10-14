import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
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
})
