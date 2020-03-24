var tr_visibles;
// when page is fully loaded
$(document).ready(async function () {

    // get all visible elements
    tr_visibles = $("#home-table tr:visible");
    $("#number").text(tr_visibles.length);

    // when study program changes
    $("#study_program").change(async function () {

        // disable outcome
        $('#outcomes').prop("disabled", true);

        let value = $(this).val().toLowerCase().split(",");

        // clean outcomes data
        $('#outcomes').empty().append('<option selected value=""> -- Select Outcome -- </option>');

        // get program id
        let progID = $(this).val().split(",");

        // if the user wants to view all rubric
        if (progID == undefined || progID.length == 1) {
            $("#home-table tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf("") > -1);
            });

            tr_visibles = $("#home-table tr:visible");
            $("#number").text(tr_visibles.length);
            return;
        }

        // request to get outcome by study program id
        let outcomes = await make_request(`/api/get/outcomeByStudyProgram/${progID[0]}`).catch((err) => {
            console.log("Error getting outcome: ", err);
        });

        if (outcomes != undefined && outcomes.length > 0) {

            // enable outcome
            $('#outcomes').prop("disabled", false);

            // populate the options
            outcomes.forEach(element => {
                $('#outcomes').append(`<option value='${element.outc_name}'>${element.outc_name}</option>`);
            });

            $("#home-table tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value[1]) > -1);
            });

            // update the number of quantity
            tr_visibles = $("#home-table tr:visible");
            $("#number").text(tr_visibles.length);

        }else{
            // TODO:  change for a span message
            alert("Cannot find any outcome for this study program");
        }
    });

    // FILTER BY OUTCOME
    $("#outcomes").change(function () {
        let value = $(this).val().toLowerCase();
        tr_visibles.filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });

        $("#number").text($("#home-table tr:visible").length);
    });
});