var tr_visibles;
$(document).ready(function () {

    // get all visible elements
    tr_visibles = $("#home-table tr:visible");
    $("#number").text(tr_visibles.length);

    $("#departments").change( async function () {

        // get the department id selected
        let dept_ID = $(this).val();

        // Disable the study program btn
        $('#study_program').prop("disabled", true);

        // Clean inputs
        $('#study_program').empty().append('<option selected value="">-- Study Program --</option>');
        $("#study_program").trigger("change");

        // if the user wants to know all departmenst
        if (dept_ID != undefined && dept_ID.trim().length == 0) {
            $("#home-table tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf("") > -1);
            });

            // get all visible elements
            tr_visibles = $("#home-table tr:visible");
            $("#number").text(tr_visibles.length);

            return;
        }

        // getting study program by department id
        let study_programs = await make_request(`/api/department/get/studyPrograms/${dept_ID}`).catch((err) =>{
            console.log("There is an error getting department ID: ", err);
        });

        // if found any study program for the selected department
        if (study_programs != undefined && study_programs.length > 0) {

            // Enable study programs
            $('#study_program').prop("disabled", false);

            // To store all study program names
            let names = [];

            // fill out the selection option
            study_programs.forEach(element => {
                // add the study program name to the array
                names.push(element.name.toLowerCase());

                // create a new option for the user in the select option
                $('#study_program').append(`<option value='${element.name}'>${element.name}</option>`);
            });

            // Join all the names into a single string separate by ','
            $("#dept_selected").val(names.join(","));

            // filter by department by study program name
            filter_by_department(names);

            // update the number of quantity
            tr_visibles = $("#home-table tr:visible");
            $("#number").text(tr_visibles.length);

        }else{
            alert("Cannot find any study program");
        }
    });

    // filter by study program
    filter_by_study_program();

    // filter by input type
    filter_by_input();
});

/**
 * Filter by department - filter table by departmet study program
 * @param {Array} study_programs all sutdy program from a department
 * @return VOID
*/
function filter_by_department(study_programs) {
    
    let names = study_programs.map(e => e.toLowerCase());

    // iter all over the tr
    $("#home-table tr").filter(function () {
        // get the text of the tr
        let tr_text = $(this).text().toLowerCase();

        $(this).toggle(names.some(n => tr_text.indexOf(n.toLowerCase()) > 0));
    });

    $("#number").text( $("#home-table tr:visible").length);
}

/**
 * Filter by filter_by_study_program - filter table by study program selected
 * @return VOID
*/
function filter_by_study_program() {
    $("#study_program").change(function () {

        let value = $(this).val().toLowerCase();

        if (value == undefined || value.length == 0 || value == '') {

            let departments = $("#dept_selected").val();

            if (departments != undefined) {

                filter_by_department(departments.split(","));
                return;
            }
        }

        $("#home-table tr").filter(function () {

            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });

        tr_visibles = $("#home-table tr:visible");

        // update the number of quantity
        $("#number").text(tr_visibles.length);

    });
}

/**
 * Filter by input - filter table by the input the user type
 * @return VOID
*/
function filter_by_input() {

    $("#myInput").on("keyup", function () {
        let value = $(this).val().toLowerCase();

        tr_visibles.filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });

        // update the number of quantity
        $("#number").text($("#home-table tr:visible").length);
    });
}