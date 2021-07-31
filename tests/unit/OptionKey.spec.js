import Select from '../../src/components/Select.vue';
import {shallowMount} from '@vue/test-utils'

describe('Serializing Option Keys', () => {

  const SelectView = shallowMount(Select)

  it('can serialize strings to a key', () => {
    expect(SelectView.vm.getOptionKey('vue')).toBe('vue');
  });

  it('can serialize integers to a key', () => {
    expect(SelectView.vm.getOptionKey(1)).toBe(1);
  });

  it('can serialize objects to a key', () => {
    expect(SelectView.vm.getOptionKey({label: 'vue'})).toBe('{"label":"vue"}');
  });

  it('will use an ID property if the object contains one', () => {
    expect(SelectView.vm.getOptionKey({id: 1})).toBe(1);
    expect(SelectView.vm.getOptionKey({id: 'one'})).toBe('one');
    expect(SelectView.vm.getOptionKey({id: {im: 'a nested object'}}))
      .toEqual({im: 'a nested object'});
  });
});
