var express = require('express');
var router = express.Router();
var outcome_query = require("../helpers/queries/outcomes_queries");
var general_queries = require("../helpers/queries/general_queries");
const { outcome_create_inputs } = require("../helpers/layout_template/create");
var { validate_form } = require("../helpers/validation");
const table = require("../helpers/DatabaseTables");
var moment = require("moment");

const base_url = '/admin/outcomes';

//Paramns to routes links
let locals = {
	"title": "ABET Assessment",
	"subtitle": "Outcomes",
	"base_url": base_url,
	"url_create": `${base_url}/create`,
	"form_id": "outcome_data",
	"api_get_url": "/api/get/outcome", // missing id
	delete_redirect: null,
	dropdown_option_selected: null,
	feedback_message: "Number of Outcomes: ",

};

/* 
	GET home page. 
*/
router.get('/', async function (req, res) {

	locals.breadcrumb = [
		{ "name": "Outcomes", "url": base_url },
	];

	locals.results = [];
	locals.title = "Outcomes";
	locals.css_table = "outcomes.css";


	//Getting all the entries for the dropdown
	let stud_outcomes = await outcome_query.get_outcomes_with_study_program().catch((err) => {
		console.log("Error getting the outcomes information: ", err);
	});

	// getting departments for filter
	let departments = await general_queries.get_table_info(table.department).catch((err) => {
		console.error("THERE IS AN ERROR GETTING DEPARTMENTS: ", err);
	});

	// get all evaluation rubric
	let evaluation_rubric = await general_queries.get_table_info(table.performance_criteria).catch((err) => {
		console.error("ERROR GETTING EVALUATION RUBRIC: ", err);
	});

	// Evaluating rubric
	let outcome_ids_by_rubric = undefined;
	if (evaluation_rubric != undefined && evaluation_rubric.length > 0) {
		outcome_ids_by_rubric = evaluation_rubric.map(outc => parseInt(outc["outc_ID"]));
	}

	locals.departments = [];
	if (departments != undefined && departments.length > 0) {
		departments.forEach(e => {
			locals.departments.push({ "name": e.dep_name, "value": e.dep_ID });
		});
	}

	locals.table_header = ["Name", "Study Program", "Description", "Creation date", "Performance Criteria", ""];

	if (stud_outcomes != undefined && stud_outcomes.length > 0) {
		let results = [];
		
		stud_outcomes.forEach(outcome => {
			let hasPerformance = false;

			if (outcome_ids_by_rubric != undefined) {
				if (outcome_ids_by_rubric.includes(parseInt(outcome["outc_ID"]))) {
					hasPerformance = true;
				}
			}

			let date = moment(outcome.date_created).format('MMMM Do YYYY');

			results.push({
				"ID": outcome["outc_ID"],
				hasPerformance,
				"values": [
					outcome["outc_name"],
					outcome["prog_name"],
					outcome["outc_description"],
					date,
					"",
					""
				]
			});
		});
		locals.results = results;
	}
	res.render('admin/outcome/home', locals);
});

/* 
	-- SHOW CREATE OUTCOMES --
	GET /outcomes/create  
*/
router.get('/create', async function (req, res) {


	locals.breadcrumb = [
		{ "name": "Outcomes", "url": base_url },
		{ "name": "Create", "url": locals.url_create }
	];

	locals.title = "Create Outcome";

	// store all profiles
	locals.profiles = [];
	locals.dropdown_options = [];
	locals.have_dropdown = true;
	locals.dropdown_title = "Study Program";
	locals.dropdown_name = "std_program";
	locals.title_action = "Create Outcome";
	locals.url_form_redirect = `${base_url}/create`;
	locals.btn_title = "Create";

	let study_programs = await general_queries.get_table_info("STUDY_PROGRAM").catch((err) => {
		console.log("ERROR: ", err);
	});

	// validate
	if (study_programs == undefined || study_programs.length == 0) {
		console.log("Need to create a study program to work with outcomes");
		req.flash("error", "Cannot find any Study program, Need to create one");
		return res.redirect("back");
	}

	// reset value to nothing when creating a new record
	outcome_create_inputs.forEach((record) => {
		record.value = "";
	});

	locals.inputs = outcome_create_inputs;
	locals.description_box = { name: "outcome_description", text: "Outcome Description", value: "" };


	// for dynamic frontend
	study_programs.forEach((element) => {
		locals.dropdown_options.push({
			"ID": element.prog_ID,
			"NAME": element.prog_name
		});
	});

	res.render('layout/create', locals);
});
/*
	-- CREATE NEW OUTCOMES-- 
	POST /outcomes/create 
*/
router.post('/create', function (req, res) {

	// validate body
	if (req.body == undefined) {
		req.flash("error", "Cannot find outcome data");
		return res.redirect(base_url);
	}

	// to validation - expected values
	let key_types = {
		"outcome_name": 's',
		"outcome_description": 's',
		"std_program": 'n'
	}

	// if the values don't mach the type 
	if (!validate_form(req.body, key_types)) {
		console.log("Error in validation");
		req.flash("error", "Error in the inserted data");
		return res.redirect(base_url);
	}

	// for query
	const outcome_data_for_query = {
		"outcome_name": req.body.outcome_name,
		"outcome_description": req.body.outcome_description,
		"program_id": req.body.std_program
	};

	outcome_query.insert_outcome(outcome_data_for_query).then(() => {
		req.flash("success", "Outcome Created");
		res.redirect(base_url);
	}).catch((err) => {
		console.log(err);
		
		if (err.code == "ER_DUP_ENTRY")
			req.flash("error", "Duplicate Outcome");
		else
			req.flash("error", "Cannot Create the outcome");

		res.redirect(base_url);
	});
});


