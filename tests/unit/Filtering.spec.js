import { shallowMount } from '@vue/test-utils'
import VueSelect from '../../src/components/Select'

describe('Filtering Options', () => {
  it("should update the search value when the input element receives the 'input' event", () => {
    const Select = shallowMount(VueSelect, {
      props: { options: ['foo', 'bar', 'baz'] },
    })

    const input = Select.find('.vs__search')
    input.element.value = 'a'
    input.trigger('input')
    expect(Select.vm.search).toEqual('a')
  })

  it('should filter an array of strings', () => {
    const Select = shallowMount(VueSelect, {
      props: { options: ['foo', 'bar', 'baz'] },
    })
    Select.vm.search = 'ba'
    expect(Select.vm.filteredOptions).toEqual(['bar', 'baz'])
  })

  it('should not filter the array of strings if filterable is false', () => {
    const Select = shallowMount(VueSelect, {
      props: { options: ['foo', 'bar', 'baz'], filterable: false },
    })
    Select.vm.search = 'ba'
    expect(Select.vm.filteredOptions).toEqual(['foo', 'bar', 'baz'])
  })

  it('should filter without case-sensitivity', () => {
    const Select = shallowMount(VueSelect, {
      props: { options: ['Foo', 'Bar', 'Baz'] },
    })
    Select.vm.search = 'ba'
    expect(Select.vm.filteredOptions).toEqual(['Bar', 'Baz'])
  })

  it('can filter an array of objects based on the objects label key', () => {
    const Select = shallowMount(VueSelect, {
      props: {
        options: [{ label: 'Foo' }, { label: 'Bar' }, { label: 'Baz' }],
      },
    })
    Select.vm.search = 'ba'
    expect(Select.vm.filteredOptions).toEqual([
      { label: 'Bar' },
      { label: 'Baz' },
    ])
  })

  it('can determine if a given option should match the current search text', () => {
    const Select = shallowMount(VueSelect, {
      props: {
        options: [{ label: 'Aoo' }, { label: 'Bar' }, { label: 'Baz' }],
        filterBy: (option, label, search) =>
          label.match(new RegExp('^' + search, 'i')),
      },
    })

    Select.vm.search = 'a'
    expect(Select.vm.filteredOptions).toEqual([{ label: 'Aoo' }])
  })

  it('can use a custom filtering method', () => {
    const Select = shallowMount(VueSelect, {
      props: {
        options: ['foo', 'bar', 'baz'],
        filterBy: (option, label) => label.includes('o'),
      },
    })
    Select.vm.search = 'a'
    expect(Select.vm.filteredOptions).toEqual(['foo'])
  })

  it('can filter arrays of numbers', () => {
    const Select = shallowMount(VueSelect, {
      props: {
        options: [1, 5, 10],
      },
    })
    Select.vm.search = '1'
    expect(Select.vm.filteredOptions).toEqual([1, 10])
  })
})
