import { mountDefault } from '../helpers'

describe('Search Slot Scope', () => {
  /**
   * @see https://www.w3.org/WAI/PF/aria/states_and_properties#aria-activedescendant
   */
  fdescribe('aria-activedescendant', () => {
    it('adds the active descendant attribute only when the dropdown is open and there is a typeAheadPointer value', async () => {
      const Select = mountDefault()

      expect(
        Select.vm.scope.search.attributes['aria-activedescendant']
      ).toEqual(undefined)

      Select.vm.open = true
      await Select.vm.$nextTick()

      expect(
        Select.vm.scope.search.attributes['aria-activedescendant']
      ).toEqual(undefined)
    })

    it("adds the active descendant attribute when there's a typeahead value and an open dropdown", async () => {
      const Select = mountDefault({ value: 'three' }, ['one', 'two', 'three'])

      Select.vm.open = true
      Select.vm.typeAheadPointer = 1
      await Select.vm.$nextTick()

      expect(
        Select.vm.scope.search.attributes['aria-activedescendant']
      ).toEqual(`vs${Select.vm.uid}__option-2`)
    })
  })
})

describe('UID', () => {
  it('works with strings', () => {
    const Select = mountDefault({ uid: 'hello' })
    expect(Select.find('#vshello__combobox').exists()).toBeTruthy()
  })

  it('works with numbers', () => {
    const Select = mountDefault({ uid: 2 })
    expect(Select.find('#vs2__combobox').exists()).toBeTruthy()
  })
})
