import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import ComboBoxOption from '@/components/ComboBox/ComboBoxOption.vue'
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

function mountOption(props = {}, ctxOverrides = {}) {
  const ctx = createMockContext(ctxOverrides)
  const wrapper = mount(ComboBoxOption, {
    props: { value: 'test', index: 0, ...props },
    global: {
      provide: { [ComboBoxKey as symbol]: ctx },
    },
    slots: {
      default: (slotProps: any) =>
        `selected:${slotProps.isSelected},highlighted:${slotProps.isHighlighted},disabled:${slotProps.isDisabled}`,
    },
  })
  return { wrapper, ctx }
}

describe('ComboBoxOption', () => {
  it('has role="option"', () => {
    const { wrapper } = mountOption()
    expect(wrapper.attributes('role')).toBe('option')
  })

  it('has correct id', () => {
    const { wrapper } = mountOption({ index: 3 })
    expect(wrapper.attributes('id')).toBe('vs-test-option-3')
  })

  it('sets aria-selected when selected', () => {
    const { wrapper } = mountOption({}, { isOptionSelected: () => true })
    expect(wrapper.attributes('aria-selected')).toBe('true')
  })

  it('does not set aria-selected when not selected', () => {
    const { wrapper } = mountOption()
    expect(wrapper.attributes('aria-selected')).toBeUndefined()
  })

  it('sets aria-disabled when not selectable', () => {
    const { wrapper } = mountOption({}, { isOptionSelectable: () => false })
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('click calls select when not selected', async () => {
    const { wrapper, ctx } = mountOption()
    await wrapper.trigger('click')
    expect(ctx.select).toHaveBeenCalledWith('test')
  })

  it('click calls deselect when already selected', async () => {
    const { wrapper, ctx } = mountOption({}, { isOptionSelected: () => true })
    await wrapper.trigger('click')
    expect(ctx.deselect).toHaveBeenCalledWith('test')
  })

  it('click does nothing when disabled', async () => {
    const { wrapper, ctx } = mountOption({}, { isOptionSelectable: () => false })
    await wrapper.trigger('click')
    expect(ctx.select).not.toHaveBeenCalled()
    expect(ctx.deselect).not.toHaveBeenCalled()
  })

  it('mouseover updates typeAheadPointer', async () => {
    const pointer = ref(-1)
    const { wrapper } = mountOption({ index: 2 }, { typeAheadPointer: pointer })
    await wrapper.trigger('mouseover')
    expect(pointer.value).toBe(2)
  })

  it('exposes isSelected, isHighlighted, isDisabled via slot', () => {
    const { wrapper } = mountOption({}, {
      isOptionSelected: () => true,
      isOptionHighlighted: (i: number) => i === 0,
    })
    expect(wrapper.text()).toContain('selected:true')
    expect(wrapper.text()).toContain('highlighted:true')
    expect(wrapper.text()).toContain('disabled:false')
  })
})
