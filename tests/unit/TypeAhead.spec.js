import { shallowMount } from "@vue/test-utils";
import VueSelect from "../../src/components/Select";
import { mountDefault, mountWithoutTestUtils } from "../helpers";
import typeAheadMixin from "../../src/mixins/typeAheadPointer";
import Vue from "vue";

describe("Moving the Typeahead Pointer", () => {
  it("should set the pointer to zero when the filteredOptions watcher is called", async () => {
    const Select = shallowMount(VueSelect, {
      propsData: { options: ["one", "two", "three"] },
      sync: false
    });

    Select.vm.search = "one";

    await Select.vm.$nextTick();
    expect(Select.vm.typeAheadPointer).toEqual(0);
  });

  it("should move the pointer visually up the list on up arrow keyUp", () => {
    const Select = mountDefault();

    Select.vm.typeAheadPointer = 1;

    Select.find({ ref: "search" }).trigger("keydown.up");

    expect(Select.vm.typeAheadPointer).toEqual(0);
  });

  it("should move the pointer visually down the list on down arrow keyUp", () => {
    const Select = mountDefault();

    Select.vm.typeAheadPointer = 1;

    Select.find({ ref: "search" }).trigger("keydown.down");

    expect(Select.vm.typeAheadPointer).toEqual(2);
  });

  it("should not move the pointer past the end of the list", () => {
    const Select = mountDefault();

    Select.vm.typeAheadPointer = 2;
    Select.vm.typeAheadDown();
    expect(Select.vm.typeAheadPointer).toEqual(2);
  });
});
