var express = require('express');
var router = express.Router();
var general_queries = require('../../helpers/queries/general_queries');
var queries = require('../../helpers/queries/perfTable_queries');
var middleware = require('../../middleware/validate_assessment')
var assessment_query = require("../../helpers/queries/assessment.js");
const table = require("../../helpers/DatabaseTables");
var { validate_form, get_performance_criteria_results, getNumbersOfRows } = require("../../helpers/validation");
var { insertStudentScores } = require("../../helpers/queries/roolback_queries");
const { admin, coordinator, statusOfAssessment } = require("../../helpers/profiles");
var moment = require("moment");


/* GLOBAL LOCALS */
const base_url = '/professor';
let locals = {
	base_url: base_url,
	title: 'ABET Assessment',
	homeURL: base_url,
	form_action: "/"
};

// Assessments status
const progress = statusOfAssessment.in_progress;
const completed = statusOfAssessment.completed;
const archive = statusOfAssessment.archive;

/*
	- Get /professor
	- HOME PAGE page
	TODO: verify where to redirect when error
*/
router.get('/', async function (req, res) {

	locals.title = "Professor";

	// current assessment active
	locals.active = progress;
	if (req.query != undefined && req.query.active != undefined) {
		locals.active = req.query.active;
	}

	// the user id is stored in session, thats why user need to be login
	let user_id = req.session.user_id;

	let study_programs = undefined;
	// if the user is admin
	if (req.session.user_profile == admin) {

		// get admin study programs for coordinator
		study_programs = await general_queries.get_table_info(table.study_program).catch((err) => {
			console.error("Error getting study program: ", err);
		});
	} else {
		study_programs = await assessment_query.get_study_program_by_user_id(user_id).catch((err) => {
			console.error("Error gettign study program: ", err);
		});
	}

	// Getting the term
	let academic_term = await general_queries.get_table_info(table.academic_term).catch((err) => {
		console.error("Error getting academic term: ", err);
	});

	// get all user assessment
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
			let date = moment(row.creation_date, "YYYYMMDD");

			row.creation_date = date.fromNow();
		});

		locals.assessment_in_progress = assessments.filter(each => each.status == progress);
		locals.assessment_completed = assessments.filter(each => each.status == completed);
		locals.assessment_archive = assessments.filter(each => each.status == archive);
	}

	// assign value of table info
	locals.study_programs = study_programs || [];
	locals.academic_term = academic_term || [];
	locals.HavePrivilege = (req.session.user_profile == admin || req.session.user_profile == coordinator);
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
		course: "n",
		rubric: "n",
		course_section: "n",
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
router.get('/assessment/:assessmentID/performanceTable', middleware.validate_assessment, middleware.isOwnerAssessment, async function (req, res) {

	// Status of the assessment
	if (req.body.assessment.status == archive) {
		req.flash("error", "Cannot edit assessment archive");
		return res.redirect("/professor");
	}

	locals.title = "Performance Table";

	// assessment ID
	locals.id = req.params.assessmentID;

	// For breadcrumb
	locals.progressBar = (req.body.assessment.status == completed) ? 100 : 45;

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

	let getGraph = await queries.getGraph(locals.id).catch((err) => {
		console.error("ERROR: ", err);
	});

	let hasGraph = 'y';


	if (getGraph.length <= 0) {
		hasGraph = 'n';
	}

	// Validation
	let results = [];
	let hasValue = 'n';
	if (studentEvaluation != undefined && studentEvaluation.length > 0) {
		results = mapData(studentEvaluation);
		hasValue = 'y';
	}
	let perC_Desk = [];
	perf_criterias.forEach((element, index) => {
		perC_Desk[index] = element.perC_Desk;
	});

	locals.hasGraph = hasGraph;
	locals.hasValue = hasValue;
	locals.prevScores = JSON.stringify(results);
	locals.colNums = perf_criterias.length;
	locals.perfCrit = perf_criterias.map(e => e.perC_order);
	locals.outc_name = perf_criterias[0].outc_name;
	locals.outcomeDescription = perf_criterias[0].outc_description;
	locals.perf_ID = perf_criterias.map(e => e.perC_ID);
	locals.perC_Desk = perC_Desk;

	res.render('professor/assessment/perfomanceTable', locals);
});


/**
 * -- API POST -- POST new performance record 
 * -- POST /professor/assessment/id/performancetable
 * TODO: the frontend is affecting the backed. if the data format changes, everything here changes. 
 */
