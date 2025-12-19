import { nextTick, h } from "vue"
import { mountDefault } from '../helpers'

describe('Scoped Slots', () => {
  it('receives an option object to the selected-option-container slot', () => {
    const Select = mountDefault(
      { modelValue: 'one' },
      {
        slots: {
          'selected-option-container': ({ option }) => h('span', {}, option.label),
        },
      }
    )

    expect(Select.find('.vs__selected-options').text()).toContain('one')
  })

  describe('Slot: selected-option', () => {
    it('receives an option object to the selected-option slot', () => {
      const Select = mountDefault(
        { modelValue: 'one' },
        {
          slots: {
            'selected-option': (option) => h('span', {}, option.label),
          },
        }
      )

      expect(Select.find('.vs__selected').text()).toEqual('one')
    })

    it('opens the dropdown when clicking an option in selected-option slot', async () => {
      const Select = mountDefault(
        { modelValue: 'one' },
        {
          slots: {
            'selected-option': (option) => h('span', { class: 'my-option' }, option.label),
          },
        }
      )

      await Select.find('.my-option').trigger('mousedown')
      expect(Select.vm.open).toEqual(true)
    })
  })

  it('receives an option object to the option slot in the dropdown menu', async () => {
    const Select = mountDefault(
      { modelValue: 'one' },
      {
        slots: {
          option: (option) => h('span', {}, option.label),
        },
      }
    )

    Select.vm.open = true
    await nextTick()

    expect(Select.find('.vs__dropdown-menu').text()).toContain('one')
  })

  it('noOptions slot receives the current search text', async () => {
    const noOptions = jest.fn((props) => h('div', {}, 'No options'))
    const Select = mountDefault(
      {},
      {
        slots: { 'no-options': noOptions },
      }
    )

    Select.vm.search = 'something not there'
    Select.vm.open = true
    await nextTick()

    expect(noOptions).toHaveBeenCalled()
    const callArgs = noOptions.mock.calls[0][0]
    expect(callArgs.loading).toBe(false)
    expect(callArgs.search).toBe('something not there')
    expect(callArgs.searching).toBe(true)
  })

  test('header slot props', async () => {
    const header = jest.fn((props) => h('div', {}, 'Header'))
    const Select = mountDefault(
      {},
      {
        slots: { header: header },
      }
    )
    await nextTick()
    
    expect(header).toHaveBeenCalled()
    const callArgs = header.mock.calls[0][0]
    expect(Object.keys(callArgs)).toEqual(
      expect.arrayContaining(['search', 'loading', 'searching', 'filteredOptions', 'deselect'])
    )
  })

  test('footer slot props', async () => {
    const footer = jest.fn((props) => h('div', {}, 'Footer'))
    const Select = mountDefault(
      {},
      {
        slots: { footer: footer },
      }
    )
    await nextTick()
    
    expect(footer).toHaveBeenCalled()
    const callArgs = footer.mock.calls[0][0]
    expect(Object.keys(callArgs)).toEqual(
      expect.arrayContaining(['search', 'loading', 'searching', 'filteredOptions', 'deselect'])
    )
  })

  test('list-header slot props', async () => {
    const header = jest.fn((props) => h('div', {}, 'List Header'))
    const Select = mountDefault(
      {},
      {
        slots: { 'list-header': header },
      }
    )
    Select.vm.open = true
    await nextTick()
    
    expect(header).toHaveBeenCalled()
    const callArgs = header.mock.calls[0][0]
    expect(Object.keys(callArgs)).toEqual(
      expect.arrayContaining(['search', 'loading', 'searching', 'filteredOptions'])
    )
  })

  test('list-footer slot props', async () => {
    const footer = jest.fn((props) => h('div', {}, 'List Footer'))
    const Select = mountDefault(
      {},
      {
        slots: { 'list-footer': footer },
      }
    )
    Select.vm.open = true
    await nextTick()
    
    expect(footer).toHaveBeenCalled()
    const callArgs = footer.mock.calls[0][0]
    expect(Object.keys(callArgs)).toEqual(
      expect.arrayContaining(['search', 'loading', 'searching', 'filteredOptions'])
    )
  })
})
