/* 
	EVALUATION RUBRIC ROUTE
	GET /evaluation
*/
var express = require('express');
var router = express.Router();
var query = require('../helpers/queries/evaluation_queries');
var general_queries = require('../helpers/queries/general_queries');
const { evaluation_rubric_input } = require("../helpers/layout_template/create");
// var queries = require('../helpers/queries');

let base_url = '/evaluation'

//Paramns to routes links
let parms = {
	"base_url": base_url,
	"title": 'ABET Assessment',
	"subtitle": 'Evaluation Rubric',
	"base_url": "/evaluation",
	"url_create": "/evaluation/create"
};

/* 	
	-- SHOW all evaluation -- 
	GET /evaluation
*/
router.get('/', async function(req, res) {

	parms.results = [];
	parms.table_header = ["Name", "Description", "outcome", ""];
	
	//Get all perfCrit from the database (callback)
	let eval_rubric = await general_queries.get_table_info("evaluation_rubric").catch((err) => {
		console.log("Error getting all evaluation rubric: ", err);
	});

	// Validate data
	if (eval_rubric != undefined && eval_rubric.length > 0){
		let results = [];
		
		eval_rubric.forEach(rubric => {			

			results.push({
				"ID": rubric["rubric_ID"],
				"values": [
					rubric["rubric_name"],
					rubric["rubric_description"],
					rubric["outc_ID"],
					"" // position the buttons of remove, and edit
				]
			});
		});
		parms.results = results;
	}
	res.render('layout/home', parms);
});

/*
	-- SHOW EVALUATION --
	GET evaluation/create
*/
router.get('/create', async function(req, res) {
	
	let outcomes = await general_queries.get_table_info("student_outcome").catch((err) => {
		console.log("Error: ", err);
	});

	if (outcomes == undefined || outcomes.length == 0){
		res.flash("error", "Need to create outcome first");
		return res.redirect(base_url);
	}

	// store all profiles
	parms.profiles = [];
	parms.dropdown_options = [];
	parms.have_dropdown = true;
	parms.dropdown_title = "Outcomes";
	parms.dropdown_name = "outcome";
	parms.title_action = "Create Evaluation Rubric";
	parms.url_form_redirect = "/evaluation/create";
	parms.btn_title = "Create";

	// reset value to nothing when creating a new record
	evaluation_rubric_input.forEach((record) =>{
		record.value = "";
	});

	// set the input for user
	parms.inputs = evaluation_rubric_input;

	// for dynamic frontend
	outcomes.forEach( (element) =>{
		parms.dropdown_options.push({
			"ID" : element.outc_ID,
			"NAME": element.outc_name
		});
	});

	res.render('layout/create', parms);
});

/* 
	-- CREATE EVALUATION RUBRIC --
	POST /evaluation/creates
*/
router.post("/create", function(req, res){
	
	// validate req.body
	let rubric = {
		"name": req.body.name,
		"description": req.body.description,
		"outcome_id": req.body.outcome
	}

	// create in db
	query.insert_evaluation_rubric(rubric).then((ok) => {
		req.flash("success", "Evaluation Rubric created");
		res.redirect(base_url);
	}).catch((err) =>{
		req.flash("error", "Cannot create Evaluation Rubric");
		res.redirect(base_url);
	});
});

/* 
	-- SHOW evaluation rubri to edit --
	GET /
*/
router.get('/:id/edit', function(req, res, next) {
	try {

		// sending the outc id to the post method
		parms.id = req.params.id;

		let data = {
			"from": "PERF_CRITERIA",
			"where": "outc_ID",
			"id": req.params.id
		};

		let data2 = {
			"from": "STUDENT_OUTCOME",
			"where": "outc_ID",
			"id": req.params.id
		};

		//Insert all data to the database (callback)
		general_queries.get_table_info_by_id(data, function (err, results) {

			parms.resultsPC = results;

			//TODO: redirect user to another page
			if (err) {
				//HERE HAVE TO REDIRECT the user or send a error message
				throw err;
			}

			general_queries.get_table_info_by_id(data2, function (err, results) {

				parms.current_outName = results[0].outc_name;

				res.render('evaluations/createEvaluation', parms);
				});
		});
	}

	catch (error) {
		//TODO: send a error message to the user.
		console.log(error);
		res.reder('evaluations/createEvaluation', parms);
	}
});


