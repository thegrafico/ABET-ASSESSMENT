$(document).ready(function () {

    // DROPDOWM MENU
    $("#std_options").click(function (e) {
        $("#myDropdown").toggle();
        e.preventDefault();
    });

    $(".check :checkbox").click(function () {
        let name = $(this).attr("name");
        let isCoordinator = isNaN($(this).val());
        let isCheck; // check if the actual btn is checked
        let isNotCheck; // check is the first btn is not checkt

        // if the user click the checkbox of coordinator
        if (isCoordinator) {

            // iter all tr
            $(`input[name='${name}']`).each(function (index, value) {

                // COORDINATOR IS CHECK
                if (index == 1) {
                    isCheck = $(this).prop('checked');

                    if (isCheck) {
                        $(this).prop('checked', true);
                    } else {
                        $(this).prop('checked', false);
                    }
                } else {
                    // always check this if the coordinator is press
                    $(this).prop('checked', true);
                }
            });

        // if the user press the normal checkbox
        } else {

            $(`input[name='${name}']`).each(function (index, value) {

                // COORDINATOR IS CHECK
                if (index == 0) {
                    isCheck = $(this).prop('checked');

                    if (!isCheck) {
                        isNotCheck = true;
                    }
                } else {
                    isCheck = $(this).prop('checked');

                    // only turn off the coordinator check is the std check is off
                    if (isNotCheck) {
                        $(this).prop('checked', false);
                    }
                }
            });
        }
    });

    $("#done_std_program").click(function (e) {
        $("#myDropdown").hide();

        validate_checkbox("tr :checkbox");
        e.preventDefault();

    });

    // // Close the dropdown if the user clicks outside of it
    // $(document).mouseup(function (e) {
    //     var container = $("#myDropdown");

    //     // if the target of the click isn't the container nor a descendant of the container
    //     if (!container.is(e.target) && container.has(e.target).length === 0) {
    //         container.hide();
    //     }
    // });

    function validate_checkbox(selector) {
        let isEmpty = true;

        // iter all checkbox
        $(selector).each(function () {
            if ($(this).prop('checked')) {   
                isEmpty = false;
            }
        });

        if (isEmpty) {
            $(".btn_text").text("Select Study Program");
            $("#err_std").text("*Cannot be empty");
            $("#err_std").css({
                "color": "red",
            });

        } else {
            $(".btn_text").text("Study Program Selected");
            $("#err_std").empty().append('<i class="fa fa-check"></i>');
            $("#err_std").css({
                "color": "green",
            });
        }
    }

    setTimeout(function(){
        validate_checkbox("tr :checkbox");
    }, 200);
});

