
var tr_visibles = $("#tableFilter tr:visible");
const all_columns = $("#tableFilter tr:visible");


$(document).ready(function () {

    set_index();

    // Filtes ID
    const tag_professor = "#filterProfessorName";
    const tag_course = "#filterCourse";
    const tag_status = "#filterStatus";
    const tag_study_program = "#filterStudyProgram";
    const tag_outcome = "#filterOutcome";
    const tag_term = "#filterTerm";

    // Filter by professor name and id
    $(tag_professor).on("keyup", function () {

        // PROFESSOR IS THE SECOND COLUM
        filter_by_colum(this, 2);
    });

    // Filter by professor name and id
    $(tag_professor).focusout(function(){

        if ($(this).val().length == 0){
            tr_visibles = $("#tableFilter tr");
        }else{
            tr_visibles = $("#tableFilter tr:visible");
        }

    });

    // Filter by course colum
    $(tag_course).on("keyup", function () {

        // PROFESSOR IS THE SECOND COLUM
        filter_by_colum(this, 4);
    });

     // Filter by professor name and id
     $(tag_course).focusout(function(){

        if ($(this).val().length == 0){
            tr_visibles = $("#tableFilter tr");
        }else{
            tr_visibles = $("#tableFilter tr:visible");
        }
    });

});


/**
 * filter_by_colum - filter tr by column number
 * @param {Object} element - element to search the value 
 *  @param {Number} number - Number of the column to search the value 
 */
function filter_by_colum(element, colum) {

    // reset if the column is grater than 0
    if (colum < 0) colum = 1;

    let user_input = $(element).val().toLowerCase();

    tr_visibles.filter(function () {

        let text_to_search = $(this).find(`td:eq(${(colum - 1)})`).text();

        // console.log($(this).text().toLowerCase().trim());

        $(this).toggle(text_to_search.toLowerCase().indexOf(user_input) > -1);
    });

    // update the number of quantity
    $("#number").text($("#tableFilter tr:visible").length);
}

/**
 * set_index - Set the index of the first colum of the table
 */
function set_index() {

    $("tr td:first-child").each(function (index, value) {
        $(this).text((index + 1));
    });
}