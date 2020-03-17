import { mountDefault } from '../helpers';

describe('Scoped Slots', () => {
  it('receives an option object to the selected-option-container slot', () => {
    const Select = mountDefault(
      {value: 'one'},
      {
        scopedSlots: {
          'selected-option-container': `<span slot="selected-option-container" slot-scope="{option}">{{ option.label }}</span>`,
        },
      });

    expect(Select.find({ref: 'selectedOptions'}).text()).toEqual('one');
  });

  describe('Slot: selected-option', () => {
    it('receives an option object to the selected-option slot', () => {
      const Select = mountDefault(
        {value: 'one'},
        {
          scopedSlots: {
            'selected-option': `<span slot="selected-option" slot-scope="option">{{ option.label }}</span>`,
          },
        });

      expect(Select.find('.vs__selected').text()).toEqual('one');
    });

    it('opens the dropdown when clicking an option in selected-option slot',
      () => {
        const Select = mountDefault(
          {value: 'one'},
          {
            scopedSlots: {
              'selected-option': `<span class="my-option" slot-scope="option">{{ option.label }}</span>`,
            },
          });

        Select.find('.my-option').trigger('mousedown');
        expect(Select.vm.open).toEqual(true);
      });
  });

  it('receives an option object to the option slot in the dropdown menu',
    async () => {
      const Select = mountDefault(
        {value: 'one'},
        {
          scopedSlots: {
            'option': `<span slot="option" slot-scope="option">{{ option.label }}</span>`,
          },
        });

      Select.vm.open = true;
      await Select.vm.$nextTick();

      expect(Select.find({ref: 'dropdownMenu'}).text()).toEqual('onetwothree');
    });

  it('noOptions slot receives the current search text', async () => {
    const noOptions = jest.fn();
    const Select = mountDefault({}, {
      scopedSlots: {'no-options': noOptions},
    });

    Select.vm.search = 'something not there';
    Select.vm.open = true;
    await Select.vm.$nextTick();

    expect(noOptions).toHaveBeenCalledWith({
      loading: false,
      search: 'something not there',
      searching: true,
    })
  });

  test('header slot props', async () => {
    const header = jest.fn();
    const Select = mountDefault({}, {
      scopedSlots: {header: header},
    });
    await Select.vm.$nextTick();
    expect(Object.keys(header.mock.calls[0][0])).toEqual([
      'search', 'loading', 'searching', 'filteredOptions', 'deselect',
    ]);
  });

  test('footer slot props', async () => {
    const footer = jest.fn();
    const Select = mountDefault({}, {
      scopedSlots: {footer: footer},
    });
    await Select.vm.$nextTick();
    expect(Object.keys(footer.mock.calls[0][0])).toEqual([
      'search', 'loading', 'searching', 'filteredOptions', 'deselect',
    ]);
  });

  test('list-header slot props', async () => {
    const header = jest.fn();
    const Select = mountDefault({}, {
      scopedSlots: {'list-header': header},
    });
    Select.vm.open = true;
    await Select.vm.$nextTick();
    expect(Object.keys(header.mock.calls[0][0])).toEqual([
      'search', 'loading', 'searching', 'filteredOptions',
    ]);
  });

  test('list-footer slot props', async () => {
    const footer = jest.fn();
    const Select = mountDefault({}, {
      scopedSlots: {'list-footer': footer},
    });
    Select.vm.open = true;
    await Select.vm.$nextTick();
    expect(Object.keys(footer.mock.calls[0][0])).toEqual([
      'search', 'loading', 'searching', 'filteredOptions',
    ]);
  });
});