router.post('/assessment/:assessmentID/performancetable', middleware.validate_assessment, middleware.isOwnerAssessment, async function (req, res) {

	// Status of the assessment
	if (req.body.assessment.status == archive) {
		return res.json({ error: true, message: "Assessment is archive" });
	}

	// validate data has data
	if (req.body == undefined || req.body.data == undefined || isNaN(req.params.assessmentID)) {
		return res.json({ error: true, message: "data is undefined" });
	}

	// assessment id
	let assessment_id = req.params.assessmentID;

	// performance data
	let performance_records = req.body.data;

	// 
	let has_graph = (req.body.hasGraph == 'y');

	//
	let base_64 = req.body.graph;

	if (has_graph) {
		let updateGraph = await queries.updateGraph(assessment_id, base_64).catch((err) => {
			console.log("Error: ", err);
		});
		console.log("Updated Base_64");
	} else {
		let addGraph = await queries.addGraph(assessment_id, base_64).catch((err) => {
			console.log("Error: ", err);
		});
		console.log("Add new Base 64");
	}

	// validate there is data available
	if (performance_records.length <= 0) {
		return res.json({ error: true, message: "data is undefined" });
	}
	// get an array of index of the rows with the data good to insert
	let indexs = getNumbersOfRows(performance_records);

	// to store each row || to store performances student
	let rows = [], performances_student = [];

	indexs.forEach(index => {
		// to insert the new row id
		rows.push([assessment_id]);

		// the performance to be inserted
		performances_student.push(performance_records[index]);
	});

	let isNext = req.body.ifNext;

	insertStudentScores(rows, performances_student, assessment_id).then(async (success) => {

		await queries.update_status(assessment_id, progress).catch((err) => {
			console.log("Cannot update the status of the assessment: ", err);
		});

		console.log("Data was successfully added.");
		return res.json({ error: false, message: "success", isNext: isNext });
	}).catch((err) => {
		console.log("Error Performance table: ", err);
		return res.json({ error: true, message: "data is undefined" });
	});

});

