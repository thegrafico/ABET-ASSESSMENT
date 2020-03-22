var express = require('express');
var router = express.Router();
var general_queries = require('../../helpers/queries/general_queries');
var queries = require('../../helpers/queries/perfTable_queries');
var reportTemplate = require('../../helpers/reportTemplate');
var middleware = require('../../middleware/validate_assessment')
var assessment_query = require("../../helpers/queries/assessment.js");
var { validate_form, get_performance_criteria_results } = require("../../helpers/validation");
var docx = require('docx');
var fs = require('fs');

/* GLOBAL LOCALS */
const base_url = '/professor';
let locals = {
	base_url: base_url,
	title: 'ABET Assessment',
	homeURL: base_url,
	form_action: "/"
};

/*
	- Get /professor
	- HOME PAGE page
	TODO: verify where to redirect when error
*/
router.get('/', async function (req, res) {

	locals.title = "Professor";

	// the user id is stored in session, thats why user need to be login
	let user_id = req.session.user_id;

	// Get all departments
	let departments = await queries.get_department_by_user_id(user_id).catch((err) => {
		console.error("Error getting department: ", err);
	});

	// Getting the term
	let academic_term = await general_queries.get_table_info("ACADEMIC_TERM").catch((err) => {
		console.error("Error getting academic term: ", err);
	});

	let assessments = await assessment_query.get_assessment_by_user_id(user_id).catch((err) => {
		console.error("Error getting user assessment: ", err);
	});

	// assessment 
	locals.assessment_in_progress = [];
	locals.assessment_completed = [];
	locals.assessment_archive = []

	if (assessments != undefined && assessments.length > 0) {

		// Change the date of all assessment
		assessments.map(row => {
			row.creation_date = `${row.creation_date.getMonth() + 1}/${row.creation_date.getDate()}/${row.creation_date.getFullYear()}`;
		});

		locals.assessment_in_progress = assessments.filter(each => each.status == "in_progress");
		locals.assessment_completed = assessments.filter(each => each.status == "completed");
		locals.assessment_archive = assessments.filter(each => each.status == "archive");
	}

	// assign value of table info
	locals.departments = departments || [];
	locals.academic_term = academic_term || [];
	res.render('professor/index', locals);

});

/* 
	- POST - Create assessment
	TODO: Verify is rubric, course and term exist
*/
router.post("/assessment/create", async function (req, res) {

	// getting the user id
	let user_id = req.session.user_id;

	// key of the body params
	let keys = {
		name: "s",
		// department_id: "n",
		// study_program: "n",
		// outcome: "n",
		course: "n",
		rubric: "n",
		term: "n"
	};

	// Validate the form
	if (!validate_form(req.body, keys)) {
		console.error("Error validating the input");
		req.flash("error", "Invalid input type");
		return res.redirect("back");
	}

	req.body.user_id = user_id;

	assessment_query.create_assessment(req.body).then((ok) => {
		req.flash("success", "Assessment created!");
		res.redirect("back");
	}).catch((err) => {
		console.log("ERROR: ", err);
		if (err.code == "ER_DUP_ENTRY")
			req.flash("error", "An Assessment with the same information does already exits");
		else
			req.flash("error", "Error creating assessment");
		res.redirect("back");
	});
});


