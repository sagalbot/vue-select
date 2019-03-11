import { shallowMount } from "@vue/test-utils";
import VueSelect from "../../src/components/Select";

describe("Reset on options change", () => {
  it("should not reset the selected value by default when the options property changes", () => {
    const Select = shallowMount(VueSelect, {
      propsData: { options: ["one"] }
    });

    Select.vm.$data._value = 'one';

    Select.setProps({options: ["four", "five", "six"]});
    expect(Select.vm.selectedValue).toEqual(["one"]);
  });

  it("should reset the selected value when the options property changes", () => {
    const Select = shallowMount(VueSelect, {
      propsData: { resetOnOptionsChange: true, options: ["one"] }
    });

    Select.vm.$data._value = 'one';

    Select.setProps({options: ["four", "five", "six"]});
    expect(Select.vm.selectedValue).toEqual([]);
  });
});
