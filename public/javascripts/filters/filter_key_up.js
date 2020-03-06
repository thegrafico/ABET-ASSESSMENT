try {
    if (tr_visibles){
        console.log("Filter");
    }
} catch (error) {
    tr_visibles = $("#filter tr")
}

$(document).ready(function () {

    $("#myInput").on("keyup", function () {
        let value = $(this).val().toLowerCase();
        
        tr_visibles.filter(function () {
            // console.log(value);
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });

         // update the number of quantity
         $("#number").text($("#filter tr:visible").length);
    });
});