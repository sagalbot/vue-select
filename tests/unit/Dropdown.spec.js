import { mountDefault, selectWithProps } from '../helpers'
import OpenIndicator from '../../src/components/OpenIndicator'
import { mount } from '@vue/test-utils'
import VueSelect from '../../src/components/Select.vue'

const preventDefault = jest.fn()

function clickEvent(currentTarget) {
  return { currentTarget, preventDefault }
}

describe('Toggling Dropdown', () => {
  it('should not open the dropdown when the el is clicked but the component is disabled', () => {
    const Select = selectWithProps({ disabled: true })
    Select.vm.toggleDropdown(clickEvent(Select.vm.$refs.search))
    expect(Select.vm.open).toEqual(false)
  })

  it('should open the dropdown when the el is clicked', () => {
    const Select = selectWithProps({
      value: [{ label: 'one' }],
      options: [{ label: 'one' }],
    })

    Select.vm.toggleDropdown(clickEvent(Select.vm.$refs.search))
    expect(Select.vm.open).toEqual(true)
  })

  it('should not close the dropdown when the el is clicked and enableMouseInputSearch is set to true', () => {
    const Select = selectWithProps({
      value: [{ label: 'one' }],
      options: [{ label: 'one' }],
      enableMouseSearchInput: true,
    })

    Select.vm.toggleDropdown(clickEvent(Select.vm.$refs.search))
    expect(Select.vm.open).toEqual(true)
    Select.vm.toggleDropdown(clickEvent(Select.vm.$el))
    expect(Select.vm.open).toEqual(false)
  })

  it('should open the dropdown when the selected tag is clicked', () => {
    const Select = selectWithProps({
      value: [{ label: 'one' }],
      options: [{ label: 'one' }],
    })

    const selectedTag = Select.find('.vs__selected').element

    Select.vm.toggleDropdown(clickEvent(selectedTag))
    expect(Select.vm.open).toEqual(true)
  })

  it('can close the dropdown when the el is clicked', () => {
    const Select = selectWithProps()
    const spy = jest.spyOn(Select.vm.$refs.search, 'blur')

    Select.vm.open = true
    Select.vm.toggleDropdown(clickEvent(Select.vm.$el))

    expect(spy).toHaveBeenCalled()
  })

  it('closes the dropdown when an option is selected, multiple is true, and closeOnSelect option is true', () => {
    const Select = selectWithProps({
      value: [],
      options: ['one', 'two', 'three'],
      multiple: true,
    })

    Select.vm.open = true
    Select.vm.select('one')

    expect(Select.vm.open).toEqual(false)
  })

  it('does not close the dropdown when the el is clicked, multiple is true, and closeOnSelect option is false', () => {
    const Select = selectWithProps({
      value: [],
      options: ['one', 'two', 'three'],
      multiple: true,
      closeOnSelect: false,
    })

    Select.vm.open = true
    Select.vm.select('one')

    expect(Select.vm.open).toEqual(true)
  })

  it('should close the dropdown on search blur', () => {
    const Select = selectWithProps({
      options: [{ label: 'one' }],
    })

    Select.vm.open = true
    Select.findComponent({ ref: 'search' }).trigger('blur')

    expect(Select.vm.open).toEqual(false)
  })

  it('will close the dropdown and emit the search:blur event from onSearchBlur', () => {
    const Select = selectWithProps()
    const spy = jest.spyOn(Select.vm, '$emit')

    Select.vm.open = true
    Select.vm.onSearchBlur()

    expect(Select.vm.open).toEqual(false)
    expect(spy).toHaveBeenCalledWith('search:blur')
  })

  it('will open the dropdown and emit the search:focus event from onSearchFocus', () => {
    const Select = selectWithProps()
    const spy = jest.spyOn(Select.vm, '$emit')

    Select.vm.onSearchFocus()

    expect(Select.vm.open).toEqual(true)
    expect(spy).toHaveBeenCalledWith('search:focus')
  })

  it('will close the dropdown on escape, if search is empty', () => {
    const Select = selectWithProps()
    const spy = jest.spyOn(Select.vm.$refs.search, 'blur')

    Select.vm.open = true
    Select.vm.onEscape()

    expect(spy).toHaveBeenCalled()
  })

  it('should remove existing search text on escape keydown', () => {
    const Select = selectWithProps({
      value: [{ label: 'one' }],
      options: [{ label: 'one' }],
    })

    Select.vm.search = 'foo'
    Select.find('.vs__search').trigger('keydown.esc')
    expect(Select.vm.search).toEqual('')
  })

  it('should have an open class when dropdown is active', () => {
    const Select = selectWithProps()

    expect(Select.vm.stateClasses['vs--open']).toEqual(false)

    Select.vm.open = true
    expect(Select.vm.stateClasses['vs--open']).toEqual(true)
  })

  it('should not display the dropdown if noDrop is true', async () => {
    const Select = selectWithProps({
      noDrop: true,
    })

    Select.vm.toggleDropdown(clickEvent(Select.vm.$refs.search))

    expect(Select.vm.open).toEqual(true)
    await Select.vm.$nextTick()

    expect(Select.find('.vs__dropdown-menu').exists()).toBeFalsy()
    expect(Select.find('.vs__dropdown-option').exists()).toBeFalsy()
    expect(Select.find('.vs__no-options').exists()).toBeFalsy()
    expect(Select.vm.stateClasses['vs--open']).toBeFalsy()
  })

  it('should hide the open indicator if noDrop is true', () => {
    const Select = selectWithProps({
      noDrop: true,
    })
    expect(Select.findComponent(OpenIndicator).exists()).toBeFalsy()
  })

  it('should not add the searchable state class when noDrop is true', () => {
    const Select = selectWithProps({
      noDrop: true,
    })
    expect(Select.classes('vs--searchable')).toBeFalsy()
  })

  it('should not add the searching state class when noDrop is true', () => {
    const Select = selectWithProps({
      noDrop: true,
    })

    Select.vm.search = 'Canada'

    expect(Select.classes('vs--searching')).toBeFalsy()
  })

  it('can be opened with dropdownShouldOpen', () => {
    const Select = selectWithProps({
      noDrop: true,
      dropdownShouldOpen: () => true,
      options: ['one'],
    })

    expect(Select.classes('vs--open')).toBeTruthy()
    expect(Select.find('.vs__dropdown-menu li')).toBeTruthy()
  })
})

