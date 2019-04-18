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

    expect(Select.find({ ref: 'selectedOptions' }).text()).toEqual('one')
  });

  it('receives an option object to the selected-option slot', () => {
    const Select = mountDefault(
      {value: 'one'},
      {
        scopedSlots: {
          'selected-option': `<span slot="selected-option" slot-scope="option">{{ option.label }}</span>`,
        },
      });

    expect(Select.find('.vs__selected').text()).toEqual('one')
  });

  it('receives an option object to the option slot in the dropdown menu', () => {
    const Select = mountDefault(
      {value: 'one'},
      {
        scopedSlots: {
          'option': `<span slot="option" slot-scope="option">{{ option.label }}</span>`,
        },
      });

    Select.vm.open = true;

    expect(Select.find({ref: 'dropdownMenu'}).text()).toEqual('onetwothree')
  });
});
