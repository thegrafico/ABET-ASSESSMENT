$(document).ready(() => {

    // change the data when user select study program
    $(".REMOVE").click(async function () {

        // id of the element clicked
        let id = $(this).val();

        // API URL to get the data of the element clicked
        let api_url = $("#url").val();

        // url to send the data to remove
        let base_url = $("#base_url").val();
        
        // Change the form action
        $(".form-data").attr("action", `${base_url}/${id}?_method=DELETE`);

        /* 
            - Make the request and get the data to show the user
            TODO: remove console.log error
        */
        let response = await make_request(`${api_url}/${id}`).catch((err) => {
            console.log("Error getting the data: ", err);
        });

        if (response != undefined && response.length > 0) {
            
            // change title
            $(".subtitle").text("Are you sure you want to remove this record?");

            // clean the body message
            $(".row-elements").empty();

            // append
            response.forEach(element => {
                $(".row-elements").append(`
                <div class="row my-4">
                    <div class="col-2 text-right"><strong> ${element["name"]}</strong></div>
                    <div class="col row-value"> ${element["value"]}</div>
                </div>`);
            });
        }
    });
});