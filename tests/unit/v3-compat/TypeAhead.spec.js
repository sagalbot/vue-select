import { it, describe, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VueSelect from '@/components/VueSelect.vue'
import {
  mountDefault,
  searchFocus,
  typeSearch,
  pressKey,
  dropdownOptions,
  highlightedIndex,
} from './helpers.js'

/** Point the typeahead at an option by hovering it, as a user would. */
const hoverOption = async (wrapper, index) => {
  await dropdownOptions(wrapper)[index].trigger('mousemove')
}

describe('Moving the Typeahead Pointer', () => {
  it('should set the pointer to zero when the filteredOptions watcher is called', async () => {
    const Select = mount(VueSelect, {
      props: { options: ['one', 'two', 'three'] },
    })

    await searchFocus(Select)
    await typeSearch(Select, 'one')

    expect(highlightedIndex(Select)).toEqual(0)
  })

  it('should move the pointer visually up the list on up arrow keyUp', async () => {
    const Select = mountDefault()

    await searchFocus(Select)
    await hoverOption(Select, 1)
    expect(highlightedIndex(Select)).toEqual(1)

    await pressKey(Select, 'ArrowUp')

    expect(highlightedIndex(Select)).toEqual(0)
  })

  it('should move the pointer visually down the list on down arrow keyUp', async () => {
    const Select = mountDefault()

    await searchFocus(Select)
    await hoverOption(Select, 1)
    expect(highlightedIndex(Select)).toEqual(1)

    await pressKey(Select, 'ArrowDown')

    expect(highlightedIndex(Select)).toEqual(2)
  })

  // v4 change (WAI-ARIA APG): in the editable combobox the highlight wraps
  // from the last option to the first, as in the APG "List Autocomplete"
  // example. v3 stopped at the end.
  it('wraps from the last option to the first', async () => {
    const Select = mountDefault()

    await searchFocus(Select)
    await hoverOption(Select, 2)
    expect(highlightedIndex(Select)).toEqual(2)

    await pressKey(Select, 'ArrowDown')
    expect(highlightedIndex(Select)).toEqual(0)
  })

  // The select-only combobox stops at the end, as in the APG example.
  it('does not move the pointer past the end of the list when not searchable', async () => {
    const Select = mountDefault({ searchable: false })

    await searchFocus(Select)
    await hoverOption(Select, 2)
    expect(highlightedIndex(Select)).toEqual(2)

    await pressKey(Select, 'ArrowDown')
    expect(highlightedIndex(Select)).toEqual(2)
  })

  it('will set the pointer to the selected option when opening', async () => {
    const Select = mount(VueSelect, {
      props: {
        modelValue: 'three',
        options: ['one', 'two', 'three'],
      },
    })

    await searchFocus(Select)

    expect(highlightedIndex(Select)).toEqual(2)
  })

  it('will set the pointer to the reduced selected option when opening', async () => {
    const Select = mount(VueSelect, {
      props: {
        modelValue: 3,
        reduce: ({ value }) => value,
        options: [
          { label: 'one', value: 1 },
          { label: 'two', value: 2 },
          { label: 'three', value: 3 },
        ],
      },
    })

    await searchFocus(Select)

    expect(highlightedIndex(Select)).toEqual(2)
  })
})
