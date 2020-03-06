var tr_visibles;
$(document).ready(function () {

    // get all visible elements
    tr_visibles = $("#home-table tr:visible");
    $("#number").text(tr_visibles.length);

    $("#departments").change(function () {
        let dept_ID = $(this).val();

        // show table
        // $("#home-table").removeClass("invisible")

        // Clean inputs
        $('#study_program').empty().append('<option selected value="">-- Study Program --</option>');
        $("#study_program").trigger("change");

        // REQUEST -> get all study programs by a department
        $.ajax({
            'url': `/admin/department/get/studyPrograms/${dept_ID}`,
            type: 'GET',
            dataType: 'json',
            beforeSend: function () {
                // Show image container
                $("#loader").show();
            },
            complete: function (data) {
                // Hide image container
                $("#loader").hide();
                $('#study_program').prop("disabled", false);
            },
            success: (response) => {
                if (response != undefined && response.length > 0) {

                    // get study programs names
                    let names = [];

                    // fill out the selection option
                    response.forEach(element => {
                        names.push(element.name.toLowerCase());
                        $('#study_program').append(`<option value='${element.name}'>${element.name}</option>`);
                    });

                    $("#dept_selected").val(names.join(","));

                    // filter by department
                    filter_by_department(names, true);

                    // update the number of quantity
                    tr_visibles = $("#home-table tr:visible");

                    $("#number").text(tr_visibles.length);

                }
            }
        });
    });

    // filteer by study program
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
}

/**
 * Filter by filter_by_study_program - filter table by study program selected
 * @param {Object} study_programs all sutdy program from a department
 * @return VOID
*/
function filter_by_study_program(study_programs) {
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