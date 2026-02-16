import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed, h } from 'vue'
import ComboBoxMenu from '@/components/ComboBox/ComboBoxMenu.vue'
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

function mountMenu(ctxOverrides = {}, slotContent?: string) {
  const ctx = createMockContext(ctxOverrides)
  const wrapper = mount(ComboBoxMenu, {
    global: {
      provide: { [ComboBoxKey as symbol]: ctx },
    },
    slots: { default: slotContent ?? 'Menu content' },
  })
  return { wrapper, ctx }
}

describe('ComboBoxMenu', () => {
  it('has role="listbox"', () => {
    const { wrapper } = mountMenu({ open: ref(true) })
    expect(wrapper.attributes('role')).toBe('listbox')
  })

  it('has correct id', () => {
    const { wrapper } = mountMenu({ open: ref(true) })
    expect(wrapper.attributes('id')).toBe('vs-test-listbox')
  })

  it('has tabindex="-1"', () => {
    const { wrapper } = mountMenu({ open: ref(true) })
    expect(wrapper.attributes('tabindex')).toBe('-1')
  })

  it('is visible when open is true', () => {
    const { wrapper } = mountMenu({ open: ref(true) })
    expect(wrapper.isVisible()).toBe(true)
  })

  it('is hidden when open is false', () => {
    const { wrapper } = mountMenu({ open: ref(false) })
    expect(wrapper.isVisible()).toBe(false)
  })

  it('is hidden when noDrop is true even if open', () => {
    const { wrapper } = mountMenu({ open: ref(true), noDrop: computed(() => true) })
    expect(wrapper.isVisible()).toBe(false)
  })

  it('renders slot content', () => {
    const { wrapper } = mountMenu({ open: ref(true) }, 'Test options')
    expect(wrapper.text()).toContain('Test options')
  })
})