/* 
	-- SHOW outcome to edit --
	GET /outcomes/:id/edit 
*/
router.get('/:id/edit', async function (req, res) {

	if (req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "Cannot find the outcome");
		return res.redirect(base_url);
	}

	locals.title = "Edit Outcome";

	locals.breadcrumb = [
		{ "name": "Outcomes", "url": base_url },
		{ "name": "Edit", "url": "." }
	];

	let out_id = req.params.id;

	// store all profiles
	locals.profiles = [];
	locals.dropdown_options = [];
	locals.have_dropdown = true;
	locals.dropdown_title = "Study Program";
	locals.dropdown_name = "std_program";
	locals.title_action = "Edit Outcome";
	locals.url_form_redirect = `${base_url}/${out_id}?_method=PUT`;
	locals.btn_title = "Edit";

	// data to find the outcome
	let data = {
		"from": "STUDENT_OUTCOME",
		"where": "outc_ID",
		"id": out_id
	};

	//get the putcome
	let outcome_to_edit = await general_queries.get_table_info_by_id(data).catch((err) => {
		console.log("Error getting the outcome: ", err);
	});

	if (outcome_to_edit == undefined || outcome_to_edit.length == 0) {
		console.log("Cannot find the outcome");
		req.flash("error", "Cannot find the outcome");
		return res.redirect(base_url);
	}
	outcome_to_edit = outcome_to_edit[0];

	// get study program
	let study_programs = await general_queries.get_table_info("STUDY_PROGRAM").catch((err) => {
		console.log("ERROR: ", err);
	});

	// validate study programs
	if (study_programs == undefined || study_programs.length == 0) {
		console.log("Cannot find any study program");
		req.flash("error", "Cannot find any Study Program")
		return res.redirect(base_url);
	}

	// to add the oucome information into the frontend
	let outcome = [
		outcome_to_edit.outc_name,
	]

	let index = 0;
	outcome_create_inputs.forEach((record) => {
		record.value = outcome[index];
		index++;
	});

	// set the value of the outcome
	locals.inputs = outcome_create_inputs;
	locals.description_box = { name: "outcome_description", text: "Outcome Description", value: outcome_to_edit.outc_description };


	// for dynamic frontend
	study_programs.forEach((element) => {
		locals.dropdown_options.push({
			"ID": element.prog_ID,
			"NAME": element.prog_name
		});
	});

	locals.dropdown_option_selected = outcome_to_edit.prog_ID;
	res.render('layout/create', locals);
});
/* 
	-- Update the outcome -- 
	PUT /outcome/:id
*/
router.put('/:id', function (req, res) {

	// validate body
	if (req.body == undefined || req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "Outcome don't exits");
		return res.redirect(base_url);
	}

	// to validation - expected values
	let key_types = {
		"outcome_name": 's',
		"outcome_description": 's',
		"std_program": 'n'
	}

	// if the values don't mach the type 
	if (!validate_form(req.body, key_types)) {
		console.log("Error in validation");
		req.flash("error", "Error in the information of the outcome");
		return res.redirect(base_url);
	}

	let data = {
		"outc_name": req.body.outcome_name,
		"outc_description": req.body.outcome_description,
		"outc_ID": req.params.id,
		"prog_ID": req.body.std_program
	};

	outcome_query.update_outcome(data).then((ok) => {
		console.log("EDITED OUTCOME");
		req.flash("success", "Outcome edited");
		res.redirect(base_url);
	}).catch((err) => {

		console.log("Error editing the outcome: ", err);
		if (err.code == "ER_DUP_ENTRY")
			req.flash("error", "Duplicate Outcome");
		else
			req.flash("error", "Cannot edit the outcome");
		res.redirect(base_url);
	});
});


/*	
	-- REMOVE THE OUTCOME -- 
	DELETE /outcomes/:id 
*/
router.delete('/:id', function (req, res, next) {

	if (req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "Cannot find the outcome");
		return res.redirect(base_url);
	}

	let out_id = req.params.id;

	// Data to remove outcome
	let data = {
		"from": "STUDENT_OUTCOME",
		"where": "outc_ID",
		"id": out_id
	};

	general_queries.delete_record_by_id(data).then((ok) => {
		req.flash("success", "Outcome removed");
		res.redirect(base_url);
	}).catch((err) => {
		consolelog("ERROR REMOVING THE OUTCOME: ", err);
		req.flash("error", "Cannot remove this outcome");
		res.redirect(base_url);
	});
});

module.exports = router;
