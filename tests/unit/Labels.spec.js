import VueSelect from "../../src/components/Select";
import { shallowMount } from "@vue/test-utils";
import { selectWithProps } from "../helpers";

describe("Labels", () => {
  it("can generate labels using a custom label key", () => {
    const Select = selectWithProps({
      options: [{ name: "Foo" }],
      label: "name",
      value: { name: "Foo" }
    });
    expect(Select.find(".vs__selected").text()).toBe("Foo");
  });

  it("will console.warn when options contain objects without a valid label key", () => {
    const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const Select = selectWithProps({
      options: [{}]
    });

    Select.vm.open = true;
    expect(spy).toHaveBeenCalledWith(
      '[vue-select warn]: Label key "option.label" does not exist in options object {}.' +
        "\nhttp://sagalbot.github.io/vue-select/#ex-labels"
    );
  });

  it("should display a placeholder if the value is empty", () => {
    const Select = shallowMount(VueSelect, {
      propsData: {
        options: ["one"]
      },
      attrs: {
        placeholder: "foo"
      }
    });

    expect(Select.vm.searchPlaceholder).toEqual("foo");
    Select.vm.$data._value = "one";
    expect(Select.vm.searchPlaceholder).not.toBeDefined();
  });
});
