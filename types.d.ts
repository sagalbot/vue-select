declare module "vue-select" {
    import Vue from "vue";

    export default class VSelect<Option extends string | { label: string; }> extends Vue {
        autoscroll: boolean;
        autocomplete: HTMLInputElement["autocomplete"];
        appendToBody: boolean;
        value: string | null;
        options: Option[];
        disabled: boolean;
        clearable: boolean;
        searchable: boolean;
        selectable: () => boolean;
        multiple: boolean;
        placeholder: string;
        transition: string;
        calculatePosition: Function;
        clearSearchOnSelect: boolean;
        clearSearchOnBlur: Function;
        closeOnSelect: boolean;
        label: string;
        reduce: (obj: any) => any;
        getOptionLabel: (option: Option) => string;
        getOptionKey: (option: Option) => string;
        onTab: () => unknown;
        taggable: boolean;
        tabindex: number | null;
        pushTags: boolean;
        filterable: boolean;
        filterBy: (option: Option, label: string, search: string) => boolean;
        filter: (options: Option[], search: string[]) => Option[];
        createOption: (option: Option) => Option;
        resetOnOptionsChange: boolean | (() => boolean);
        noDrop: boolean;
        inputId: string;
        dir: "ltr" | "rtl" | "auto";
        selectOnTab: boolean;
    }
}
