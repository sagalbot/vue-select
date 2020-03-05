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
});
