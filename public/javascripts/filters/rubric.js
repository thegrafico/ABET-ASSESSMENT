// when page is fully loaded
$(document).ready(function () {
    // state variable
    var value = null;

    // FILTER BY STUDY PROGRAM
    $("#study_program").change(function () {
        value = $(this).val().toLowerCase().split(",");
        $("#home-table tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value[1]) > -1);
        });
    });


    // FILTER BY OUTCOME
    $("#outcomes").change(function () {
        value = $(this).val().toLowerCase();
        $("#home-table tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });



    // when study program changes
    $("#study_program").change(function () {

        // clean outcomes data
        $('#outcomes').empty().append('<option disabled selected value> -- Select Outcome -- </option>');

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
                console.log(data);
                // populate the options
                data.forEach(element => {
                    $('#outcomes').append(`<option value='${element.name}'>${element.name}</option>`);
                });
            }, complete: function (data) {
                // Hide image container
                $("#loader").hide();
                $('#outcomes').prop("disabled", false);

            }
        });
    });
});