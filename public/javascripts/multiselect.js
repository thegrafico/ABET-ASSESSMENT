console.log("IN MULTISELECT FILE");
console.log(department);

var multi = new SelectPure(".multi-select", {
    options: department,
    multiple: true,
    icon: "fa fa-times",
    placeholder: "-Please select-",
    onChange: value => { console.log(value); },
    classNames: {
        select: "select-pure__select",
        dropdownShown: "select-pure__select--opened",
        multiselect: "select-pure__select--multiple",
        label: "select-pure__label",
        placeholder: "select-pure__placeholder",
        dropdown: "select-pure__options",
        option: "select-pure__option",
        selectedLabel: "select-pure__selected-label",
        selectedOption: "select-pure__option--selected",
        placeholderHidden: "select-pure__placeholder--hidden",
        optionHidden: "select-pure__option--hidden",
    }
});