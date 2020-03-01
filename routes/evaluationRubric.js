/* 
	EVALUATION RUBRIC ROUTE
	GET /evaluation
*/
var express = require('express');
var router = express.Router();
var rubric_query = require('../helpers/queries/evaluation_queries');
var general_queries = require('../helpers/queries/general_queries');
var { get_outcome_by_study_program } = require("../helpers/queries/outcomes_queries");
var roolback_queries = require("../helpers/queries/roolback_queries");
const { evaluation_rubric_input } = require("../helpers/layout_template/create");
var { validate_outcome, validate_evaluation_rubric } = require("../middleware/validate_outcome");
var { split_and_filter } = require("../helpers/validation");


const base_url = "/evaluation";
//Paramns to routes links
let locals = {
	"title": 'ABET Assessment',
	"subtitle": 'Evaluation Rubric',
	"base_url": base_url,
	"form_id": "rubric_data",
	"api_get_url": "/evaluation",
	delete_redirect: null
};


/*	
	-- Administrate OUTCOME Evaluation rubric -- 
	GET /outcomes/:id/evaluationrubric 
*/
router.get('/', async function (req, res) {

	// getting evaluation rubric from db
	let eval_rubric = await rubric_query.get_all_evaluations_rubric().catch((err) => {
		console.log("Error getting all evaluation rubric: ", err);
	});

	// getting all study programs
	let study_programs = await general_queries.get_table_info("study_program").catch((err) => {
		console.error("Error getting study programs: ", err);
	});

	locals.study_programs = study_programs || [];

	// getting all outcomes
	let outcomes = await general_queries.get_table_info("student_outcome").catch((err) => {
		console.error("Error getting outcomes: ", err);
	});

	locals.outcomes = outcomes || [];

	locals.results = [];
	locals.table_header = ["Name", "Description", "Study program", "Outcome", ""];

	// Validate data
	if (eval_rubric != undefined && eval_rubric.length > 0) {
		let results = [];

		eval_rubric.forEach(rubric => {

			results.push({
				"ID": rubric["rubric_ID"],
				"values": [
					rubric["rubric_name"],
					rubric["rubric_description"],
					rubric["prog_name"],
					rubric["outc_name"],
					"" // position the buttons of remove, and edit
				]
			});
		});
		locals.results = results;
	}
	res.render('rubric/home', locals);
});
/*
	-- SHOW EVALUATION --
	GET evaluation/create
*/
router.get('/create', async function (req, res) {

	let std_programs = await general_queries.get_table_info("study_program").catch((err) => {
		console.error("Error getting std_programs", err);
	});

	if (std_programs == undefined || std_programs.length == 0) {
		req.flash("error", "Cannot find any Study Program, Please create one");
		return res.redirect(base_url);
	}

	locals.std_options = [];
	locals.url_form_redirect = `/evaluation/create`;
	locals.btn_title = "Create";

	// reset value to nothing when creating a new record
	evaluation_rubric_input.forEach((record) => {
		record.value = "";
	});

	// set the input for user
	locals.inputs = evaluation_rubric_input;

	std_programs.forEach((element) => {
		locals.std_options.push({
			"ID": element.prog_ID,
			"NAME": element.prog_name
		});
	});

	res.render('rubric/create', locals);
});

/* 
	-- CREATE EVALUATION RUBRIC --
	POST /evaluation/creates
*/
router.post("/create", function (req, res) {

	if (req.body == undefined || !req.body.name || isNaN(req.body.outcome)) {
		req.flash("error", "Please insert the correct values");
		return res.redirect("back");
	}

	if (req.body.performances_id == undefined || req.body.performances_id == "") {
		req.flash("error", "Performance cannot be empty");
		return res.redirect("back");
	}
	let performances_selected = split_and_filter(req.body.performances_id, ",");

	// validate req.body
	let rubric = {
		"name": req.body.name,
		"description": req.body.description,
		"outcome_id": req.body.outcome,
		"performance": performances_selected
	}

	// create in db
	roolback_queries.create_evaluation_rubric(rubric).then((ok) => {
		req.flash("success", "Evaluation Rubric created");
		res.redirect(base_url);
	}).catch((err) => {
		console.error("ERROR: ", err);
		req.flash("error", "Cannot create Evaluation Rubric");
		res.redirect(base_url);
	});
});

