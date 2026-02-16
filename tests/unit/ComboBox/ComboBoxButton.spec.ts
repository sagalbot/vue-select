import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import ComboBoxButton from '@/components/ComboBox/ComboBoxButton.vue'
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

function mountButton(ctxOverrides = {}) {
  const ctx = createMockContext(ctxOverrides)
  const wrapper = mount(ComboBoxButton, {
    global: {
      provide: { [ComboBoxKey as symbol]: ctx },
    },
    slots: { default: 'Toggle' },
  })
  return { wrapper, ctx }
}

describe('ComboBoxButton', () => {
  it('has aria-haspopup="listbox"', () => {
    const { wrapper } = mountButton()
    expect(wrapper.attributes('aria-haspopup')).toBe('listbox')
  })

  it('has aria-expanded reflecting open state', () => {
    const { wrapper } = mountButton({ open: ref(true) })
    expect(wrapper.attributes('aria-expanded')).toBe('true')
  })

  it('has aria-controls pointing to listbox', () => {
    const { wrapper } = mountButton()
    expect(wrapper.attributes('aria-controls')).toBe('vs-test-listbox')
  })

  it('click calls toggleOpen', async () => {
    const { wrapper, ctx } = mountButton()
    await wrapper.trigger('click')
    expect(ctx.toggleOpen).toHaveBeenCalled()
  })

  it('is disabled when context is disabled', () => {
    const { wrapper } = mountButton({ disabled: computed(() => true) })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('renders slot content', () => {
    const { wrapper } = mountButton()
    expect(wrapper.text()).toBe('Toggle')
  })
})
