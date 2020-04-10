
// tags select
const tag_studyProgram = "#std_program";
const tag_outcome = "#outcomes";
const tag_term = "#academic_term";
const tag_modal = "#professor_feedback";
const tag_span_feedback = "#spanFeedback";
const tag_btn_submit = "#btn_submit";
const tag_loader_img = "#loader";

// store all outcomes avg per row
let OUTCOME_AVG_ROW = [];
let TABLES_IDS = [];

// STORE THE PREVIUS STATE TO NOT REPEATE DATA
let PREVIUS_STUDY_PROGRAM = undefined;
let PREVIUS_OUTCOME = undefined;
let PREVIUS_TERM = undefined;

$(document).ready(function () {

    // CREATE EXCEL DOCUMENt
    $("#button-a").click(function () {
        convert();
    });

    // STUDY PROGRAM
    $(tag_studyProgram).change(async function () {

        // load image: loading
        $(tag_loader_img).show();

        // disable options
        $(tag_outcome).prop("disabled", true);
        $(tag_term).prop("disabled", true);

        let std_id = $(this).val();

        // get outcomes
        let outcomes = await make_request(`/api/get/outcomesByStudyProgramID/${std_id}`).catch((err) => {
            console.error("Error getting outcomes: ", err);
        });

        // validate outcomes
        if (outcomes == undefined || outcomes.length == 0) {
            $(tag_loader_img).hide();
            modal_message("Cannot find any Outcome");
            return;
        }

        // enable outcomes
        $(tag_loader_img).hide();
        $(tag_outcome).prop("disabled", false);
        $(tag_term).prop("disabled", false);
        $(tag_outcome).empty().append('<option selected disabled value=""> -- Outcome -- </option>');
        fill_select(tag_outcome, outcomes);
    });

    // when click submit
    $(tag_btn_submit).click(function () {

        $(tag_loader_img).show();

        let std_id = $(tag_studyProgram).val();
        let outcome_id = $(tag_outcome).val();
        let term_id = $(tag_term).val();

        let outcomeName = $(tag_outcome).children("option:selected").text();
        let studyProgramName = $(tag_studyProgram).children("option:selected").text();

        let message = undefined;

        if (std_id == undefined || std_id == "")
            message = "Please Select Study Program";
        else if (outcome_id == undefined || outcome_id == "")
            message = "Please Select an Outcome";
        else if (term_id == undefined || term_id == "")
            message = "Please Select Academic Term";

        if (message != undefined) {
            $(tag_loader_img).hide();
            modal_message(false, message);
            return;
        }

        let ids = std_id + '' + outcome_id + '' +  term_id;

        if (TABLES_IDS.includes(ids)) {
            $(tag_loader_img).hide();
            return;
        }

        if (PREVIUS_STUDY_PROGRAM != undefined) {
            if (PREVIUS_STUDY_PROGRAM != std_id) {
                // reset the outcome AVG
                OUTCOME_AVG_ROW = [];
                TABLES_IDS = [];
                $("#tableContainer").empty();
            }
        }
        // data for request
        let dept_assessment_data = { "study_program_id": std_id, "outcome_id": outcome_id, "term_id": term_id };

        // make request
        $.ajax({
            type: "GET",
            url: "/api/get/departmentAssessment",
            data: { "data": dept_assessment_data },
            success: (response) => {
                $(tag_loader_img).hide();

                // validating response
                if (response != undefined && response.error == false) {

                    // creat modal message
                    modal_message(true, "Success, Now you can donwload the tables as excel file.");

                    // create tables from results
                    response.data.forEach(each => {
                        createTable(each, outcomeName, studyProgramName);
                    });

                    OUTCOME_AVG_ROW = OUTCOME_AVG_ROW.flat();

                    // asign current value
                    PREVIUS_STUDY_PROGRAM = std_id;
        
                    TABLES_IDS.push(ids);

                    //======================================

                    // TODO: NOAH YOU SHOULD WORK FROM HERE
                    console.log(OUTCOME_AVG_ROW);

                    //======================================
                } else {
                    modal_message(false, "we couldn't find the data you're looking");
                }
            },
            dataType: "json"
        });

        $(tag_loader_img).hide();
    });
});



/**
 * @param {bool} error - add class green or red 
 * @param {String} message - message for the modal 
 */
function modal_message(success, message) {
    $(tag_modal).modal("show");

    if (success) {
        $("#feedbackTitle").text("Success!");
        $(tag_span_feedback).css({ "color": "green" });
    } else {
        $("#feedbackTitle").text("Sorry!");
        $(tag_span_feedback).css({ "color": "red" });
    }

    $(tag_span_feedback).text(message);
}

