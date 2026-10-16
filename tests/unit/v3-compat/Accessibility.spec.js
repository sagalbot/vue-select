import { it, describe, expect } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import VueSelect from '@/components/VueSelect.vue'
import { mountDefault, searchInput, searchFocus, dropdownOptions } from './helpers.js'

/** Find an element inside the component by id (attribute selector: an idPrefix may not be CSS-safe as #id). */
const byId = (wrapper, id) => wrapper.find(`[id="${id}"]`)

describe('Search Slot Scope', () => {
  /**
   * @see https://www.w3.org/WAI/PF/aria/states_and_properties#aria-activedescendant
   */
  describe('aria-activedescendant', () => {
    it('adds the active descendant attribute only when the dropdown is open and there is a typeAheadPointer value', async () => {
      const Select = mountDefault()

      expect(searchInput(Select).attributes('aria-activedescendant')).toEqual(
        undefined
      )

      Select.vm.open = true
      await Select.vm.$nextTick()

      expect(searchInput(Select).attributes('aria-activedescendant')).toEqual(
        undefined
      )
    })

    it("adds the active descendant attribute when there's a typeahead value and an open dropdown", async () => {
      // v3 also set typeAheadPointer = 1 before the open watcher moved it to
      // the selected option; opening alone produces the same end state.
      const Select = mountDefault({ modelValue: 'three' })

      Select.vm.open = true
      await Select.vm.$nextTick()

      const activeId = searchInput(Select).attributes('aria-activedescendant')
      // v3: `vs${uid}__option-2`; v4 ids come from useId(), so compare to
      // the third option's own id.
      expect(activeId).toBeDefined()
      expect(activeId).toEqual(dropdownOptions(Select)[2].attributes('id'))
    })
  })
})

// v3 tested the `uid` prop (ids like `vshello__combobox`). v4 removed it: ids
// come from Vue's useId() and are SSR-safe. Test what the uid was for:
// unique ids per instance, and ARIA references that resolve.
describe('UID', () => {
  it('gives each instance unique ids', () => {
    // Two instances in the same app, as on a real page. (useId() is unique
    // per app; separate apps need distinct app.config.idPrefix values.)
    const options = ['one', 'two', 'three']
    const page = mount({
      render: () => [h(VueSelect, { options }), h(VueSelect, { options })],
    })
    const [first, second] = page.findAllComponents(VueSelect)

    const ids = (wrapper) =>
      wrapper.findAll('[id]').map((el) => el.attributes('id'))

    const firstIds = ids(first)
    const secondIds = ids(second)

    // listbox + 3 options each
    expect(firstIds).toHaveLength(4)
    expect(secondIds).toHaveLength(4)
    expect(new Set(firstIds).size).toEqual(firstIds.length)
    expect(firstIds.filter((id) => secondIds.includes(id))).toEqual([])
  })

  it('points aria-controls and aria-activedescendant at existing elements', async () => {
    const Select = mountDefault({ modelValue: 'two' })
    await searchFocus(Select)

    const input = searchInput(Select)
    expect(input.attributes('role')).toEqual('combobox')

    const listbox = byId(Select, input.attributes('aria-controls'))
    expect(listbox.exists()).toBe(true)
    expect(listbox.attributes('role')).toEqual('listbox')

    const active = byId(Select, input.attributes('aria-activedescendant'))
    expect(active.exists()).toBe(true)
    expect(active.attributes('role')).toEqual('option')
    expect(active.text()).toEqual('two')
  })
})
