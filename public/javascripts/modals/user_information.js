
const tag_btn = "#userInformation";
const tag_modal_user_info = "#userInformationModal";

$(document).ready(function(){

    $(tag_btn).click(async function(){

        let user_info = await make_request("/api/get/currentUserInformation").catch((err) =>{});

        if (user_info == undefined || user_info.error == undefined || user_info.error == true || user_info.response == undefined){
            return;
        }

        let response = user_info.response;
        let canDo = response["canDo"];

        $("#privileges").text(response['privileges']);
        $("#canDo").empty();

        canDo.forEach(each => {
            $("#canDo").append(`<li>${each}</li>`);
        });

        $("#notes").empty().append(response["notes"]);

        $(tag_modal_user_info).modal("show");
    }); 
});