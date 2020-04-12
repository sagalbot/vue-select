import { mount, shallowMount } from "@vue/test-utils";
import VueSelect from "../../src/components/Select";

describe("When reduce prop is defined", () => {
  it("can accept an array of objects and pre-selected value (single)", () => {
    const Select = shallowMount(VueSelect, {
      propsData: {
        reduce: option => option.value,
        value: "foo",
        options: [{ label: "This is Foo", value: "foo" }]
      }
    });
    expect(Select.vm.selectedValue).toEqual([{ label: "This is Foo", value: "foo" }]);
  });

  it("can determine if an object is pre-selected", () => {
    const Select = shallowMount(VueSelect, {
      propsData: {
        reduce: option => option.id,
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

  it('can determine if an object is selected after its been chosen', () => {
      const Select = shallowMount(VueSelect, {
        propsData: {
          reduce: option => option.id,
          options: [{id: 'foo', label: 'FooBar'}],
        },
      });

      Select.vm.select({id: 'foo', label: 'FooBar'});

      expect(Select.vm.isOptionSelected({
        id: 'foo',
        label: 'This is FooBar',
      })).toEqual(true);
    });

  it("can accept an array of objects and pre-selected values (multiple)", () => {
    const Select = shallowMount(VueSelect, {
      propsData: {
        multiple: true,
        reduce: option => option.value,
        value: ["foo"],
        options: [
          { label: "This is Foo", value: "foo" },
          { label: "This is Bar", value: "bar" }
        ]
      }
    });

    expect(Select.vm.selectedValue).toEqual([{ label: "This is Foo", value: "foo" }]);
  });

  it("can deselect a pre-selected object", () => {
    const Select = shallowMount(VueSelect, {
      propsData: {
        multiple: true,
        reduce: option => option.value,
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
        reduce: option => option.value,
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
        reduce: option => option.value,
        value: "foo",
        options: [
          { label: "This is Foo", value: "foo" },
          { label: "This is Bar", value: "bar" },
          { label: "This is Baz", value: "baz" }
        ]
      }),
      template: `<div><v-select :reduce="option => option.value" :options="options" v-model="value"></v-select></div>`,
      components: { "v-select": VueSelect }
    });
    const Select = Parent.vm.$children[0];

    expect(Select.value).toEqual("foo");
    expect(Select.selectedValue).toEqual([{ label: "This is Foo", value: "foo" }]);

    Select.select({ label: "This is Bar", value: "bar" });
    expect(Parent.vm.value).toEqual("bar");
  });

  it("can generate labels using a custom label key", () => {
    const Select = shallowMount(VueSelect, {
      propsData: {
        multiple: true,
        reduce: option => option.value,
        value: ["CA"],
        label: "name",
        options: [{ value: "CA", name: "Canada" }, { value: "US", name: "United States" }]
      }
    });

    expect(Select.find(".vs__selected").text()).toContain("Canada");
  });

  it("can find the original option within this.options", () => {
    const optionToFind = { id: 1, label: "Foo" };
    const Select = shallowMount(VueSelect, {
      propsData: {
        reduce: option => option.id,
        options: [optionToFind, { id: 2, label: "Bar" }]
      }
    });

    expect(Select.vm.findOptionFromReducedValue(1)).toEqual(optionToFind);
    expect(Select.vm.findOptionFromReducedValue(optionToFind)).toEqual(
      optionToFind
    );
  });

  it('can work with falsey values', () => {
    const option = {value: 0, label: 'No'};
    const Select = shallowMount(VueSelect, {
      propsData: {
        reduce: option => option.value,
        options: [option, {value: 1, label: 'Yes'}],
        value: 0,
      },
    });

    expect(Select.vm.findOptionFromReducedValue(option)).toEqual(option);
    expect(Select.vm.selectedValue).toEqual([option]);
  });

  it('works with null values', () => {
    const option = {value: null, label: 'No'};
    const Select = shallowMount(VueSelect, {
      propsData: {
        reduce: option => option.value,
        options: [option, {value: 1, label: 'Yes'}],
        value: null,
      },
    });

    expect(Select.vm.findOptionFromReducedValue(option)).toEqual(option);
    expect(Select.vm.selectedValue).toEqual([option]);
  });

  describe("And when a reduced option is a nested object", () => {
    it("can determine if an object is pre-selected", () => {
      const nestedOption = { value: { nested: true }, label: "foo" };
      const Select = shallowMount(VueSelect, {
        propsData: {
          reduce: option => option.value,
          value: {
            nested: true
          },
          options: [nestedOption]
        }
      });

      expect(Select.vm.selectedValue).toEqual([nestedOption]);
    });

    it("can determine if an object is selected after it is chosen", () => {
      const nestedOption = { value: { nested: true }, label: "foo" };
      const Select = shallowMount(VueSelect, {
        propsData: {
          reduce: option => option.value,
          options: [nestedOption]
        }
      });

      Select.vm.select(nestedOption);
      expect(Select.vm.isOptionSelected(nestedOption)).toEqual(true);
    });

  });

  it("reacts correctly when value property changes", async () => {
    const optionToChangeTo = { id: 1, label: "Foo" };
    const Select = shallowMount(VueSelect, {
      propsData: {
        value: 2,
        reduce: option => option.id,
        options: [optionToChangeTo, { id: 2, label: "Bar" }]
      }
    });

    Select.setProps({ value: optionToChangeTo.id });
    await Select.vm.$nextTick();

    expect(Select.vm.selectedValue).toEqual([optionToChangeTo]);
  });

  describe('Reducing Tags', () => {
    it('tracks values that have been created by the user', async () => {
      const Parent = mount({
        data: () => ({selected: null, options: []}),
        template: `
          <v-select
            v-model="selected"
            :options="options"
            taggable
            :reduce="name => name.value"
            :create-option="label => ({ label, value: -1 })"
          />
        `,
        components: {'v-select': VueSelect},
      });
      const Select = Parent.vm.$children[0];

      //  When
      Select.$refs.search.focus();
      await Select.$nextTick();

      Select.search = 'hello';
      await Select.$nextTick();

      Select.typeAheadSelect();
      await Select.$nextTick();

      //  Then
      expect(Select.selectedValue).toEqual([{label: 'hello', value: -1}]);
      expect(Select.$refs.selectedOptions.textContent.trim()).toEqual('hello');
      expect(Parent.vm.selected).toEqual(-1);
    });
  });
});
