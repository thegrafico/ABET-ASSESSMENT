/**
 * make_request is loaded in the file that uses this script
 */

$(document).ready(() => {

    // change the data when user select study program
    $(".VIEW").click( async function () {

        // id to make the request
        let rubric_id = $(this).val();
    
        let rubrid_data = await make_request(`/api/evaluationRubric/get/performances/${rubric_id}`).catch((err) => {
            console.log("There is an error: ", err);
        });

        $(".subtitle").text("Performances Rubric");
        $(".row-elements").empty();
        rubrid_data.forEach(element => {
            $(".row-elements").append(`
                <li><strong> ${element["perC_Desk"]}</strong></li>
            `);
        });
    });
});