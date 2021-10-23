import { mountDefault } from '../helpers'

describe('International Text', () => {
  it('renders default text for spinner.text', () => {
    const Select = mountDefault({ loading: true })
    expect(Select.find('.vs__spinner').text()).toBe('Loading...')
  })

  it('renders default text for noOptions.text', async () => {
    const Select = mountDefault({ options: [] })
    Select.vm.open = true
    await Select.vm.$nextTick()
    expect(Select.find('.vs__no-options').text()).toBe(
      'Sorry, no matching options.'
    )
  })

  it('renders default text for search.ariaLabel', () => {
    const Select = mountDefault()
    expect(Select.find('[role="combobox"]').attributes()['aria-label']).toBe(
      'Search for options'
    )
  })

  it('renders default text for deselect.ariaLabel', () => {
    const Select = mountDefault({ value: 'one', multiple: true })
    expect(Select.find('.vs__deselect').attributes()['aria-label']).toBe(
      'Deselect one'
    )
  })
})