/*
	- GET PERFORMANCE TABLE ROUTE
	professor/assessment/:id/performanceTable
*/
router.get('/assessment/:assessmentID/performanceTable', middleware.validate_assessment, async function (req, res) {

	// assessment ID
	locals.id = req.params.assessmentID;

	// For breadcrumb
	locals.progressBar = (req.body.assessment.status == "completed") ? 100 : 45;

	// nav breadcrumb
	locals.breadcrumb = [
		{ "name": "Performances Table", "url": `${base_url}/assessment/${locals.id}/performanceTable`, "active": true },
		{ "name": "Course Evaluation", "url": `${base_url}/assessment/${locals.id}/professorInput`, "active": false },
		{ "name": "Report", "url": `${base_url}/assessment/${locals.id}/report`, "active": false }
	];

	// GET ALL performance criterias
	let perf_criterias = await queries.get_perf_criterias(locals.id).catch((err) => {
		console.log("Error: ", err);
	});

	// Validate performance criteria
	if (perf_criterias == undefined || perf_criterias.length == 0) {
		req.flash("error", "Cannot find any performance Criteria");
		return res.redirect(base_url);
	}

	// Get all evaluation
	let studentEvaluation = await queries.getEvaluationByID(locals.id).catch((err) => {
		console.error("ERROR: ", err);
	});

	// Validation
	let results = [];
	let hasValue = 'n';
	if (studentEvaluation != undefined && studentEvaluation.length > 0) {
		results = mapData(studentEvaluation);
		hasValue = 'y';
	}

	locals.hasValue = hasValue;
	locals.prevScores = JSON.stringify(results);
	locals.colNums = perf_criterias.length;
	locals.perfCrit = perf_criterias.map(e => e.perC_order);
	locals.outc_name = perf_criterias[0].outc_name;
	locals.perf_ID = perf_criterias.map(e => e.perC_ID);

	res.render('assessment/perfomanceTable', locals);
});

router.post('/assessment/insertData', async function (req, res) {
	let data = req.body.data;

	await queries.deletePrevEntry(data[0].assessment_ID).catch((err) => {
		console.log("No existing scores on Assessment ID: ", data[0].assessment_ID);
	});

	let index = 0;
	data.forEach(async (entry) => {
		// console.log("Inserting: ", entry);
		await queries.insertStudentScores([entry.assessment_ID, entry.perfC, entry.scores]).catch((err) => {
			console.log("Error: ", err);
		});
		index++;
	});
	index = 0;
});


/* 
	- UPDATE AN ASSESSMENT INFORMATION - 
*/
router.put('/assessment/:assessmentID', middleware.validate_assessment, function (req, res) {

	if (req.params.assessmentID == undefined || isNaN(req.params.assessmentID)) {
		req.flash("error", "Cannot find the assessment");
		return res.redirect("back");
	}
	// getting the user id
	let user_id = req.session.user_id;
	let assessment_id = req.params.assessmentID;

	assessment_query.update_assessment_by_id(user_id, assessment_id, req.body).then((ok) => {
		req.flash("success", "Assessment Updated!");
		res.redirect("back");
	}).catch((err) => {
		console.log("ERROR: ", err);

		console.log("ERROR: ", err);
		if (err.code == "ER_DUP_ENTRY")
			req.flash("error", "An Assessment with the same information does already exits");
		else
			req.flash("error", "Cannot Update the assessment");

		res.redirect("back");
	});
});

/* 
	- DELETE - DELETE assessment
*/
router.delete('/assessment/:assessmentID', async function (req, res) {

	if (req.params.assessmentID == undefined || isNaN(req.params.assessmentID)) {
		req.flash("error", "Cannot find the assessment");
		return res.redirect("back");
	}

	// getting the user id
	let assessment_id = req.params.assessmentID;

	queries.update_status(assessment_id, "archive").then((ok) => {
		req.flash("success", "Assessment Moved to archive!");
		res.redirect("back");
	}).catch((err) => {
		console.log("Cannot Remove the assessment: ", err);
		req.flash("error", "Cannot Remove the assessment!");
		res.redirect("back");
	});
});

/**
 *  GET - Professor Input
 * 	GET - /professor/assessment/:id/professorInput
 */
