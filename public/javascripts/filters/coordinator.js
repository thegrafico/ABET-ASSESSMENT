
var tr_visibles = $("#tableFilter tr:visible");
var key_up_tr = $("#tableFilter tr:visible");

$(document).ready(function () {

    set_index();

    // Filtes ID
    const tag_professor = "#filterProfessorName";
    const tag_course = "#filterCourse";
    const tag_status = "#filterStatus";
    const tag_study_program = "#filterStudyProgram";
    const tag_outcome = "#filterOutcome";
    const tag_term = "#filterTerm";

    // =========================== FILTER BY PROFESSOR ===============================
    $(tag_professor).on("keyup", function () {

        // PROFESSOR IS THE SECOND COLUM
        // filter_by_colum($(this).val(), 2);
        filter_keyup($(this).val(), 2);

    });

    // Filter by professor name and id
    $(tag_professor).focusout(function(){

        if ($(this).val().length == 0){
            tr_visibles = $("#tableFilter tr");
        }else{
            tr_visibles = $("#tableFilter tr:visible");
        }
    });
    
    $(tag_professor).focusin(function(){
        key_up_tr = $("#tableFilter tr:visible");
    });

    // =========================== FILTER BY COURSE ===============================
    $(tag_course).on("keyup", function () {

        let val = $(this).val();
        // filter_by_colum(val, 4);
        filter_keyup(val, 4);

    });

     $(tag_course).focusout(function(){

        if ($(this).val().length == 0){

            tr_visibles = $("#tableFilter tr");

            if ($(tag_status).val() != ""){
                filter_by_colum($(tag_status).val(), 7);
            }
        }else{
            tr_visibles = $("#tableFilter tr:visible");
        }
    });

    $(tag_course).focusin(function(){
        key_up_tr = $("#tableFilter tr:visible");
    });

    // =========================== FILTER BY STATUS ===============================
    $(tag_status).change(function(){
        
        filter_by_colum($(this).val(), 7);
    });
    
    // =========================== FILTER BY STUDY PROGRAM ===============================
    $(tag_study_program).change(function(){ 
        filter_by_colum($(this).val(), 4);
    });
});

/**
 * filter_by_colum - filter tr by column number
 * @param {String} value - element to search the value 
 *  @param {Number} number - Number of the column to search the value 
 */
function filter_by_colum(value, colum) {

    // reset if the column is grater than 0
    if (colum < 0) colum = 1;

    let user_input = value.toLowerCase();

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

function filter_keyup(value, colum){
    // reset if the column is grater than 0
    if (colum < 0) colum = 1;

    let user_input = value.toLowerCase();

    key_up_tr.filter(function () {

        let text_to_search = $(this).find(`td:eq(${(colum - 1)})`).text();

        $(this).toggle(text_to_search.toLowerCase().indexOf(user_input) > -1);
    });

    // update the number of quantity
    $("#number").text($("#tableFilter tr:visible").length);
}