describe('Appending dropdown to containers', () => {
  it('can append the dropdown to the body', async () => {
    const Select = mount(VueSelect, {
      propsData: { appendToBody: true },
      attachTo: document.body,
    })

    Select.vm.open = true
    await Select.vm.$nextTick()

    expect(document.body.children.length).toEqual(2)
    expect(document.body.children[0]).toBe(Select.vm.$el)
    expect(document.body.children[1]).toBe(Select.vm.$refs.dropdownMenu)

    Select.destroy()
  })

  it('can append the dropdown to a custom element via string', async () => {
    const div = document.createElement('div')
    div.id = 'root'
    document.body.appendChild(div)

    const Select = mount(VueSelect, {
      propsData: { appendTo: '#root' },
      attachTo: document.body,
    })

    Select.vm.open = true
    await Select.vm.$nextTick()

    expect(document.body.children.length).toEqual(2)
    expect(document.body.children[1]).toBe(Select.vm.$el)
    expect(div.children[0]).toBe(Select.vm.$refs.dropdownMenu)

    Select.destroy()
    div.remove()
  })

  it('validates that when the appendTo prop is provided an object, that object must have the appendChild method', () => {
    //  Given
    const invalidObject = {}
    const validObject = { appendChild: () => {} }
    const validHtmlElement = document.createElement('div')
    //  When
    const validate = VueSelect.props.appendTo.validator
    //  Then
    expect(validate(invalidObject)).toBeFalsy()
    expect(validate(validObject)).toBeTruthy()
    expect(validate(validHtmlElement)).toBeTruthy()
  })

  it('can append the dropdown to a custom element by providing the element', async () => {
    const div = document.createElement('div')
    div.id = 'root'
    document.body.appendChild(div)

    const Select = mount(VueSelect, {
      propsData: { appendTo: document.querySelector('#root') },
      attachTo: document.body,
    })

    Select.vm.open = true
    await Select.vm.$nextTick()

    expect(document.body.children.length).toEqual(2)
    expect(document.body.children[1]).toBe(Select.vm.$el)
    expect(div.children[0]).toBe(Select.vm.$refs.dropdownMenu)

    Select.destroy()
    div.remove()
  })

  it('will not append the dropdown unless appendToBody or appendTo has been set', async () => {
    const Select = mount(VueSelect, {
      propsData: { appendToBody: false },
      attachTo: document.body,
    })

    Select.vm.open = true
    await Select.vm.$nextTick()

    expect(document.body.children.length).toEqual(1)
    expect(document.body.children[0]).toBe(Select.vm.$el)

    Select.destroy()
  })
})
