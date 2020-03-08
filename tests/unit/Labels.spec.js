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

  it("will console.warn when options contain objects without a valid label key", async () => {
    const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const Select = selectWithProps({
      options: [{}]
    });

    Select.vm.open = true;
    await Select.vm.$nextTick();

    expect(spy).toHaveBeenCalledWith(
      '[vue-select warn]: Label key "option.label" does not exist in options object {}.' +
        "\nhttps://vue-select.org/api/props.html#getoptionlabel"
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

  describe('getOptionLabel', () => {
    it('will return undefined if the option lacks the label key', () => {
      const getOptionLabel = VueSelect.props.getOptionLabel.default.bind({ label: 'label' });
      expect(getOptionLabel({name: 'vue'})).toEqual(undefined);
    });

    it('will return a string value for a valid key', () => {
      const getOptionLabel = VueSelect.props.getOptionLabel.default.bind({ label: 'label' });
      expect(getOptionLabel({label: 'vue'})).toEqual('vue');
    });

    /**
     * this test fails because of a bug where Vue executes the default contents
     * of a slot, even if it is implemented by the consumer.
     * @see https://github.com/vuejs/vue/issues/10224
     * @see https://github.com/vuejs/vue/pull/10229
     */
    xit('will not call getOptionLabel if both scoped option slots are used and a filter is provided', () => {
      const spy = spyOn(VueSelect.props.getOptionLabel, 'default');
      const Select = shallowMount(VueSelect, {
        propsData: {
          options: [{name: 'one'}],
          filter: () => {},
        },
        scopedSlots: {
          'option': '<span class="option">{{ props.name }}</span>',
          'selected-option': '<span class="selected">{{ props.name }}</span>',
        },
      });

      Select.vm.select({name: 'one'});

      expect(spy).toHaveBeenCalledTimes(0);
      expect(Select.find('.selected').exists()).toBeTruthy();
    });
  });
});
