$(document).ready(() => {

    // change the data when user select study program
    $(".VIEW").click(function () {

        // id to make the request
        let rubric_id = $(this).val();
        $.ajax({
            'url': `/admin/api/evaluationRubric/get/performances/${rubric_id}`,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                $(".subtitle").text("Performances Rubric");
                $(".row-elements").empty();
                data.forEach(element => {
                    $(".row-elements").append(`
                        <li><strong> ${element["perC_Desk"]}</strong></li>
                    `);
                });
            }
        });
    });
});