/**
 * @param {String} tag - tag name - ID 
 * @param {Array} values - values for tag name
 */
function fill_select(tag, values) {
    values.forEach(each => {
        $(tag).append(`<option value="${each['value']}"> ${each['name']}</option>`);
    });
}

/**
* Create table 
*/
function createTable(data, outcome, std) {

    let html = undefined;
    let performances = data["performances"];
    const numPerformances = performances.length;
    const scoreLen = performances[0]["scores"].length;

    // =========================== TABLE CONTAINER =============================

    // Container
    html = `<div class="container mt-4 table-cont">`;

    // table & header
    html += `<table class="table table-bordered TableCreated">`;

    html += `<thead class="thead-dark">`;

    // =========================== FIRST HEADER =============================
    // + 2 because we add student and outcome result colums
    // first header
    html += `<tr>`;
    html += `<th colspan = "${(numPerformances + 2)}" scope = "col"> ${data["name"]} - ${outcome} - ${std}</th>`;
    // end first header
    html += `</tr>`;

    // =========================== SECOND HEADER =============================
    // second header
    html += `<tr>`;
    html += `<th scope = "col"> Student # </th>`;
    console.log(data["performances"][0]);
    for (let i = 0; i < numPerformances; i++) {

        html += `<th scope = "col"> ${data["performances"][i]["description"]}</th>`;
    }
    html += `<th scope = "col"> Outcome Result</th>`;

    // end second header
    html += `</tr>`;

    // end header
    html += `</thead>`;

    // =========================== BODY DATA =============================
    // table body
    html += `<tbody>`;
    let tr = `<tr>`;
    let outcome_results = []; // store outcome result per row
    for (let i = 0; i < scoreLen; i++) {
        tr = `<tr>`;
        tr += `<th> ${i + 1} </th>`

        let j = 0;
        let outcomeAvg = 0;
        while (j < numPerformances) {
            outcomeAvg += performances[j]["scores"][i] || 0;

            tr += `<td> ${performances[j]["scores"][i]} </td>`;
            j++;
        }

        let outcomeAvgRow = (outcomeAvg / numPerformances).toFixed(2);
        outcome_results.push(outcomeAvgRow);

        // row outcome result
        tr += `<td> ${outcomeAvgRow} </td>`;

        html += `</tr>`;
        html += tr;
    }

    tr = `<tr>`;
    tr += `<th> % Student with 3 or more </th>`

    // LAST ROW AVG RESULT
    const acceptedVal = 3;
    for (let i = 0; i < numPerformances; i++) {

        let score = performances[i]["scores"];

        // sum each column of score
        let avg = 0;
        avg = score.filter(val => val >= acceptedVal).length;

        // get percent of student with 3 or more (Only one decimal place)
        avg = ((avg / scoreLen) * 100).toFixed(2);

        tr += `<th> ${avg} </th>`;
    }
    OUTCOME_AVG_ROW.push(outcome_results);
    let otucome_gt_accepted = outcome_results.filter(val => val >= acceptedVal).length;
    let outcomeAvgResult = ((otucome_gt_accepted / scoreLen) * 100).toFixed(2);

    tr += `<th> ${outcomeAvgResult} </th>`;
    html += tr;
    html += `</tr>`;


    // end table body
    html += `</tbody>`;
    // =========================== END TABLE =============================
    // end table
    html += `</table>`;

    // end container
    html += `</div>`;

    html += `<hr>`;

    $("#tableContainer").append(html);
}

/**
 * Convert tables into excel file
 */
function convert() {

    let tables = [];

    let tablesNumber = $(".TableCreated").length;

    let tbl = undefined;
    let worksheet_tmp1 = undefined;
    let currentTable = undefined

    for (let i = 0; i < tablesNumber; i++) {

        tbl = document.getElementsByTagName("table")[i];
        worksheet_tmp = XLSX.utils.table_to_sheet(tbl);
        currentTable = XLSX.utils.sheet_to_json(worksheet_tmp, { header: 1 });

        tables.push(currentTable);
        tables.push('');

    }

    tables = tables.flat();

    let worksheet = XLSX.utils.json_to_sheet(tables, { skipHeader: true })

    const new_workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(new_workbook, worksheet, "worksheet")
    XLSX.writeFile(new_workbook, 'tmp_file.xls')
}