router.post('/create/:id', function(req, res, next) {
	try {

		console.log("Performance Criteria Selected", req.body.perfIDs);
		console.log("req.body", req.params.id);

		let data = [req.body.eval_name, req.body.eval_decription, req.params.id];

		//Insert all data to the database (callback)
		queries.insert_evalRub(data, function (err, results) {

			// TODO: redirect user to another page
			if (err) {
				//HERE HAVE TO REDIRECT the user or send a error message
				throw err;
			}

			let perfIDs = req.body.perfIDs;

			for (var i = 0; i < perfIDs.length; i++){

				let data2 = [results.insertId, perfIDs[i]];

				queries.insert_evalRubPerfCrit(data2, function (err, results) {

					// TODO: redirect user to another page
					if (err) {
						//HERE HAVE TO REDIRECT the user or send a error message
						throw err;
					}
					// console.log(results);
					console.log("Rubric Created");

					});
				}
				res.redirect('/evaluation');
		});
	}
	catch (error) {
		//TODO: send a error message to the user.
		console.log(error);
		res.redirect('/evaluation');
	}
});


/* DELETE home page. */
router.get('/:id/delete', function(req, res, next) {
	try {

		let data = {
			"from": "EVALUATION_RUBRIC",
			"where": "rubric_ID",
			"id": req.params.id
		};

		//Insert all data to the database (callback)
		general_queries.get_table_info_by_id(data, function (err, results) {

			parms.Name = results[0].rubric_name;
			parms.Description = results[0].rubric_description;
			parms.StudentOutcome = results[0].outc_ID;

			//TODO: redirect user to another page
			if (err) {
				//HERE HAVE TO REDIRECT the user or send a error message
				throw err;
			}

			// console.log(results);
			console.log("Rubric Created");
			res.render('evaluations/deleteEvaluation', parms);
		});
	}
	catch (error) {
		//TODO: send a error message to the user.
		console.log(error);
		res.render('evaluations/deleteEvaluation', parms);
	}
});

router.delete('/:id/delete', function(req, res, next) {
	try {

		let data = {
			"from": "EVALUATION_RUBRIC",
			"where": "rubric_ID",
			"id": req.params.id
		};

		//Insert all data to the database (callback)
		general_queries.delete_record_by_id(data, function (err, results) {

			//TODO: redirect user to another page
			if (err) {
				//HERE HAVE TO REDIRECT the user or send a error message
				throw err;
			}

			// console.log(results);
			console.log("Rubric Created");
			res.redirect('/evaluation');
		});
	}
	catch (error) {
		//TODO: send a error message to the user.
		console.log(error);
		res.redirect('/evaluation');
	}
});


/* EDIT home page. */
router.get('/:id/edit', function(req, res, next) {
	try {

		let data = {
			"from": "EVALUATION_RUBRIC",
			"where": "rubric_ID",
			"id": req.params.id
		};

		//Insert all data to the database (callback)
		general_queries.get_table_info_by_id(data, function (err, results) {

			parms.rubric_name = results[0].rubric_name;
			parms.rubric_description = results[0].rubric_description;
			parms.current_outID = results[0].outc_ID;

			let data = "STUDENT_OUTCOME";

			general_queries.get_table_info(data, function (err, results) {

				parms.outc_ID = results;

				if (err) {
					//HERE HAVE TO REDIRECT the user or send a error message
					throw err;
				}

				// let data = {
				//   "from": "STUDENT_OUTCOME",
				//   "where": "outc_ID",
				//   "id": parms.current_outID
				// };
				//
				// general_queries.get_table_info_by_id(data, function (err, results) {
				//
				//     console.log("HERE", data, results);
				//     parms.current_outName = results[0].outc_name;

					res.render('evaluations/editEvaluation', parms);
				// });
			});
		});
	}
	catch (error) {
		//TODO: send a error message to the user.
		console.log(error);
		res.render('evaluations/editEvaluation', parms);
	}
});

router.put('/:id/edit', function(req, res, next) {
	try {

		let newInfo = [req.body.rubric_name, req.body.rubric_description,
									req.body.outc_ID, req.params.id];

		//Insert all data to the database (callback)
		queries.update_evalRub(newInfo, function (err, results) {

			//TODO: redirect user to another page
			if (err) {
				//HERE HAVE TO REDIRECT the user or send a error message
				throw err;
			}

			// console.log(results);
			console.log("Rubric Updated");
			res.redirect('/evaluation');
		});
	}
	catch (error) {
		//TODO: send a error message to the user.
		console.log(error);
		res.redirect('/evaluation');
	}
});

module.exports = router;
