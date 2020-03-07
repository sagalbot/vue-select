import { mount, shallowMount } from '@vue/test-utils';
import VueSelect from "../../src/components/Select";
import { mountDefault } from '../helpers';

describe("Reset on options change", () => {
  it("should not reset the selected value by default when the options property changes", () => {
    const Select = shallowMount(VueSelect, {
      propsData: { options: ["one"] }
    });

    Select.vm.$data._value = 'one';

    Select.setProps({options: ["four", "five", "six"]});
    expect(Select.vm.selectedValue).toEqual(["one"]);
  });

  describe('resetOnOptionsChange as a function', () => {
    it('will yell at you if resetOnOptionsChange is not a function or boolean', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      mountDefault({resetOnOptionsChange: 1});
      expect(spy.mock.calls[0][0]).toContain('Invalid prop: custom validator check failed for prop "resetOnOptionsChange"')

      mountDefault({resetOnOptionsChange: 'one'});
      expect(spy.mock.calls[1][0]).toContain('Invalid prop: custom validator check failed for prop "resetOnOptionsChange"')

      mountDefault({resetOnOptionsChange: []});
      expect(spy.mock.calls[2][0]).toContain('Invalid prop: custom validator check failed for prop "resetOnOptionsChange"')

      mountDefault({resetOnOptionsChange: {}});
      expect(spy.mock.calls[3][0]).toContain('Invalid prop: custom validator check failed for prop "resetOnOptionsChange"')
    });

    it('should receive the new options, old options, and current value', async () => {
      let resetOnOptionsChange = jest.fn(option => option);
      const Select = mountDefault(
        {resetOnOptionsChange, options: ['bear'], value: 'selected'},
      );

      Select.setProps({options: ['lake', 'kite']});
      await Select.vm.$nextTick();

      expect(resetOnOptionsChange).toHaveBeenCalledTimes(1);
      expect(resetOnOptionsChange)
        .toHaveBeenCalledWith(['lake', 'kite'], ['bear'], ['selected']);
    });

    it('should allow resetOnOptionsChange to be a function that returns true', async () => {
      let resetOnOptionsChange = () => true;
      const Select = shallowMount(VueSelect, {
        propsData: {resetOnOptionsChange, options: ['one'], value: 'one'},
      });
      const spy = jest.spyOn(Select.vm, 'clearSelection');

      Select.setProps({options: ['one', 'two']});
      await Select.vm.$nextTick();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should allow resetOnOptionsChange to be a function that returns false', () => {
      let resetOnOptionsChange = () => false;
      const Select = shallowMount(VueSelect, {
        propsData: {resetOnOptionsChange, options: ['one'], value: 'one'},
      });
      const spy = jest.spyOn(Select.vm, 'clearSelection');

      Select.setProps({options: ['one', 'two']});
      expect(spy).not.toHaveBeenCalled();
    });

    it('should reset the options if the selectedValue does not exist in the new options', async () => {
      let resetOnOptionsChange = (options, old, val) => val.some(val => options.includes(val));
      const Select = shallowMount(VueSelect, {
        propsData: {resetOnOptionsChange, options: ['one'], value: 'one'},
      });
      const spy = jest.spyOn(Select.vm, 'clearSelection');

      Select.setProps({options: ['one', 'two']});
      await Select.vm.$nextTick();

      expect(Select.vm.selectedValue).toEqual(['one']);

      Select.setProps({options: ['two']});
      await Select.vm.$nextTick();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it("should reset the selected value when the options property changes", async () => {
    const Select = shallowMount(VueSelect, {
      propsData: { resetOnOptionsChange: true, options: ["one"] }
    });

    Select.vm.$data._value = 'one';

    Select.setProps({options: ["four", "five", "six"]});
    await Select.vm.$nextTick();

    expect(Select.vm.selectedValue).toEqual([]);
  });

  it("should return correct selected value when the options property changes and a new option matches", async () => {
    const Select = shallowMount(VueSelect, {
      propsData: { value: "one", options: [], reduce(option) { return option.value } }
    });

    Select.setProps({options: [{ label: "oneLabel", value: "one" }]});
    await Select.vm.$nextTick();

    expect(Select.vm.selectedValue).toEqual([{ label: "oneLabel", value: "one" }]);
  });

  it('clearSearchOnBlur returns false when multiple is true', () => {
    const Select = mountDefault({});
    let clearSearchOnBlur = jest.spyOn(Select.vm, 'clearSearchOnBlur');
    Select.find({ref: 'search'}).trigger('click');
    Select.setData({search: 'one'});
    Select.find({ref: 'search'}).trigger('blur');

    expect(clearSearchOnBlur).toHaveBeenCalledTimes(1);
    expect(clearSearchOnBlur).toHaveBeenCalledWith({
      clearSearchOnSelect: true,
      multiple: false,
    });
    expect(Select.vm.search).toBe('');
  });

  it('clearSearchOnBlur accepts a function', () => {
    let clearSearchOnBlur = jest.fn(() => false);
    const Select = mountDefault({clearSearchOnBlur});

    Select.find({ref: 'search'}).trigger('click');
    Select.setData({search: 'one'});
    Select.find({ref: 'search'}).trigger('blur');

    expect(clearSearchOnBlur).toHaveBeenCalledTimes(1);
    expect(Select.vm.search).toBe('one');
  });
});
