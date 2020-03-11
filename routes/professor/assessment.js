var express = require('express');
var router = express.Router();
var general_queries = require('../../helpers/queries/general_queries');
var chooseCourseTermQuery = require('../../helpers/queries/chooseCourseTermQueries');
var pInput_queries = require('../../helpers/queries/pInput_queries');
var queries = require('../../helpers/queries/perfTable_queries');
var reportTemplate = require('../../helpers/reportTemplate');
var assessment_query = require("../../helpers/queries/assessment.js");
var { validate_form } = require("../../helpers/validation");

var docx = require('docx');
var fs = require('fs');

/* GLOBAL LOCALS */
const base_url = '/assessment/chooseCourseTerm';
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
router.get('/assessment/:assessmentID/performanceTable', async function (req, res) {

	// Validate ID
	if (req.params.assessmentID == undefined || isNaN(req.params.assessmentID)) {
		req.flash("error", "Invalid Assessment");
		return res.redirect("back");
	}

	// GET ALL performance criterias
	let perf_criterias = await queries.get_perf_criterias(req.params.id).catch((err) => {
		console.log("Error: ", err);
	});
	console.log("Perf_Cirterias Results: ", perf_criterias);

	locals.colNums = perf_criterias.length;
	locals.perfCrit = perf_criterias.map(e => e.perC_order); 

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


/* 
	- UPDATE AN ASSESSMENT - 
*/
router.put('/assessment/:id', function (req, res) {

	if (req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "Cannot find the assessment");
		return res.redirect("back");
	}
	// getting the user id
	let user_id = req.session.user_id;
	let assessment_id = req.params.id;

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
router.delete('/assessment/:id', async function (req, res) {

	if (req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "Cannot find the assessment");
		return res.redirect("back");
	}

	// getting the user id
	let user_id = req.session.user_id;
	let assessment_id = req.params.id;

	assessment_query.remove_assessment_by_id(user_id, assessment_id).then((ok) => {
		req.flash("success", "Assessment Removed!");
		res.redirect("back");
	}).catch((err) => {
		console.log("ERROR: ", err);

		req.flash("error", "Cannot remove the assessment");

		res.redirect("back");
	});

});

/* 
	GET assessment/chooseCourseTerm/:id
*/

router.get('/:id/chooseCourseTerm', async function (req, res) {

	// TODO: Validate prog_id 
	let prog_id = req.params.id;
	console.log("ID: ", prog_id);

	let study_program = await general_queries.get_table_info("STUDY_PROGRAM").catch((err) => {
		// TODO: flash message with error
		console.log("Error getting study program");
	});

	if (study_program == undefined || study_program.length == 0) {
		console.log("Study program is empty");
		// TODO: Flash message
		return res.redirect("/");
	}

	// WHAT THE FUCK IS 'o'
	let index = study_program.indexOf(study_program.find(o => o.prog_ID == prog_id));

	// why index != 0
	if (index != 0 && index != -1) {
		let temp = study_program[index];
		study_program[index] = study_program[0];
		study_program[0] = temp;
	}

	let academic_term = await general_queries.get_table_info("ACADEMIC_TERM").catch((err) => {
		console.log("Error getting the Academic term: ", err);
	});

	let rubric_info = await chooseCourseTermQuery.get_rubric_info(prog_id).catch((err) => {
		console.log("Error getting the rubric info: ", err);
	});

	let course_info = await chooseCourseTermQuery.get_course_info(prog_id).catch((err) => {
		console.log("Error getting course info: ", err);
	});

	locals.program = study_program;
	locals.term = academic_term;
	locals.rubric = rubric_info;
	locals.course = course_info;

	console.log("Get Locals: ", locals);

	res.render('assessment/chooseCourseTerm', locals);
});

/* 
	POST assessment/chooseCourseTerm
*/
router.post('/chooseCourseTerm', async function (req, res) {

	let sess = req.session;

	if (sess == undefined || sess.user_id == undefined) {
		return res.status(200).send("Need to login");
	}

	// TODO: Validate -- splits the URL for the prog_ID and saves it
	req.body.prog_ID = req.body.prog_ID.split("/")[req.body.prog_ID.split("/").length - 1];

	// the 1 needs to be replaced with a real user id
	let data = [req.body.course_ID, req.body.term_ID, sess.user_id, req.body.rubric_ID]

	let assessment_was_added = chooseCourseTermQuery.insert_assessment(data);

	assessment_was_added.then((id) => {
		res.redirect('/assessment/' + id + '/professorInput');
	}).catch((reason) => {
		console.log("Cannot add assessment: ", reason);
		res.redirect(base_url);
	});
});

// <------ Professor Input GET request ------>

router.get('/:id/professorInput', function (req, res, next) {
	res.render('assessment/professorInput', { title: 'ABET Assessment' });
});


// <------ Professor Input POST request ------>

router.post('/:id/professorInput', function (req, res, next) {
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
		let stud_performance_inserted = queries.insertData(studentPerformance);
		stud_performance_inserted.then((yes) => {
			if (yes)
				console.log('Data was added to STUD_PERFORMANCE table.');
		}).catch((err) => {
			console.log('Wasn\'t able to add data.');
		});
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