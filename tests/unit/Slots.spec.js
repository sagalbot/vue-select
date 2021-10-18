import { h } from 'vue'
import { mountDefault } from '../helpers'

describe('Scoped Slots', () => {
  it('receives an option object to the selected-option-container slot', () => {
    const Select = mountDefault(
      { modelValue: 'one' },
      {
        slots: {
          'selected-option-container': (slotProps) =>
            h(
              'span',
              { slot: 'selected-option-container' },
              slotProps.option.label
            ),
        },
      }
    )

    expect(Select.get('.vs__selected-options').text()).toEqual('one')
  })

  describe('Slot: selected-option', () => {
    it('receives an option object to the selected-option slot', () => {
      const Select = mountDefault(
        { modelValue: 'one' },
        {
          slots: {
            'selected-option': (slotProps) =>
              h('span', { slot: 'selected-option' }, slotProps.label),
          },
        }
      )

      expect(Select.get('.vs__selected').text()).toEqual('one')
    })

    it('opens the dropdown when clicking an option in selected-option slot', () => {
      const Select = mountDefault(
        { modelValue: 'one' },
        {
          slots: {
            'selected-option': (slotProps) =>
              h('span', { class: 'my-option' }, slotProps.label),
          },
        }
      )

      Select.get('.my-option').trigger('mousedown')
      expect(Select.vm.open).toEqual(true)
    })
  })

  it('receives an option object to the option slot in the dropdown menu', async () => {
    const Select = mountDefault(
      { modelValue: 'one' },
      {
        slots: {
          option: (slotProps) => h('span', { slot: 'option' }, slotProps.label),
        },
      }
    )

    Select.vm.open = true
    await Select.vm.$nextTick()

    expect(Select.get('.vs__dropdown-menu').text()).toEqual('onetwothree')
  })

  it('noOptions slot receives the current search text', async () => {
    const noOptions = jest.fn()
    const Select = mountDefault(
      {},
      {
        slots: { 'no-options': noOptions },
      }
    )

    Select.vm.search = 'something not there'
    Select.vm.open = true
    await Select.vm.$nextTick()

    expect(noOptions).toHaveBeenCalledWith({
      loading: false,
      search: 'something not there',
      searching: true,
    })
  })

  test('header slot props', async () => {
    const header = jest.fn()
    const Select = mountDefault(
      {},
      {
        slots: { header: header },
      }
    )
    await Select.vm.$nextTick()
    expect(Object.keys(header.mock.calls[0][0])).toEqual([
      'search',
      'loading',
      'searching',
      'filteredOptions',
      'deselect',
    ])
  })

  test('footer slot props', async () => {
    const footer = jest.fn()
    const Select = mountDefault(
      {},
      {
        slots: { footer: footer },
      }
    )
    await Select.vm.$nextTick()
    expect(Object.keys(footer.mock.calls[0][0])).toEqual([
      'search',
      'loading',
      'searching',
      'filteredOptions',
      'deselect',
    ])
  })

  test('list-header slot props', async () => {
    const header = jest.fn()
    const Select = mountDefault(
      {},
      {
        slots: { 'list-header': header },
      }
    )
    Select.vm.open = true
    await Select.vm.$nextTick()
    expect(Object.keys(header.mock.calls[0][0])).toEqual([
      'search',
      'loading',
      'searching',
      'filteredOptions',
    ])
  })

  test('list-footer slot props', async () => {
    const footer = jest.fn()
    const Select = mountDefault(
      {},
      {
        slots: { 'list-footer': footer },
      }
    )
    Select.vm.open = true
    await Select.vm.$nextTick()
    expect(Object.keys(footer.mock.calls[0][0])).toEqual([
      'search',
      'loading',
      'searching',
      'filteredOptions',
    ])
  })
})