router.get('/assessment/:assessmentID/professorInput', middleware.validate_assessment, async function (req, res) {

	// assessment id
	let id = req.params.assessmentID;


	// For breadcrumb
	locals.progressBar = (req.body.assessment.status == "completed") ? 100 : 75;

	// nav breadcrumb
	locals.breadcrumb = [
		{ "name": "Performances Table", "url": `${base_url}/assessment/${id}/performanceTable`, "active": false },
		{ "name": "Course Evaluation", "url": `${base_url}/assessment/${id}/professorInput`, "active": true },
		{ "name": "Report", "url": `${base_url}/assessment/${id}/report`, "active": false }
	];

	let report_query = { "from": "REPORTS", "where": "assessment_ID", "id": id }
	let report = await general_queries.get_table_info_by_id(report_query).catch((err) => {
		console.log("ERROR GETTING report");
	});

	locals.grades = [
		{ "name": "A", "value": "" },
		{ "name": "B", "value": "" },
		{ "name": "C", "value": "" },
		{ "name": "D", "value": "" },
		{ "name": "F", "value": "" },
		{ "name": "W", "value": "" },
	];

	locals.total_value = 0;
	locals.have_data = "n";
	let database_keys = ["grade_A", "grade_B", "grade_C", "grade_D", "grade_F", "UW"];
	if (report != undefined && report.length > 0) {
		report = report[0];
		locals.have_data = "y";
		for (let i = 0; i < database_keys.length; i++) {
			locals.grades[i]["value"] = report[database_keys[i]];
			locals.total_value += parseInt(report[database_keys[i]]);
		}
	}

	locals.course_results = report["course_results"] || "";
	locals.course_reflection = report["course_reflection"] || "";
	locals.course_actions = report["course_actions"] || "";
	locals.course_modification = report["course_modification"] || "";
	locals.form_action = `${base_url}/assessment/${id}/professorInput`;

	res.render('assessment/professorInput', locals);
});


/**
 *  GET - Professor Input
 * 	GET - /professor/assessment/:id/professorInput
 */
router.post('/assessment/:assessmentID/professorInput', middleware.validate_assessment, async function (req, res) {

	// default status
	let status = "in_progress";

	// of the user press the finish btn
	if (req.body.save == undefined) {
		status = "completed";
	}
	// Assessment id
	let id = req.params.assessmentID;
	let isUpdate = (req.body.have_data == "y");

	// Only validate the data if the status is completed
	if (status == "completed") {
		
		// keys for grades
		let grades_keys = {
			"A": "n",
			"B": "n",
			"C": "n",
			"D": "n",
			"F": "n",
			"W": "n"
		};

		// validate grades
		if (!validate_form(req.body, grades_keys)) {
			req.flash("error", "Invalid grades, only numbers are accepted");
			return res.redirect("back");
		}

		// Course is the master key
		let text_keys = {
			"results": "s",
			"modification": "s",
			"reflection": "s",
			"improvement": "s"
		};

		// Validate professor input
		if (!validate_form(req.body.course, text_keys)) {
			req.flash("error", "Text boxes cannot be empty and cannot be only numbers");
			return res.redirect("back");
		}
	}


	// TODO: Roolback query is better option
	if (isUpdate) {
		// Update Data 
		queries.update_professor_input(id, req.body, req.body.course).then(async (ok) => {

			await queries.update_status(id, status).catch((err) => {
				console.log("Cannot update the status of the assessment: ", err);
			});
			req.flash("success", "Assessment was moved to completed section!");
			res.redirect(`${base_url}/assessment/${id}/report`);
		}).catch((err) => {
			console.log("ERROR ADDDING PROFESSOR INPUT: ", err);
			req.flash("error", "There is an error trying to update the data");
			res.redirect("back");
		});
	} else {
		// Insert data
		queries.insert_professor_input(id, req.body, req.body.course).then(async (ok) => {

			await queries.update_status(id, status).catch((err) => {
				console.log("Cannot update the status of the assessment: ", err);
			});
			req.flash("success", "Assessment was moved to the complete section!");
			res.redirect(base_url);
		}).catch((err) => {
			console.log("ERROR ADDDING PROFESSOR INPUT: ", err);
			req.flash("error", "There is an error trying to add the data");
			res.redirect("back");
		});
	}
});



/**
 *  UPDATE - UPDATE STATUS OF ASSESSMENT
 * 	GET - /professor/assessment/:id/professorInput
 */
