import { mount, shallowMount } from "@vue/test-utils";
import VueSelect from "../../src/components/Select";

describe("When index prop is defined", () => {
  it("can accept an array of objects and pre-selected value (single)", () => {
    const Select = shallowMount(VueSelect, {
      propsData: {
        index: "value",
        value: "foo",
        options: [{ label: "This is Foo", value: "foo" }]
      }
    });
    expect(Select.vm.selectedValue).toEqual(["foo"]);
  });

  it("can determine if an object is pre-selected", () => {
    const Select = shallowMount(VueSelect, {
      propsData: {
        index: "id",
        value: "foo",
        options: [
          {
            id: "foo",
            label: "This is Foo"
          }
        ]
      }
    });

    expect(
      Select.vm.isOptionSelected({
        id: "foo",
        label: "This is Foo"
      })
    ).toEqual(true);
  });

  it("can determine if an object is selected after it has been chosen", () => {
    const Select = shallowMount(VueSelect, {
      propsData: {
        index: "id",
        options: [{ id: "foo", label: "FooBar" }]
      }
    });

    Select.vm.select({ id: "foo", label: "FooBar" });

    expect(
      Select.vm.isOptionSelected({
        id: "foo",
        label: "This is Foo"
      })
    ).toEqual(true);
  });

  it("can accept an array of objects and pre-selected values (multiple)", () => {
    const Select = shallowMount(VueSelect, {
      propsData: {
        multiple: true,
        index: "value",
        value: ["foo", "bar"],
        options: [
          { label: "This is Foo", value: "foo" },
          { label: "This is Bar", value: "bar" }
        ]
      }
    });

    expect(Select.vm.selectedValue).toEqual(["foo", "bar"]);
  });

  it("can deselect a pre-selected object", () => {
    const Select = shallowMount(VueSelect, {
      propsData: {
        multiple: true,
        index: "value",
        options: [
          { label: "This is Foo", value: "foo" },
          { label: "This is Bar", value: "bar" }
        ]
      }
    });

    Select.vm.$data._value = ['foo', 'bar'];

    Select.vm.deselect("foo");
    expect(Select.vm.selectedValue).toEqual(["bar"]);
  });

  it("can deselect an option when multiple is false", () => {
    const Select = shallowMount(VueSelect, {
      propsData: {
        index: "value",
        options: [
          { label: "This is Foo", value: "foo" },
          { label: "This is Bar", value: "bar" }
        ]
      }
    });

    Select.vm.deselect("foo");
    expect(Select.vm.selectedValue).toEqual([]);
  });

  it("can use v-model syntax for a two way binding to a parent component", () => {
    const Parent = mount({
      data: () => ({
        index: "value",
        value: "foo",
        options: [
          { label: "This is Foo", value: "foo" },
          { label: "This is Bar", value: "bar" },
          { label: "This is Baz", value: "baz" }
        ]
      }),
      template: `<div><v-select :index="index" :options="options" v-model="value"></v-select></div>`,
      components: { "v-select": VueSelect }
    });
    const Select = Parent.vm.$children[0];

    expect(Select.value).toEqual("foo");
    expect(Select.selectedValue).toEqual(["foo"]);

    Select.select({ label: "This is Bar", value: "bar" });
    expect(Parent.vm.value).toEqual("bar");
  });

  it("can generate labels using a custom label key", () => {
    const Select = shallowMount(VueSelect, {
      propsData: {
        multiple: true,
        index: "value",
        value: ["baz"],
        label: "name",
        options: [{ value: "foo", name: "Foo" }, { value: "baz", name: "Baz" }]
      }
    });

    expect(Select.find(".vs__selected").text()).toContain("Baz");
  });

  it("will console.warn when attempting to select an option with an undefined index", () => {
    const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const Select = shallowMount(VueSelect, {
      propsData: {
        index: "value",
        options: [{ label: "Foo" }]
      }
    });

    Select.vm.select({ label: "Foo" });
    expect(spy).toHaveBeenCalledWith(
      `[vue-select warn]: Index key "option.value" does not exist in options object {"label":"Foo"}.`
    );
  });

  it("can find the original option within this.options", () => {
    const optionToFind = { id: 1, label: "Foo" };
    const Select = shallowMount(VueSelect, {
      propsData: {
        index: "id",
        options: [optionToFind, { id: 2, label: "Bar" }]
      }
    });

    expect(Select.vm.findOptionByIndexValue(1)).toEqual(optionToFind);
    expect(Select.vm.findOptionByIndexValue(optionToFind)).toEqual(
      optionToFind
    );
  });

  describe("And when option[index] is a nested object", () => {
    it("can determine if an object is pre-selected", () => {
      const nestedOption = { value: { nested: true }, label: "foo" };
      const Select = shallowMount(VueSelect, {
        propsData: {
          index: "value",
          value: {
            nested: true
          },
          options: [nestedOption]
        }
      });

      expect(Select.vm.isOptionSelected({ nested: true })).toEqual(true);
    });

    it("can determine if an object is selected after it is chosen", () => {
      const nestedOption = { value: { nested: true }, label: "foo" };
      const Select = shallowMount(VueSelect, {
        propsData: {
          index: "value",
          options: [nestedOption]
        }
      });

      Select.vm.select(nestedOption);
      expect(Select.vm.isOptionSelected(nestedOption)).toEqual(true);
    });

    it("can determine a selected values label", () => {
      const nestedOption = { value: { nested: true }, label: "foo" };
      const Select = shallowMount(VueSelect, {
        propsData: {
          index: "value",
          value: { nested: true },
          options: [nestedOption]
        }
      });

      expect(Select.vm.getOptionLabel({ nested: true })).toEqual("foo");
    });
  });
});
