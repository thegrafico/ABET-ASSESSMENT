
// tags select
const tag_studyProgram = "#std_program";
const tag_outcome = "#outcomes";
const tag_term = "#academic_term";
const tag_modal = "#professor_feedback";
const tag_span_feedback = "#spanFeedback";
const tag_btn_submit = "#btn_submit";
const tag_loader_img = "#loader";
// const canvas = document.getElementById('myChart');
// let ctx = canvas.getContext('2d');
const tag_span_number = "#sNumber";
const tag_feedback_container = "#feedbackContainer";
const tag_table_container = "#tableContainer";

// store all outcomes avg per row
let OUTCOME_AVG_ROW = [];

// store the tables loaded, so the user don't load the same table twice. 
let TABLES_IDS = [];

// STORE THE PREVIUS STATE OF THE STUDY PROGRAM
let PREVIUS_STUDY_PROGRAM = undefined;

// NUM OF TABLES ADDED
let TABLES_COUNT = 0;

$(document).ready(function () {

    // CREATE EXCEL DOCUMENT
    $("#button-a").click(function () {
        convert();
    });

    // STUDY PROGRAM
    $(tag_studyProgram).change(function () {

        // study program id
        let std_id = $(this).val();

        // validate id
        if (std_id == undefined || std_id == "" || isNaN(std_id)){
            modal_message(false, "Cannot find any study program");
            return;
        }

        // load the outcomes
        load_outcomes(std_id);

    });

    // when click submit
    $(tag_btn_submit).click(function () {

        // show img gif loader
        $(tag_loader_img).show();

        // get the id of the element selected
        let std_id = $(tag_studyProgram).val();
        let outcome_id = $(tag_outcome).val();
        let term_id = $(tag_term).val();

        let outcomeName = $(tag_outcome).children("option:selected").text();
        let studyProgramName = $(tag_studyProgram).children("option:selected").text();

        // message for feedback error
        let message = undefined;

        // validte if there is a missing value
        if (std_id == undefined || std_id == "")
            message = "Please Select Study Program";
        else if (outcome_id == undefined || outcome_id == "")
            message = "Please Select an Outcome";
        else if (term_id == undefined || term_id == "")
            message = "Please Select Academic Term";

        // if message is undefined, then there is an error
        if (message != undefined) {
        
            // hide the loader img
            $(tag_loader_img).hide();
            
            // show the error message
            modal_message(false, message);
            return;
        }

        // create unique id for the request
        let ids = std_id + '' + outcome_id + '' + term_id;

        // if the table the user is looking for is already loaded
        if (TABLES_IDS.includes(ids)) {
            $(tag_loader_img).hide();
            return;
        }

        // if the user changes the study program
        if (PREVIUS_STUDY_PROGRAM != undefined) {
            if (PREVIUS_STUDY_PROGRAM != std_id) {
                // reset the outcome AVG
                OUTCOME_AVG_ROW = [];
                
                // resert the tables
                TABLES_IDS = [];

                TABLES_COUNT = 0;

                // remove all tables
                $(tag_table_container).empty();

                // hide the feecback container
                $(tag_feedback_container).hide();
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
                if (response != undefined && response.error == false && response.data != undefined && response.data.length) {

                    // creat modal message
                    let tam = response.data.length;
                    TABLES_COUNT += tam;
                    
                    // feedback modal message
                    let message = (tam == 1) ? "new Table was added": "new Tables were added";
                    modal_message(true, `${tam} ${message}`);

                    // show the feedback container
                    $(tag_span_number).text(TABLES_COUNT);
                    $(tag_feedback_container).show();

                    // create tables from results
                    response.data.forEach(each => {
                        createTable(each, outcomeName, studyProgramName);
                    });

                    // only want 1D array
                    OUTCOME_AVG_ROW = OUTCOME_AVG_ROW.flat();

                    // asign current value
                    PREVIUS_STUDY_PROGRAM = std_id;

                    // add the current table ids
                    TABLES_IDS.push(ids);

                    //======================================

                    // TODO: NOAH YOU SHOULD WORK FROM HERE
                    console.log(OUTCOME_AVG_ROW);
                    // createTable(title, graphData, labels); 

                    //======================================
                } else {
                    modal_message(false, "we couldn't find the data you're looking.");
                }
            },
            dataType: "json"
        });

        $(tag_loader_img).hide();
    });
});

/**
 * Load outcomes
 * @param {Number} std_id - id of the std program 
 */
async function load_outcomes(std_id) {
    
    // Validate outcome
    if (std_id == undefined || std_id == "" || isNaN(std_id)){
        return;
    }

    // load image: loading
    $(tag_loader_img).show();

    // disable options
    $(tag_outcome).prop("disabled", true);
    $(tag_term).prop("disabled", true);

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
}

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

// function createTable(title, graphData, labels) {
//     let myChart = new Chart(canvas, {
// 		type: 'bar',
// 		data: {
// 			labels: labels,
// 			datasets: [
// 				{
// 					label: title,
// 					data: graphData,
// 					backgroundColor: 'rgba(58, 166, 87, 0.2)', // Need to make where now matter the amount of PC it can make amou
// 				},
// 			]
// 		},
// 		showTooltips: false,
// 		options: {
// 			scales: {
// 				yAxes: [{
// 					ticks: {
// 						beginAtZero: true,
// 						max: 100
// 					}
// 				}]
// 			},
// 			responsive: true,
// 			animation: {
// 				duration: 1,
// 				onComplete: () => {

// 				}
// 			}
// 		}	
// 	});
// }