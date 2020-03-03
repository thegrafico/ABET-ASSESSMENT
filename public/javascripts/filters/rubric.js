// when page is fully loaded
$(document).ready(function () {
    // state variable
    var value = null;
    
    // when one study program
    $("#study_program").change(function () {
        value = $(this).val().toLowerCase();
        $("#home-table tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });

        value = $("#outcomes").val().toLowerCase();
        $("#home-table tr").filter(function () {

            if ($(this).is(':visible')) {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            }
        });

    });

    $("#outcomes").change(function () {
        value = $(this).val().toLowerCase();
        $("#home-table tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });

        value = $("#study_program").val().toLowerCase();
        $("#home-table tr").filter(function () {

            if ($(this).is(':visible')) {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            }
        });

    });
});