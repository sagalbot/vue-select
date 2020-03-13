import Select from '../../src/components/Select.vue';

describe('Serializing Option Keys', () => {

  const getOptionKey = Select.props.getOptionKey.default;

  it('can serialize strings to a key', () => {
    expect(getOptionKey('vue')).toBe('vue');
  });

  it('can serialize integers to a key', () => {
    expect(getOptionKey(1)).toBe(1);
  });

  it('can serialize objects to a key', () => {
    expect(getOptionKey({label: 'vue'})).toBe('{"label":"vue"}');
  });

  it('will use an ID property if the object contains one', () => {
    expect(getOptionKey({id: 1})).toBe(1);
    expect(getOptionKey({id: 'one'})).toBe('one');
    expect(getOptionKey({id: {im: 'a nested object'}}))
      .toEqual({im: 'a nested object'});
  });
});