/* 
	- UPDATE AN ASSESSMENT INFORMATION - 
*/
router.put('/assessment/:assessmentID', middleware.validate_assessment, middleware.isOwnerAssessment, function (req, res) {

	// Status of the assessment
	if (req.body.assessment.status == archive) {
		req.flash("error", "Cannot edit assessment archive");
		return res.redirect("/professor");
	}

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
router.delete('/assessment/:assessmentID', middleware.validate_assessment, middleware.isOwnerAssessment, async function (req, res) {

	// Status of the assessment
	if (req.body.assessment.status == archive) {
		req.flash("error", "Assessment is archive");
		return res.redirect("/professor");
	}

	// getting the user id
	let assessment_id = req.params.assessmentID;

	queries.update_status(assessment_id, archive).then((ok) => {
		req.flash("success", "Assessment Moved to archive!");
		res.redirect(`${base_url}?&active='completed'`);
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
router.get('/assessment/:assessmentID/professorInput', middleware.validate_assessment, middleware.isOwnerAssessment, async function (req, res) {

	// Status of the assessment
	if (req.body.assessment.status == archive) {
		req.flash("error", "Cannot edit assessment archive");
		return res.redirect("/professor");
	}

	locals.title = "Professor Input";

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

	let report_query = { "from": table.reports, "where": "assessment_ID", "id": id }
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
	locals.result_outcome = report["result_outcome"] || "";
	locals.form_action = `${base_url}/assessment/${id}/professorInput`;

	res.render('professor/assessment/professorInput', locals);
});

/**
 *  GET - Professor Input
 * 	GET - /professor/assessment/:id/professorInput
 */
router.post('/assessment/:assessmentID/professorInput', middleware.validate_assessment, middleware.isOwnerAssessment, async function (req, res) {

	// Status of the assessment
	if (req.body.assessment.status == archive) {
		req.flash("error", "Cannot edit assessment archive");
		return res.redirect("/professor");
	}

	// Assessment id
	let id = req.params.assessmentID;

	// if the user pressed finish assessment the status is completed
	let status = (req.body.finish != undefined) ? completed : progress;

	// verify is the assessment has data
	let isUpdate = (req.body.have_data == "y");

	// Only validate the data if the status is completed
	if (status == completed) {

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
			"improvement": "s",
			"result_outcome": 's'
		};

		// Validate professor input
		if (!validate_form(req.body.course, text_keys)) {
			req.flash("error", "Text boxes cannot be empty and cannot be only numbers");
			return res.redirect("back");
		}
	}

	// Get performance table data
	let performanceData = await queries.getEvaluationByID(id).catch((err) => {
		console.log("ERROR GETTING PERFOMRNACE DATA: ", err);
	});

	// TODO: Roolback query is better option
	if (isUpdate) {
		// Update Data 
		queries.update_professor_input(id, req.body, req.body.course).then(async (ok) => {

			if (status == completed) {


				// Validate performance
				if (performanceData == undefined || performanceData.length == 0) {
					req.flash("error", "Data was Saved, but cannot completed the assessment due to Performance Criteria table Empty");
					return res.redirect(`/professor/assessment/${id}/performanceTable`);
				}

				// check is null
				let hasNullValues = performanceData.some(each => each["row_perc_score"] == null);

				if (hasNullValues) {
					req.flash("error", "Data was Saved, but cannot completed the assessment due to Performance Criteria table is missing values");
					return res.redirect(`/professor/assessment/${id}/performanceTable`);
				}

			}

			await queries.update_status(id, status).catch((err) => {
				console.log("Cannot update the status of the assessment: ", err);
			});

			if (status == completed) {
				req.flash("success", "Assessment was moved to completed section!");
				res.redirect(`${base_url}/assessment/${id}/report`);

			} else {
				req.flash("success", "Assessment data was saved!");
				res.redirect(base_url);
			}

		}).catch((err) => {
			console.log("ERROR ADDDING PROFESSOR INPUT: ", err);
			req.flash("error", "There is an error trying to update the data");
			res.redirect("back");
		});
	} else {
		// Insert data
		queries.insert_professor_input(id, req.body, req.body.course).then(async (ok) => {

			// Validate performance
			if (status == completed) {
				if (performanceData == undefined || performanceData.length == 0) {
					req.flash("error", "Data was Saved, but cannot completed the assessment due to Performance Criteria table is empty");
					return res.redirect("back");
				}

				// check is null
				let hasNullValues = performanceData.some(each => each["row_perc_score"] == null);

				if (hasNullValues) {
					req.flash("error", "Data was Saved, but cannot completed the assessment due to Performance Criteria table is missing values");
					return res.redirect(`/professor/assessment/${id}/performanceTable`);
				}
			}

			await queries.update_status(id, status).catch((err) => {
				console.log("Cannot update the status of the assessment: ", err);
			});

			if (status == completed) {
				req.flash("success", "Assessment was moved to completed section!");
				res.redirect(`${base_url}/assessment/${id}/report`);
			} else {
				req.flash("success", "Assessment data was saved!");
				res.redirect(base_url);
			}

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
router.put('/assessment/changeStatus/:assessmentID', middleware.validate_assessment, middleware.isOwnerAssessment, function (req, res) {


	// Status of the assessment
	if (req.body.assessment.status == archive) {
		req.flash("error", "Cannot edit assessment archive");
		return res.redirect("/professor");
	}

	// assessment id
	let id = req.params.assessmentID;

	queries.update_status(id, progress).then((ok) => {
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
	if (req.body.assessment.status == progress) {
		req.flash("error", "Please finish the assessment first to view the report");
		return res.redirect("back");
	}

	// assessment id
	let assessment_id = req.params.assessmentID;
	locals.title = "Assessment Report";

	// nav breadcrumb
	locals.breadcrumb = [
		{ "name": "Performances Table", "url": `${base_url}/assessment/${assessment_id}/performanceTable`, "active": false },
		{ "name": "Course Evaluation", "url": `${base_url}/assessment/${assessment_id}/professorInput`, "active": false },
		{ "name": "Report", "url": `${base_url}/assessment/${assessment_id}/report`, "active": true }
	];

	// Status of the assessment
	locals.isArchive = (req.body.assessment.status == archive);
	locals.belong_to_user = req.body.belong_to_user;

	let getGraph = await queries.getGraph(assessment_id).catch((err) => {
		console.error("ERROR: ", err);
	});

	if (getGraph.length <= 0) {
		locals.graph = 'n';
	} else {
		locals.graph = getGraph[0].base_64;
	}

	// get the department, pro name, course information and term
	let reportHeader = await queries.get_report_header(assessment_id).catch((err) => {
		console.error("Error getting report header: ", err);
	});

	// Validate not empty
	if (reportHeader == undefined || reportHeader.length == 0) {
		req.flash("error", "Cannot find the information of the assessment");
		return res.redirect(base_url);
	}

	locals.header = reportHeader[0];

	// get the professor input data
	let prof_query = { "from": table.reports, "where": "assessment_ID", "id": assessment_id }
	let professor_input = await general_queries.get_table_info_by_id(prof_query).catch((err) => {
		console.error("Cannot get the professor input data: ", err);
	});

	// Validate not empty
	if (professor_input == undefined || professor_input.length == 0) {
		req.flash("error", "Cannot find the information of course from the selected assessment");
		return res.redirect(base_url);
	}

	// Get performance table data
	let performanceData = await queries.getEvaluationByID(assessment_id).catch((err) => {
		console.log("ERROR GETTING PERFOMRNACE DATA: ", err);
	});

	// Validate performance
	if (performanceData == undefined || performanceData.length == 0) {
		req.flash("error", "This assessment does not have the performance criteria data");
		return res.redirect("back");
	}

	// student performance criteria evaluation
	locals.performanceData = mapData(performanceData);

	locals.performanceResults = get_performance_criteria_results(locals.performanceData);

	let tempOb = locals.performanceResults;
	tempOb.header = reportHeader[0];
	locals.perfResults = JSON.stringify(tempOb);
	professor_input = professor_input[0];

	let performances = [];
	reportHeader.forEach(each => { 
		performances.push({ description: each["perC_Desk"], order: each["perC_order"] });
	});

	locals.performance_criteria = performances;

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

	res.render('professor/assessment/report', locals);
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