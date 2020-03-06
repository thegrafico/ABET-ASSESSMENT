var tr_visibles;
$(document).ready(function () {

    // get all visible elements
    tr_visibles = $("#filter tr:visible");
    $("#number").text(tr_visibles.length);

    $("#filterBy").change(function () {
        let dept_name = $(this).val().toLowerCase();

        // iter all over the tr
        $("#filter tr").filter(function () {
            // get the text of the tr
            let tr_text = $(this).text().toLowerCase();

            $(this).toggle(tr_text.indexOf(dept_name) > -1);
        });
        tr_visibles = $("#filter tr:visible");
        $("#number").text(tr_visibles.length);

    });
});