/* 
	-- SHOW evaluation rubri to edit --
	GET /evaluation/:id/edit
*/
router.get('/:r_id/edit', validate_evaluation_rubric, async function (req, res) {

	let std_programs = await general_queries.get_table_info("study_program").catch((err) => {
		console.error("Error getting std_programs", err);
	});

	if (std_programs == undefined || std_programs.length == 0) {
		req.flash("error", "Cannot find any Study Program, Please create one");
		return res.redirect(base_url);
	}

	let rubric = await rubric_query.get_evaluation_rubric_by_id(req.params.r_id).catch((err) => {
		console.error("Error getting the rubric: ", err);
	});

	if (rubric == undefined) {
		req.flash("error", "Cannot find the Evaluation Rubric");
		return res.redirect(base_url);
	}

	// All Performance Criteria Selected
	locals.criterias_selected = rubric.perC_ID;
	// The study Program selected
	locals.study_program_id = rubric.prog_ID;
	// the outcome selected
	locals.outcome_selected = rubric.outc_ID;

	let outcomes = await get_outcome_by_study_program(locals.study_program_id).catch((err) => {
		console.error("Error getting: ", err);
	});

	if (outcomes == undefined || outcomes.length == 0) {
		req.flash("error", "Cannot find any outcomes, Please create one");
		return res.redirect(base_url);
	}
	let criteria_query = { "from": "perf_criteria", "where": "outc_ID", "id": locals.outcome_selected };

	let performance_criteria = await general_queries.get_table_info_by_id(criteria_query).catch((err) => {
		console.error("ERROR getting performance Criteria: ", err);
	});

	locals.criteria = [];
	if (performance_criteria != undefined && performance_criteria.length > 0) {
		performance_criteria.forEach(element => {
			locals.criteria.push({ label: element.perC_Desk, value: element.perC_ID.toString() })
		});
	}

	locals.std_options = [];
	locals.outcomes = [];
	locals.url_form_redirect = `/evaluation/${req.params.r_id}?_method=PUT`;
	locals.btn_title = "Edit";

	std_programs.forEach((element) => {
		locals.std_options.push({
			"ID": element.prog_ID,
			"NAME": element.prog_name
		});
	});

	outcomes.forEach((element) => {
		locals.outcomes.push({
			"ID": element.outc_ID,
			"NAME": element.outc_name
		});
	});

	// // set the data user for edit
	temp_r = [
		rubric.rubric_name,
		rubric.rubric_description,
	]

	let index = 0;
	evaluation_rubric_input.forEach((record) => {
		record.value = temp_r[index];
		index++;
	});

	// set the input for user
	locals.inputs = evaluation_rubric_input;
	res.render('rubric/edit', locals);
});

/* 
	-- EDIT Evaluation rubric -- 
	PUT /evaluation/:id
*/
router.put('/:r_id', validate_evaluation_rubric, function (req, res) {

	// validate id
	let evaluation_id = req.params.r_id;

	console.log(req.body);
	res.redirect("back")
	// let evaluation_data = {
	// 	"name": req.body.name,
	// 	"description": req.body.description,
	// 	"rubric_id": evaluation_id
	// }

	// let base_url = `/outcomes/${req.params.id}/evaluationrubric`;

	// rubric_query.update_evaluation_rubric(evaluation_data).then((ok) => {
	// 	req.flash("success", "Evaluation Rubric edited");
	// 	res.redirect(base_url);
	// }).catch((err) => {
	// 	console.log("Error: ", err);
	// 	req.flash("error", "Cannot edit the Evaluation Rubric");
	// 	res.redirect(base_url);
	// });
});

/* 
	-- SHOW DELETE EVAluation rubric --
	GET /evaluation/:id/delete 
*/
router.get('/get/:r_id', validate_evaluation_rubric, async function (req, res) {

	rubric_to_remove = req.body["rubric"][0];

	let names = ["Name", "Description"];
	let values = [
		rubric_to_remove.rubric_name,
		rubric_to_remove.rubric_description,
	];

	let record = [];
	for (let index = 0; index < names.length; index++) {
		record.push({ "name": names[index], "value": values[index] })
	}
	res.json(record);
});

/* 
	-- DELETE evaluation rubric -- 
	DELETE /evaluation/:id
*/
router.delete('/:r_id', validate_evaluation_rubric, function (req, res) {

	let rubric_id = req.params.r_id;
	let rubric_for_query = { "from": "evaluation_rubric", "where": "rubric_ID", "id": rubric_id };

	general_queries.delete_record_by_id(rubric_for_query).then((ok) => {
		req.flash("success", "Rubric removed");
		res.redirect(base_url);
	}).catch((err) => {
		console.log("Error: ", err);
		req.flash("error", "Cannot removed Rubric");
		res.redirect(base_url);
	});
});

module.exports = router;
