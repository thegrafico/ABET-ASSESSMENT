var express = require('express');
var router = express.Router();
var general_queries = require('../../helpers/queries/general_queries');
var chooseCourseTermQuery = require('../../helpers/queries/chooseCourseTermQueries');
var pInput_queries = require('../../helpers/queries/pInput_queries');
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
	title: 'ABET Assessment'
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

	// Change the date of all assessment
	assessments.map(row => {
		row.creation_date = `${row.creation_date.getMonth() + 1}/${row.creation_date.getDate()}/${row.creation_date.getFullYear()}`;
	});

	// assign value of table info
	locals.departments = departments || [];
	locals.academic_term = academic_term || [];
	locals.assessments = assessments || [];

	// console.log(assessments);

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
	// TODO: VERIFY IF EXITS
*/
router.get('/assessment/:assessmentID/performanceTable', middleware.validate_assessment ,async function (req, res) {

	locals.id = req.params.assessmentID; 
	locals.homeURL = base_url;
	locals.breadcrumb = [
		{ "name": req.body.assessment.name, "url": "." }
	];
	

	// GET ALL performance criterias
	let perf_criterias = await queries.get_perf_criterias(locals.id).catch((err) => {
		console.log("Error: ", err);
	});
	console.log("Perf_Cirterias Results: ", perf_criterias);

	locals.colNums = perf_criterias.length;
	locals.perfCrit = perf_criterias.map(e => e.perC_order);
	locals.outc_name = perf_criterias[0].outc_name;

	// // the user id is stored in session, thats why user need to be login
	// let user_id = req.session.user_id;

	// // Get all departments
	// let departments = await queries.get_department_by_user_id(user_id).catch((err) => {
	// 	console.error("Error getting department: ", err);
	// });

	// // Getting the term
	// let academic_term = await general_queries.get_table_info("ACADEMIC_TERM").catch((err) => {
	// 	console.error("Error getting academic term: ", err);
	// });

	// let assessments = await assessment_query.get_assessment_by_user_id(user_id).catch((err) => {
	// 	console.error("Error getting user assessment: ", err);
	// });

	// // Change the date of all assessment
	// assessments.map(row => {
	// 	row.creation_date = `${row.creation_date.getMonth() + 1}/${row.creation_date.getDate()}/${row.creation_date.getFullYear()}`;
	// });

	// // assign value of table info
	// locals.departments = departments || [];
	// locals.academic_term = academic_term || [];
	// locals.assessments = assessments || [];

	// console.log(assessments);

	res.render('assessment/perfomanceTable', locals);
});

router.post('/assessment/insertData', function(req, res) {
	let data = req.body.data;
	console.log("DATA: ", data);
});


/* 
	- UPDATE AN ASSESSMENT - 
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
	TODO: Delete only if the assessment belong to the user
*/
router.delete('/assessment/:assessmentID', async function (req, res) {

	if (req.params.assessmentID == undefined || isNaN(req.params.assessmentID)) {
		req.flash("error", "Cannot find the assessment");
		return res.redirect("back");
	}

	// getting the user id
	let user_id = req.session.user_id;
	let assessment_id = req.params.assessmentID;

	assessment_query.remove_assessment_by_id(user_id, assessment_id).then((ok) => {
		req.flash("success", "Assessment Removed!");
		res.redirect("back");
	}).catch((err) => {
		console.log("ERROR: ", err);

		req.flash("error", "Cannot remove the assessment");

		res.redirect("back");
	});

});

/**
 *  GET - Professor Input
 * 	GET - /professor/assessment/:id/professorInput
 */
router.get('/assessment/:assessmentID/professorInput', async function (req, res) {
	res.render('assessment/professorInput', { title: 'ABET Assessment' });
});

// <------ Professor Input POST request ------>
router.post('/assessment/:id/professorInput', function (req, res, next) {
	let data = [
		req.body.A, req.body.B, req.body.C, req.body.D, req.body.F,
		req.body.UW, req.body.rCourse, req.body.cReflection, req.body.cImprovement, null
	];
	// Console log to show professor input data.
	console.log("Professor Input: ", data);

	pInput_queries.insert_into_report(data, function (err, results) {
		// TODO: catch error properly
		if (err) throw err;
		// res.redirect('/assessment/' + req.params.id + '/professorInput');
	});
	res.redirect('/assessment/' + req.params.id + '/perfomanceTable');
});

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