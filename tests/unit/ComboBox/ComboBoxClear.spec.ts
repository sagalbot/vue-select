import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import ComboBoxClear from '@/components/ComboBox/ComboBoxClear.vue'
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

function mountClear(ctxOverrides = {}) {
  const ctx = createMockContext(ctxOverrides)
  const wrapper = mount(ComboBoxClear, {
    global: {
      provide: { [ComboBoxKey as symbol]: ctx },
    },
    slots: { default: 'x' },
  })
  return { wrapper, ctx }
}

describe('ComboBoxClear', () => {
  it('is not visible when value is empty', () => {
    const { wrapper } = mountClear({ isValueEmpty: computed(() => true) })
    expect(wrapper.isVisible()).toBe(false)
  })

  it('is not visible when clearable is false', () => {
    const { wrapper } = mountClear({
      isValueEmpty: computed(() => false),
      clearable: computed(() => false),
    })
    expect(wrapper.isVisible()).toBe(false)
  })

  it('is visible when value is not empty and clearable', () => {
    const { wrapper } = mountClear({
      isValueEmpty: computed(() => false),
      clearable: computed(() => true),
    })
    expect(wrapper.isVisible()).toBe(true)
  })

  it('click calls clearSelection', async () => {
    const { wrapper, ctx } = mountClear({
      isValueEmpty: computed(() => false),
    })
    await wrapper.trigger('click')
    expect(ctx.clearSelection).toHaveBeenCalled()
  })

  it('renders slot content', () => {
    const { wrapper } = mountClear({ isValueEmpty: computed(() => false) })
    expect(wrapper.text()).toBe('x')
  })

  it('has aria-label', () => {
    const { wrapper } = mountClear({ isValueEmpty: computed(() => false) })
    expect(wrapper.attributes('aria-label')).toBe('Clear selection')
  })
})
