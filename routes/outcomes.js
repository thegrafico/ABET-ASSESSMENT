/**
 * RAUL PICHARDO ROUTE
 */

var express = require('express');
var router = express.Router();
var query = require("../helpers/queries/outcomes_queries");
var general_queries = require("../helpers/queries/general_queries");
const { outcome_create_inputs } = require("../helpers/layout_template/create");

const base_url = '/outcomes';

//Paramns to routes links
let parms = {
	"title": "ABET Assessment",
	"subtitle": "Outcomes",
	"base_url": base_url,
	"url_create": "/outcomes/create"
};

/* 
	GET home page. 
*/
router.get('/', async function (req, res) {

	parms.results = [];

	//Getting all the entries for the dropdown
	let stud_outcomes = await general_queries.get_table_info("student_outcome").catch((err) => {
		console.log("Error getting the outcomes information: ", err);
	});

	parms.table_header = ["Name", "Description", "Study Program", "Date", ""];

	console.log(stud_outcomes);
	
	if (stud_outcomes != undefined && stud_outcomes.length > 0){
		let results = [];
		stud_outcomes.forEach(outcome => {			

			// change date format 
			let date = new Date(outcome.date_created);
			date = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`;
			
			results.push({
				"ID": outcome["outc_ID"],
				"values": [
					outcome["outc_name"],
					outcome["outc_description"],
					outcome["prog_ID"],
					date,
					"" // position the buttons of remove, and edit
				]
			});
		});
		parms.results = results;
	}
	res.render('layout/home', parms);
});


/* 
	-- SHOW CREATE OUTCOMES --
	GET /outcomes/create  
*/
router.get('/create', async function (req, res) {

	// store all profiles
	parms.profiles = [];
	parms.dropdown_options = [];
	parms.have_dropdown = true;
	parms.dropdown_title = "Study Program";
	parms.dropdown_name = "std_program";
	parms.title_action = "Create Outcome";

	let study_programs = await general_queries.get_table_info("STUDY_PROGRAM").catch((err) => {
		console.log("ERROR: ", err);
	});

	// validate
	if (study_programs != undefined && study_programs.length > 0){
		console.log("");
	}

	// reset value to nothing when creating a new record
	outcome_create_inputs.forEach((record) =>{
		record.value = "";
	});

	parms.results = results;
	// console.log(parms);
	res.render('outcomes/createOutcomes', parms);
});
/*
	-- CREATE NEW OUTCOMES-- 
	POST HOME page 
*/
router.post('/', function(req, res, next) {

	let studyProgram_table = 'STUDY_PROGRAM';
	//Get all perfCrit from the database (callback)
	general_queries.get_table_info(studyProgram_table, function (err, results) {

		//TODO: redirect user to another page
		if (err) {
			//HERE HAS TO REDIRECT the user or send a error message
			throw err;
		}

		//IF found results from the database
		if (results) {
			// console.log(results)
			parms.resultsDD = results;

			let data = {
				"from": "STUDENT_OUTCOME",
				"where": "prog_ID",
				"id": req.body.prog_ID
			};

			general_queries.get_table_info_by_id(data, function (err, results) {

				console.log(data);
				console.log("RESULTS",results);
				parms.results = results;

				parms.current_progID = req.body.prog_ID;

				let data2 = {
					"from" : "STUDY_PROGRAM",
					"where": "prog_ID",
					"id"   : parms.current_progID
				};

				console.log(data);

				general_queries.get_table_info_by_id(data2, function (err, results) {

					parms.current_progName = results[0].prog_name;
					console.log(parms.current_progName);

					res.render('outcomes/outcomes', parms);
				});
			});
		}
	});

});

// =========================================== CREATE OUTCOME =====================================

/* POST */
router.post('/create', function (req, res, next) {
	// outc_ID, outc_name, outc_description, date_created, prog_ID
	console.log("CREATING AN OUTCOME");

	//TODO: Validate the data
	let data = [req.body.data.name, req.body.data.desc, req.body.data.std_prg];

	query.insert_outcome(data, function (err, results) {

		console.log("OUTCOME CREATED");
		res.redirect(base_url);
	});
});

// =========================================== DELETE OUTCOME =====================================
/* GET */
router.get('/:id/delete', function (req, res, next) {
	//TODO: verify id
	let data = {
		"from": "STUDENT_OUTCOME",
		"where": "outc_ID",
		"id": req.params.id
	};
	general_queries.get_table_info_by_id(data, function(err, results){
		//TODO: catch error
		if (err) throw err;

		//TODO: VERIFY IS EMPTY
		parms.results = results[0];

		res.render('outcomes/deleteOutcomes', parms);
	});
});
/* DELETE */
router.delete('/:id', function (req, res, next) {

	//TODO: validate
	let data = {
		"from": "STUDENT_OUTCOME",
		"where": "outc_ID",
		"id": req.params.id
	};
	general_queries.delete_record_by_id(data, function(err, results){
		//TODO: catch error
		if (err) throw err;

		//TODO: verify resutls
		// console.log("UPDATED: ", results);

		res.redirect(base_url);
	});
});

// =========================================== EDIT OUTCOME =====================================
/* EDIT home page. */
router.get('/:id/edit', function (req, res, next) {

	//TODO: validate variables
	let data = {
		"from": "STUDENT_OUTCOME",
		"where": "outc_ID",
		"id": req.params.id
	};
	general_queries.get_table_info_by_id(data, function (err, outcome_results) {
		//TODO: catch this error
		if (err) throw err;

		let table = "STUDY_PROGRAM";

		parms.results = outcome_results[0];
		parms.current_progID = outcome_results[0].prog_ID;

		general_queries.get_table_info(table, function (err, results) {
			//TODO: catch error
			if (err) throw err;

			//outcome data
			parms.std_prog = results;

			let data = {
				"from": "STUDY_PROGRAM",
				"where": "prog_ID",
				"id": parms.current_progID
			};

			general_queries.get_table_info_by_id(data, function (err, results) {

				console.log("HERE", data, results);
				parms.current_progName = results[0].prog_name;

				console.log(parms);
				res.render('outcomes/editOutcomes', parms);
			});
		});
	});
});
/* PUT */
router.put('/:id', function (req, res, next) {

	//TODO: validate variables
	let out_id = req.params.id;
	let data = [req.body.data.name, req.body.data.desc, req.body.data.std_prg, out_id];

	console.log(data);
	// console.log(req.body);
	query.update_outcome(data, function (err, results) {
		//TODO: catch error
		if (err) throw err;

		console.log("EDITED OUTCOME");
		res.redirect(base_url);
	});
});

// ============================DETAILS OUTCOME=======================
/* DETAILS home page. */
router.get('/details', function (req, res, next) {
	res.render('outcomes/detailOutcomes', parms);
});

module.exports = router;
