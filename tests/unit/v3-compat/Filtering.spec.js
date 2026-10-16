import { it, describe, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VueSelect from '@/components/VueSelect.vue'
import { searchFocus, typeSearch, dropdownOptionLabels } from './helpers.js'

/**
 * Mount VueSelect and capture the `filteredOptions` the list-footer slot
 * receives, so tests can compare the exact option values (not just labels).
 */
const mountWithListScope = (props) => {
  let scope = {}
  const wrapper = mount(VueSelect, {
    props,
    slots: {
      'list-footer': (slotProps) => {
        scope = slotProps
        return null
      },
    },
  })
  return { wrapper, filteredOptions: () => scope.filteredOptions }
}

/** Focus the search and type, as a user would. */
const userSearch = async (wrapper, text) => {
  await searchFocus(wrapper)
  await typeSearch(wrapper, text)
}

describe('Filtering Options', () => {
  it("should update the search value when the input element receives the 'input' event", async () => {
    const Select = mount(VueSelect, {
      props: { options: ['foo', 'bar', 'baz'] },
    })

    const input = Select.find('.vs__search')
    input.element.value = 'a'
    await input.trigger('input')
    expect(Select.vm.search).toEqual('a')
  })

  it('should filter an array of strings', async () => {
    const { wrapper: Select, filteredOptions } = mountWithListScope({
      options: ['foo', 'bar', 'baz'],
    })
    await userSearch(Select, 'ba')
    expect(filteredOptions()).toEqual(['bar', 'baz'])
    expect(dropdownOptionLabels(Select)).toEqual(['bar', 'baz'])
  })

  it('should not filter the array of strings if filterable is false', async () => {
    const { wrapper: Select, filteredOptions } = mountWithListScope({
      options: ['foo', 'bar', 'baz'],
      filterable: false,
    })
    await userSearch(Select, 'ba')
    expect(filteredOptions()).toEqual(['foo', 'bar', 'baz'])
    expect(dropdownOptionLabels(Select)).toEqual(['foo', 'bar', 'baz'])
  })

  it('should filter without case-sensitivity', async () => {
    const { wrapper: Select, filteredOptions } = mountWithListScope({
      options: ['Foo', 'Bar', 'Baz'],
    })
    await userSearch(Select, 'ba')
    expect(filteredOptions()).toEqual(['Bar', 'Baz'])
    expect(dropdownOptionLabels(Select)).toEqual(['Bar', 'Baz'])
  })

  it('can filter an array of objects based on the objects label key', async () => {
    const { wrapper: Select, filteredOptions } = mountWithListScope({
      options: [{ label: 'Foo' }, { label: 'Bar' }, { label: 'Baz' }],
    })
    await userSearch(Select, 'ba')
    expect(filteredOptions()).toEqual([{ label: 'Bar' }, { label: 'Baz' }])
    expect(dropdownOptionLabels(Select)).toEqual(['Bar', 'Baz'])
  })

  it('can determine if a given option should match the current search text', async () => {
    // v3 filterBy(option, label, search) -> v4 filter(options, search)
    const { wrapper: Select, filteredOptions } = mountWithListScope({
      options: [{ label: 'Aoo' }, { label: 'Bar' }, { label: 'Baz' }],
      filter: (options, search) =>
        options.filter((option) =>
          option.label.match(new RegExp('^' + search, 'i'))
        ),
    })

    await userSearch(Select, 'a')
    expect(filteredOptions()).toEqual([{ label: 'Aoo' }])
    expect(dropdownOptionLabels(Select)).toEqual(['Aoo'])
  })

  it('can use a custom filtering method', async () => {
    // v3 filterBy(option, label) -> v4 filter(options, search)
    const { wrapper: Select, filteredOptions } = mountWithListScope({
      options: ['foo', 'bar', 'baz'],
      filter: (options) => options.filter((label) => label.includes('o')),
    })
    await userSearch(Select, 'a')
    expect(filteredOptions()).toEqual(['foo'])
    expect(dropdownOptionLabels(Select)).toEqual(['foo'])
  })

  it('can filter arrays of numbers', async () => {
    const { wrapper: Select, filteredOptions } = mountWithListScope({
      options: [1, 5, 10],
    })
    await userSearch(Select, '1')
    expect(filteredOptions()).toEqual([1, 10])
    expect(dropdownOptionLabels(Select)).toEqual(['1', '10'])
  })
})
