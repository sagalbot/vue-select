import { searchSubmit, selectTag, selectWithProps } from "../helpers";

describe("CreateOption When Tagging Is Enabled", () => {
  it("can select the current search text as a string", async () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      options: ["one", "two"],
      createOption: option => "four"
    });

    await selectTag(Select, "three");
    expect(Select.vm.selectedValue).toEqual(["four"]);
  });

  it("can select the current search text as an object", async () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: false,
      value: null,
      options: [],
      label: "name",
      createOption: title => ({ name: title })
    });

    await selectTag(Select, "two");

    expect(Select.emitted("input")[0]).toEqual([{ name: "two" }]);
  });
});
