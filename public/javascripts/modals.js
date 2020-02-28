$(document).ready(() => {

    // change the data when user select study program
    $(".REMOVE").click(function () {

        // url to make the request
        let url = $("#url").val();

        // id to make the request
        let id = $(this).val();
        $(".form-data").attr("action", `${url}/${id}?_method=DELETE`);
        $.ajax({
            'url': `${url}/get/${id}`,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                console.log(data);
                $(".subtitle").text("Are you sure you want to remove this record?");

                $(".row-elements").empty();

                data.forEach(element => {
                    $(".row-elements").append(`
                    <div class="row my-4">
                        <div class="col-2 text-right"><strong> ${element["name"]}</strong></div>
                        <div class="col row-value"> ${element["value"]}</div>
                    </div>`);
                });
            }
        });
    });
});