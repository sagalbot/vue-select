import { it, describe, expect } from 'vitest'
import { selectWithProps, searchFocus, typeSearch } from './helpers.js'
import { mount } from '@vue/test-utils'
import vSelect from '@/components/VueSelect.vue'

/** Loading state as the user sees it: the vs--loading class and the spinner. */
const isLoading = (wrapper) => {
  const spinnerShown = wrapper.get('.vs__spinner').element.style.display !== 'none'
  const hasClass = wrapper.classes().includes('vs--loading')
  expect(spinnerShown).toBe(hasClass)
  return hasClass
}

/** The toggleLoading callback from the most recent `search` event. */
const lastToggleLoading = (wrapper) => {
  const events = wrapper.emitted('search')
  return events[events.length - 1][1]
}

describe('Asynchronous Loading', () => {
  it('can toggle the loading class', async () => {
    const Select = selectWithProps()
    await searchFocus(Select)
    await typeSearch(Select, 'foo')
    const toggleLoading = lastToggleLoading(Select)
    expect(isLoading(Select)).toEqual(false)

    toggleLoading()
    await Select.vm.$nextTick()
    expect(isLoading(Select)).toEqual(true)

    toggleLoading(true)
    await Select.vm.$nextTick()
    expect(isLoading(Select)).toEqual(true)
  })

  it('should trigger the search event when the search text changes', async () => {
    const Select = selectWithProps()

    await searchFocus(Select)
    await typeSearch(Select, 'foo')

    const events = Select.emitted('search')

    expect(events).toContainEqual(['foo', expect.any(Function)])
    expect(events.length).toEqual(1)
  })

  it('should trigger the search event if the search text is empty', async () => {
    const Select = selectWithProps()

    await searchFocus(Select)
    await typeSearch(Select, 'foo')
    await typeSearch(Select, '')

    const events = Select.emitted('search')

    expect(events).toContainEqual(['', expect.any(Function)])
    expect(events.length).toEqual(2)
  })

  it('can set loading to false from the @search event callback', async () => {
    const Select = mount(vSelect, {
      props: {
        // v3 set mutableLoading = true; start loading via the prop instead
        loading: true,
        onSearch: (search, loading) => {
          loading(false)
        },
      },
    })
    expect(isLoading(Select)).toEqual(true)

    await searchFocus(Select)
    await typeSearch(Select, 'foo')

    expect(isLoading(Select)).toEqual(false)
  })

  it('will sync mutable loading with the loading prop', async () => {
    const Select = selectWithProps({ loading: false })
    expect(isLoading(Select)).toEqual(false)

    await Select.setProps({ loading: true })
    await Select.vm.$nextTick()

    expect(isLoading(Select)).toEqual(true)
  })
})
