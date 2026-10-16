import { it, describe, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VueSelect from '@/components/VueSelect.vue'
import { searchFocus, searchInput, typeSearch } from './helpers.js'

describe('Single value options', () => {
  it('should reset the search input on focus lost', async () => {
    const Select = mount(VueSelect)
    await searchFocus(Select)

    await typeSearch(Select, 't')
    expect(Select.vm.search).toEqual('t')

    await searchInput(Select).trigger('blur')
    expect(Select.vm.search).toEqual('')
    expect(searchInput(Select).element.value).toEqual('')
  })

  it('should not reset the search input on focus lost when clearSearchOnSelect is false', async () => {
    const Select = mount(VueSelect, {
      props: { modelValue: 'foo', clearSearchOnSelect: false },
    })

    expect(Select.props('clearSearchOnSelect')).toEqual(false)

    await searchFocus(Select)
    await typeSearch(Select, 't')
    expect(Select.vm.search).toEqual('t')

    await searchInput(Select).trigger('blur')
    expect(Select.vm.search).toEqual('t')
    expect(searchInput(Select).element.value).toEqual('t')
  })
})
