console.log("IN MULTISELECT FILE");

try {        
    document.getElementById("profiles").value = profile;
} catch (error) {
    console.log("Profile dont exits");
}

var multi = new SelectPure(".multi-select", {
    options: dropdowm_values,
    value: dropdown_selected,
    multiple: true,
    icon: "fa fa-times",
    placeholder: "-Please select-",
    onChange: value => { setValue(value) },
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


function setValue(value){
    let departments = document.getElementById("multiple_values");
    departments.value = value + ",";
}