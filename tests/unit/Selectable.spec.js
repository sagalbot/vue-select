import { selectWithProps } from "../helpers";

describe("Selectable prop", () => {
  it("should select selectable option if clicked", () => {
    const Select = selectWithProps({
      options: ["one", "two", "three"],
      selectable: (option) => option == "one"
    });

    Select.vm.$data.open = true;

    Select.find(".vs__dropdown-menu li:first-child").trigger("mousedown");
    expect(Select.vm.selectedValue).toEqual(["one"]);
  })

  it("should not select not selectable option if clicked", () => {
    const Select = selectWithProps({
      options: ["one", "two", "three"],
      selectable: (option) => option == "one"
    });

    Select.vm.$data.open = true;

    Select.find(".vs__dropdown-menu li:last-child").trigger("mousedown");
    expect(Select.vm.selectedValue).toEqual([]);
  });
})
