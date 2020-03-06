var tr_visibles;
// when page is fully loaded
$(document).ready(function () {

    // get all visible elements
    tr_visibles = $("#home-table tr:visible");
    $("#number").text(tr_visibles.length);

    // when study program changes
    $("#study_program").change(function () {

        let value = $(this).val().toLowerCase().split(",");

        // clean outcomes data
        $('#outcomes').empty().append('<option selected value=""> -- Select Outcome -- </option>');

        // get program id
        let progID = $(this).val().split(",");

        // make request to get outcomes by study program
        $.ajax({
            'url': `/admin/outcomes/get/outcomes/${progID[0]}`,
            type: 'GET',
            dataType: 'json',
            beforeSend: function () {
                // Show image container
                $("#loader").show();
                $('#outcomes').prop("disabled", true);
            },
            success: (data) => {

                // populate the options
                data.forEach(element => {
                    $('#outcomes').append(`<option value='${element.name}'>${element.name}</option>`);
                });

                $("#home-table tr").filter(function () {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value[1]) > -1);
                });

                // update the number of quantity
                tr_visibles = $("#home-table tr:visible");
                $("#number").text(tr_visibles.length);


            }, complete: function (data) {
                // Hide image container
                $("#loader").hide();
                $('#outcomes').prop("disabled", false);

            }
        });
    });

    // FILTER BY OUTCOME
    $("#outcomes").change(function () {
        let value = $(this).val().toLowerCase();
        tr_visibles.filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});