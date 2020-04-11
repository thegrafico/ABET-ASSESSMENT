
var tr_visibles = $("#tableFilter tr:visible");
var key_up_tr = $("#tableFilter tr:visible");

// Filtes ID
const tag_professor = "#filterProfessorName";
const tag_course = "#filterCourse";
const tag_status = "#filterStatus";
const tag_study_program = "#filterStudyProgram";
const tag_outcome = "#filterOutcome";
const tag_term = "#filterTerm";
const tag_loader_img = "#loader";
const tag_number_rows = "#numberOfRows";

const tag_colums = {
    "#filterProfessorName": 2,
    "#filterCourse": 4,
    "#filterStatus": 7,
    "#filterStudyProgram": 4,
    "#filterOutcome": 5,
    "#filterTerm": 6
};

$(document).ready(function () {

    set_index();

    $(tag_number_rows).text($("#tableFilter tr:visible").length);


    // =========================== FILTER BY PROFESSOR ===============================
    $(tag_professor).on("keyup", function () {
        filter_keyup($(this).val(), 2);

        $(tag_number_rows).text($("#tableFilter tr:visible").length);

    });

    // Filter by professor name and id
    $(tag_professor).focusout(function () {
        filter_all();
    });

    $(tag_professor).focusin(function () {
        key_up_tr = $("#tableFilter tr:visible");
    });

    // =========================== FILTER BY COURSE ===============================
    $(tag_course).on("keyup", function () {

        let val = $(this).val();
        // filter_by_colum(val, 4);
        filter_keyup(val, 4);

        $(tag_number_rows).text($("#tableFilter tr:visible").length);

    });

    $(tag_course).focusout(function () {
        filter_all();
    });

    $(tag_course).focusin(function () {
        key_up_tr = $("#tableFilter tr:visible");
    });

    // =========================== FILTER BY STATUS ===============================
    $(tag_status).change(function () {
        filter_all();
    });

    // =========================== FILTER BY STUDY PROGRAM ===============================
    $(tag_study_program).change(async function () {

        filter_all();
        $(tag_loader_img).show();


        $(tag_outcome).empty().append(`<option selected value=""> -- Outcome -- </option>`);
        $(tag_outcome).prop("disabled", true);

        // get study program id
        let std_id = $(this).val().split(",")[1];

        let outcomes = await make_request(`/api/get/outcomesByStudyProgramID/${std_id}`);
    
        // if cannot find an outcome
        if (outcomes == undefined || outcomes.length == 0){
            $(tag_loader_img).hide();
            return;
        }
        
        fill_select(tag_outcome, outcomes);

        // enable the outcome
        $(tag_outcome).prop("disabled", false);

        $(tag_loader_img).hide();

    });

    // =========================== FILTER BY OUTCOME ===============================
    $(tag_outcome).change(function(){
        filter_all();
    });

    $("#box_outcome").hover(function () {
    
        let isDisabled = $(tag_outcome).prop("disabled");

        // TODO: better message UI
        if (isDisabled) {
            $("#outcome_span").show();
            $("#outcome_span").text("Select Study Program");

            setTimeout(() => {
                $("#outcome_span").hide();
            }, 2000);
        }
    });

    // =========================== FILTER BY TERM ===============================
    $(tag_term).change(function () {
        filter_all();
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
}

/**
 * set_index - Set the index of the first colum of the table
 */
function set_index() {

    $("tr td:first-child").each(function (index, value) {
        $(this).text((index + 1));
    });
}

function filter_keyup(value, colum) {
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

/**
 * 
 * @param {String} tag - tag name - ID 
 * @param {Array} values - values for tag name
 */
function fill_select(tag, values){
    values.forEach(each => {
        $(tag).append(`<option value="${each['name']}"> ${each['name']}</option>`);
    });
}

/**
 * filter_all - filter all options from filter section
 */
function filter_all() {

    let hasFilter = false;
    tr_visibles = $("#tableFilter tr");

    for (const key in tag_colums) {

        let val = $(key).val();

        // the colum study program is separated by ,
        if (key == tag_study_program) {
            val = val.split(",")[0];
        }

        if (val != "") {
            filter_by_colum(val, tag_colums[key]);
            tr_visibles = $("#tableFilter tr:visible");
            hasFilter = true;
        }
    }

    // if does not have any filter
    if (!hasFilter) {
        tr_visibles.show();
    }

    $(tag_number_rows).text($("#tableFilter tr:visible").length);
}