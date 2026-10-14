import { vi } from 'vitest'
import { ref, computed } from 'vue'
import type { ComboBoxContext, OptionValue } from '@/types'

/**
 * A ComboBoxContext with inert defaults, for mounting a single primitive
 * without a ComboBox parent. Override only what the test needs.
 */
export function createMockContext(
  overrides: Partial<ComboBoxContext> = {}
): ComboBoxContext {
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
    searchable: computed(() => true),
    mapKeydown: (map) => map,
    clearSearchOnBlur: computed(() => true),
    groupedOptions: computed(() => []),
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
    isOptionDeselectable: () => false,
    isOptionHighlighted: () => false,
    optionList: computed(() => []),
    ...overrides,
  }
}
