import { searchSubmit, selectWithProps } from "../helpers";

describe("When Tagging Is Enabled", () => {
  it("can determine if a given option string already exists", () => {
    const Select = selectWithProps({ taggable: true, options: ["one", "two"] });
    expect(Select.vm.optionExists("one")).toEqual(true);
    expect(Select.vm.optionExists("three")).toEqual(false);
  });

  it("can determine if a given option object already exists", () => {
    const Select = selectWithProps({
      taggable: true,
      options: [{ label: "one" }, { label: "two" }]
    });

    expect(Select.vm.optionExists("one")).toEqual(true);
    expect(Select.vm.optionExists("three")).toEqual(false);
  });

  it("can determine if a given option object already exists when using custom labels", () => {
    const Select = selectWithProps({
      taggable: true,
      options: [{ foo: "one" }, { foo: "two" }],
      label: "foo"
    });

    expect(Select.vm.optionExists("one")).toEqual(true);
    expect(Select.vm.optionExists("three")).toEqual(false);
  });

  it("can add the current search text as the first item in the options list", () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      value: ["one"],
      options: ["one", "two"]
    });

    Select.vm.search = "three";
    expect(Select.vm.filteredOptions).toEqual(["three"]);
  });

  it("can select the current search text as a string", () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      options: ["one", "two"]
    });

    searchSubmit(Select, "three");

    expect(Select.vm.selectedValue).toEqual(["three"]);
  });

  it("can select the current search text as an object", () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      options: [{ label: "one" }]
    });

    searchSubmit(Select, "two");

    expect(Select.vm.selectedValue).toEqual([
      { label: "two" }
    ]);
  });

  it("should add a freshly created option/tag to the options list when pushTags is true", () => {
    const Select = selectWithProps({
      pushTags: true,
      taggable: true,
      multiple: true,
      value: ["one"],
      options: ["one", "two"]
    });

    searchSubmit(Select, "three");
    expect(Select.vm.pushedTags).toEqual(["three"]);
    expect(Select.vm.optionList).toEqual(["one", "two", "three"]);
  });

  it("should add a freshly created option/tag to the options list when pushTags is true and filterable is false", () => {
    const Select = selectWithProps({
      filterable: false,
      pushTags: true,
      taggable: true,
      multiple: true,
      value: ["one"],
      options: ["one", "two"]
    });

    searchSubmit(Select, "three");
    expect(Select.vm.pushedTags).toEqual(["three"]);
    expect(Select.vm.optionList).toEqual(["one", "two", "three"]);
    expect(Select.vm.filteredOptions).toEqual(["one", "two", "three"]);
  });

  it("wont add a freshly created option/tag to the options list when pushTags is false", () => {
    const Select = selectWithProps({
      pushTags: false,
      taggable: true,
      multiple: true,
      value: ["one"],
      options: ["one", "two"]
    });

    searchSubmit(Select, "three");
    expect(Select.vm.optionList).toEqual(["one", "two"]);
  });

  it("wont add a freshly created option/tag to the options list when pushTags is false and filterable is false", () => {
    const Select = selectWithProps({
      filterable: false,
      pushTags: false,
      taggable: true,
      multiple: true,
      value: ["one"],
      options: ["one", "two"]
    });

    searchSubmit(Select, "three");
    expect(Select.vm.optionList).toEqual(["one", "two"]);
    expect(Select.vm.filteredOptions).toEqual(["one", "two"]);
  });

  it("should select an existing option if the search string matches a string from options", async () => {
    let two = "two";
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      options: ["one", two]
    });

    Select.vm.search = "two";

    searchSubmit(Select);

    expect(Select.vm.selectedValue).toEqual([two]);
  });

  it("should select an existing option if the search string matches an objects label from options", () => {
    let two = { label: "two" };
    const Select = selectWithProps({
      taggable: true,
      options: [{ label: "one" }, two]
    });

    Select.vm.search = "two";

    searchSubmit(Select);
    expect(Select.vm.selectedValue).toEqual([two]);
  });

  it("should select an existing option if the search string matches an objects label from options when filter-options is false", () => {
    let two = { label: "two" };
    const Select = selectWithProps({
      taggable: true,
      filterable: false,
      options: [{ label: "one" }, two]
    });

    Select.vm.search = "two";

    searchSubmit(Select);
    expect(Select.vm.selectedValue).toEqual([two]);
  });

  it("should not reset the selected value when the options property changes", () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      value: [{ label: "one" }],
      options: [{ label: "one" }]
    });

    Select.setProps({ options: [{ label: "two" }] });
    expect(Select.vm.selectedValue).toEqual([{ label: "one" }]);
  });

  it("should not reset the selected value when the options property changes when filterable is false", () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      filterable: false,
      value: [{ label: "one" }],
      options: [{ label: "one" }]
    });

    Select.setProps({ options: [{ label: "two" }] });
    expect(Select.vm.selectedValue).toEqual([{ label: "one" }]);
  });

  it("should not allow duplicate tags when using string options", () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true
    });

    searchSubmit(Select, "one");
    expect(Select.vm.selectedValue).toEqual(["one"]);
    expect(Select.vm.search).toEqual("");

    searchSubmit(Select, "one");
    expect(Select.vm.selectedValue).toEqual(["one"]);
    expect(Select.vm.search).toEqual("");
  });

  it("should not allow duplicate tags when using object options", () => {
    const Select = selectWithProps({
      taggable: true,
      multiple: true,
      options: [{ label: "two" }]
    });

    searchSubmit(Select, "one");
    expect(Select.vm.selectedValue).toEqual([{ label: "one" }]);
    expect(Select.vm.search).toEqual("");

    searchSubmit(Select, "one");
    expect(Select.vm.selectedValue).toEqual([{ label: "one" }]);
    expect(Select.vm.search).toEqual("");
  });
});
