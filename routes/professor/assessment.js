var express = require('express');
var router = express.Router();
var general_queries = require('../../helpers/queries/general_queries');
var chooseCourseTermQuery = require('../../helpers/queries/chooseCourseTermQueries');
var queries = require('../../helpers/queries/perfTable_queries');
var reportTemplate = require('../../helpers/reportTemplate');
var middleware = require('../../middleware/validate_assessment')
var assessment_query = require("../../helpers/queries/assessment.js");
var { validate_form } = require("../../helpers/validation");

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

	res.render('professor/home', locals);
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
	- Get /professor/assessment/id
*/
<<<<<<< HEAD
router.get('/assessment/:assessmentID/performanceTable', middleware.validate_assessment ,async function (req, res) {
=======
router.get('/assessment/:assessmentID', middleware.validate_assessment, async function (req, res) {


	locals.id = req.params.assessmentID;
>>>>>>> origin/master

	locals.breadcrumb = [
		{ "name": req.body.assessment.name, "url": "." }
	];
	

	// GET ALL performance criterias
	let perf_criterias = await queries.get_perf_criterias(locals.id).catch((err) => {
		console.log("Error: ", err);
	});
<<<<<<< HEAD
	console.log("Perf_Cirterias Results: ", perf_criterias);
=======
>>>>>>> origin/master

	locals.colNums = perf_criterias.length;
	locals.perfCrit = perf_criterias.map(e => e.perC_order);
	locals.outc_name = perf_criterias[0].outc_name;

	res.render('assessment/perfomanceTable', locals);
});

router.post('/assessment/insertData', function(req, res) {
	let data = req.body.data;
	console.log("DATA: ", data);
});


/* 
	- UPDATE AN ASSESSMENT INFORMATION - 
*/
router.put('/assessment/:assessmentID', function (req, res) {

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


	// assessment_query.remove_assessment_by_id(user_id, assessment_id).then((ok) => {
	// 	req.flash("success", "Assessment Removed!");
	// 	res.redirect("back");
	// }).catch((err) => {
	// 	console.log("ERROR: ", err);

	// 	req.flash("error", "Cannot remove the assessment");

	// 	res.redirect("back");
	// });

});

/**
 *  GET - Professor Input
 * 	GET - /professor/assessment/:id/professorInput
 */
router.get('/assessment/:assessmentID/professorInput', middleware.validate_assessment, async function (req, res) {

	// assessment id
	let id = req.params.assessmentID;

	locals.form_action = `${base_url}/assessment/${id}/professorInput`;
	// for breadcrum
	locals.breadcrumb = [
		{ "name": req.body.assessment.name, "url": `${base_url}/assessment/${id}` },
		{ "name": "Course Evaluation", "url": `.` }
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
	]

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


	res.render('assessment/professorInput', locals);
});


/**
 *  GET - Professor Input
 * 	GET - /professor/assessment/:id/professorInput
 */
router.post('/assessment/:assessmentID/professorInput', middleware.validate_assessment, async function (req, res) {

	if (req.body == undefined) {
		req.flash("error", "Cannot find any data to insert");
		return res.redirect("back");
	}

	// if the user press the save and finish later option
	let status = "in_progress";
	if (req.body.save == undefined) {
		status = "completed";
	}
	// Assessment id
	let id = req.params.assessmentID;
	let isUpdate = (req.body.have_data == "y");
	// For breadcrumb
	locals.breadcrumb = [
		{ "name": req.body.assessment.name, "url": `${base_url}/assessment/${id}` },
		{ "name": "Course Evaluation", "url": `.` }
	];

	// keys for grades
	let grades_keys = {
		"A": "n",
		"B": "n",
		"C": "n",
		"D": "n",
		"F": "n",
		"W": "n"
	}

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

	if (isUpdate) {
		// insert data
		queries.update_professor_input(id, req.body, req.body.course).then(async (ok) => {

			await queries.update_status(id, status).catch((err) => {
				console.log("Cannot update the status of the assessment: ", err);
			});
			req.flash("success", "Data was sucessfully Updated!");
			res.redirect(base_url);
		}).catch((err) => {
			console.log("ERROR ADDDING PROFESSOR INPUT: ", err);
			req.flash("error", "There is an error trying to update the data");
			res.redirect("back");
		});
	} else {
		// insert data
		queries.insert_professor_input(id, req.body, req.body.course).then(async (ok) => {

			await queries.update_status(id, status).catch((err) => {
				console.log("Cannot update the status of the assessment: ", err);
			});
			req.flash("success", "Data was sucessfully added!");
			res.redirect(base_url);
		}).catch((err) => {
			console.log("ERROR ADDDING PROFESSOR INPUT: ", err);
			req.flash("error", "There is an error trying to add the data");
			res.redirect("back");
		});
	}

});

<<<<<<< HEAD
=======


/**
 *  UPDATE - UPDATE STATUS OF ASSESSMENT
 * 	GET - /professor/assessment/:id/professorInput
 */
router.put('/assessment/changeStatus/:assessmentID', middleware.validate_assessment, function (req, res) {

	// assessment id
	let id = req.params.assessmentID;

	queries.update_status(id, "in_progress").then((ok)=>{
		req.flash("success", "Assessment now is in progress section!");
		res.redirect("back");
	}).catch((err) => {
		console.log("Cannot update the status of the assessment: ", err);
		req.flash("error", "Cannot move assessment!");
		res.redirect("back");
	});

});

// <------ perfomanceTable GET request ------>

// The ID being sent is the assessment ID
router.get('/:id/perfomanceTable', async function (req, res, next) {
	let perfOrder = [];
	console.log('You are in perfomance table');
	// TODO: validate 
	assessmentID = req.params.id;

	// GET ALL performance criterias
	let perf_criterias = await queries.get_perf_criterias(assessmentID).catch((err) => {
		console.log(err);
	});

	console.log("Perf Crit", perf_criterias);

	//IF found results from the database
	if (perf_criterias == undefined || perf_criterias.length == 0) {
		/* TODO:
			- Add Flash Message
		*/
		console.log('Performance Criteria not found.');
		return res.send("No performancw criterias available");
	}
	for (let i = 0; i < perf_criterias.length; i++) {
		perfOrder[i] = perf_criterias[i].perC_order
	}
	console.log(perfOrder);
	locals.colNums = perf_criterias.length;
	locals.perfCrit = perfOrder;

	res.render('assessment/perfomanceTable', locals);
});

>>>>>>> origin/master
// <------ perfomanceTable Post request ------>

/* TODO: for Noah R. Almeda 
	- Add graphs to report (Done)
	- Comment code
	- Clean code
*/

router.post('/perfomanceTable', async function (req, res) {
	// Input contains an array of objects which are the inputs of the user
	console.log('PerformanceTable POST');
	// input => Array of all the student inputs
	let input = req.body.rowValue;
	let studentScores = [];
	// amountCol => number that represents the amount of columns that the table has. 
	// That number depends on the performance criterias being evaluated
	let amountCol = locals.colNums;

	// Loop creating a multi-dimension array
	for (let i = 0; i < (input.length / 4); i++) {
		studentScores[i] = [];
	}

	let inputCount = 0;

	// Nested for loops that populates the multi-dimension array with the users input. (input => Students Scores)
	for (let i = 0; i < (input.length / 4); i++) {
		for (let j = 0; j < amountCol; j++) {
			studentScores[i][j] = input[inputCount];
			inputCount++;
		}
	}

	// firstRow => array which contains the first row of user inputs
	let firstRow = studentScores[0];
	let size = 0;
	// For loop to count the size of a rows
	for (let s in firstRow) {
		size++;
	}

	let sum = 0;
	let avgRow = [];

	// Nested loops which calculates average per rows
	for (let i = 0; i < studentScores.length; i++) {
		for (let j = 0; j < size; j++) {
			sum += parseFloat(studentScores[i][j]);
		}
		// avgRow => array which contains all the average value per roll
		avgRow[i] = sum / parseFloat(size);
		sum = 0;
	}

	let count = 1;
	let listOfObjects = [];

	// forEach creates a list of Objects
	avgRow.forEach(function (entry) {
		let singleObj = {};
		singleObj['rowID'] = count;
		singleObj['rowIn'] = studentScores[count - 1];
		singleObj['rowAvg'] = entry;
		listOfObjects.push(singleObj);
		count++;
	});

	let threeMorePerc = [];
	let threeMoreCount = 0;
	let avgtreeMoreCount = 0;

	// Nested loop that check student score greater than 3 per column
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < studentScores.length; j++) {
			if (studentScores[j][i] >= 3) {
				threeMoreCount++;
			}
		}
		threeMorePerc[i] = (threeMoreCount / studentScores.length) * 100;
		threeMoreCount = 0;
	}

	// Loop checks if the avg is greater than 3
	for (let i = 0; i < avgRow.length; i++) {
		if (avgRow[i] >= 3) {
			avgtreeMoreCount++;
		}
	}

	let avgPerc = (avgtreeMoreCount / avgRow.length) * 100;
	threeMorePerc[threeMorePerc.length] = avgPerc;

	locals.row = listOfObjects;
	locals.colPerc = threeMorePerc;

	if (size < 5) size = 5;

	// TODO: Noah R. Almeda
	//     - Need to find way to insert null or 0 to Performance Criterias not being evaluated
	for (let i = 0; i < studentScores.length; i++) {
		let studentPerformance = [];
		for (let j = 0; j < size; j++) {
			studentPerformance.push(studentScores[i][j]);

			if (studentPerformance[j] === undefined) {
				studentPerformance[j] = null;
			}
		}
		studentPerformance.push(assessmentID);
		
		/* ----------- This needs to change ------------*/
		
		// let stud_performance_inserted = queries.insertData(studentPerformance);
		// stud_performance_inserted.then((yes) => {
		// 	if (yes)
		// 		console.log('Data was added to STUD_PERFORMANCE table.');
		// }).catch((err) => {
		// 	console.log('Wasn\'t able to add data.');
		// });

		/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
	}

	// pngDataURL => contains a base64 encoding of the graph created
	let pngDataURL = req.body.graph;
	let img = pngDataURL.split(',');

	// Create .png of the graph display on the page
	fs.writeFileSync("graph.png", img[1], 'base64', (err) => {
		console.log(err);
	});

	// Creates the .docx file by calling the createReport()
	docx.Packer.toBuffer(reportTemplate.createReport(locals)).then((buffer) => {
		console.log("Created a doc");
		fs.writeFileSync("Document.docx", buffer);
	});

	// TODO: flash message = Your report was generated
	res.redirect(base_url);
});

module.exports = router;