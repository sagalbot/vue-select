import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, provide, ref, computed } from 'vue'
import ComboBoxInput from '@/components/ComboBox/ComboBoxInput.vue'
import { ComboBoxKey } from '@/keys'
import type { ComboBoxContext, OptionValue } from '@/types'

function createMockContext(overrides = {}): ComboBoxContext {
  return {
    open: ref(false),
    search: ref(''),
    selectedValue: computed(() => []),
    filteredOptions: computed(() => []),
    typeAheadPointer: ref(-1),
    isLoading: ref(false),
    disabled: computed(() => false),
    multiple: computed(() => false),
    filterable: computed(() => true),
    noDrop: computed(() => false),
    clearable: computed(() => true),
    taggable: computed(() => false),
    placeholder: computed(() => ''),
    isValueEmpty: computed(() => true),
    isSearching: computed(() => false),
    uid: computed(() => 'test'),
    deselectFromDropdown: computed(() => false),
    autoscroll: computed(() => true),
    select: vi.fn(),
    deselect: vi.fn(),
    clearSelection: vi.fn(),
    toggleOpen: vi.fn(),
    setOpen: vi.fn(),
    setSearch: vi.fn(),
    typeAheadUp: vi.fn(),
    typeAheadDown: vi.fn(),
    typeAheadSelect: vi.fn(),
    toggleLoading: vi.fn(),
    getOptionLabel: (opt: OptionValue) => String(opt),
    getOptionKey: (opt: OptionValue) => JSON.stringify(opt),
    isOptionSelected: () => false,
    isOptionSelectable: () => true,
    isOptionHighlighted: () => false,
    optionList: computed(() => []),
    ...overrides,
  }
}

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
})