router.put('/assessment/changeStatus/:assessmentID', middleware.validate_assessment, function (req, res) {

	// assessment id
	let id = req.params.assessmentID;

	queries.update_status(id, "in_progress").then((ok) => {
		req.flash("success", "Assessment now is in progress section!");
		res.redirect("back");
	}).catch((err) => {
		console.log("Cannot update the status of the assessment: ", err);
		req.flash("error", "Cannot move assessment!");
		res.redirect("back");
	});

});


/**
 *  VIEW REPORT - ASSESSMENT REPORT
 * 	GET - /professor/:assessment_id/report
*/
router.get('/assessment/:assessmentID/report', middleware.validate_assessment, async function (req, res) {

	// if assessment if completed
	if (req.body.assessment.status != "completed") {
		req.flash("error", "Please complete the assessment first");
		return res.redirect("back");
	}

	// assessment id
	let id = req.params.assessmentID;

	// nav breadcrumb
	locals.breadcrumb = [
		{ "name": "Performances Table", "url": `${base_url}/assessment/${id}/performanceTable`, "active": false },
		{ "name": "Course Evaluation", "url": `${base_url}/assessment/${id}/professorInput`, "active": false },
		{ "name": "Report", "url": `${base_url}/assessment/${id}/report`, "active": true }
	];


	// get the department, pro name, course information and term
	let reportHeader = await queries.get_report_header(id).catch((err) => {
		console.error("Error getting report header: ", err);
	});

	// Validate not empty
	if (reportHeader == undefined || reportHeader.length == 0) {
		req.flash("error", "Cannot find the information of the assessment");
		return res.redirect(base_url);
	}
	locals.header = reportHeader[0];

	// get the professor input data
	let prof_query = { "from": "REPORTS", "where": "assessment_ID", "id": id }
	let professor_input = await general_queries.get_table_info_by_id(prof_query).catch((err) => {
		console.error("Cannot get the professor input data: ", err);
	});

	// Validate not empty
	if (professor_input == undefined || professor_input.length == 0) {
		req.flash("error", "Cannot find the information of course from the selected assessment");
		return res.redirect(base_url);
	}

	// Get performance table data
	let performanceData = await queries.getEvaluationByID(id).catch((err) => {
		console.log("ERROR GETTING PERFOMRNACE DATA: ", err);
	});

	// Validate performance
	if (performanceData == undefined || performanceData.length == 0){
		req.flash("error", "Cannot find the performance criteria data");
		return res.redirect("back");
	}

	// student performance criteria evaluation
	locals.performanceData = mapData(performanceData);
	
	locals.performanceResults = get_performance_criteria_results(locals.performanceData);

	locals.performance_criteria = reportHeader.map(each => each["perC_Desk"]);
	professor_input = professor_input[0];

	// get all grades for table
	let grades = {
		A: professor_input["grade_A"],
		B: professor_input["grade_B"],
		C: professor_input["grade_C"],
		D: professor_input["grade_D"],
		F: professor_input["grade_F"],
		W: professor_input["UW"]
	};

	let total = 0;
	for (key in grades) {
		total += parseInt(grades[key]);
	}
	grades["Total"] = total;

	// assign values to frontend
	locals.profesor_input = professor_input;	
	locals.grades = grades;

	res.render('assessment/report', locals);
});

/**
 * 
*/
function mapData(data) {
	let assessmentID = data[0].assessment_ID;
	let ids = data.map(row => row.row_ID);

	ids = ids.filter(function (item, pos) {
		return ids.indexOf(item) == pos;
	})

	let temp = [];
	ids.forEach((id) => {
		let row_info = [];

		row_info = data.filter(row => row.row_ID == id);

		let row_perf = row_info.map(row => row.perC_ID);
		let row_scores = row_info.map(row => row.row_perc_score);


		// console.log("Row DAta ", row_perf);

		temp.push({
			rowID: id,
			perfC: row_perf,
			scores: row_scores,
			assessmentID: assessmentID
		});
	});

	return temp;
}

module.exports = router;