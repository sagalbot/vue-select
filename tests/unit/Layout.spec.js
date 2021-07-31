import { shallowMount } from "@vue/test-utils";
import VueSelect from "../../src/components/Select";

describe("Single value options", () => {
  it("should reset the search input on focus lost", () => {
    const Select = shallowMount(VueSelect);
    Select.vm.open = true;

    Select.vm.search = "t";
    expect(Select.vm.search).toEqual("t");

    Select.vm.onSearchBlur();
    expect(Select.vm.search).toEqual("");
  });

  it("should not reset the search input on focus lost when clearSearchOnSelect is false", () => {
    const Select = shallowMount(VueSelect, {
      propsData: { value: "foo", clearSearchOnSelect: false }
    });

    expect(Select.vm.clearSearchOnSelect).toEqual(false);

    Select.vm.open = true;
    Select.vm.search = "t";
    expect(Select.vm.search).toEqual("t");

    Select.vm.onSearchBlur();
    expect(Select.vm.search).toEqual("t");
  });

  it("should set the search text as option when syncSearchValue is true", () => {
    const Select = shallowMount(VueSelect, {
      propsData: {
        value: "one",
        syncSearchValue: true,
        options: ["one", "two", "three"],
      }
    });

    expect(Select.vm.syncSearchValue).toEqual(true);

    Select.vm.open = true;
    expect(Select.vm.search).toEqual("one");

    Select.vm.onAfterSelect("two");
    expect(Select.vm.search).toEqual("two");
  });
});
