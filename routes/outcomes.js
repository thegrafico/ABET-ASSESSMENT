var express = require('express');
var router = express.Router();
var outcome_query = require("../helpers/queries/outcomes_queries");
var general_queries = require("../helpers/queries/general_queries");
const { outcome_create_inputs } = require("../helpers/layout_template/create");
var { validate_form } = require("../helpers/validation");


const base_url = '/admin/outcomes';

//Paramns to routes links
let locals = {
	"title": "ABET Assessment",
	"subtitle": "Outcomes",
	"base_url": base_url,
	"url_create": `${base_url}/create`,
	"form_id": "outcome_data",
	"api_get_url": base_url,
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

	let performance_query = {
		"from": "STUDENT_OUTCOME",
		"join": "STUDY_PROGRAM",
		"using": "prog_ID",
	}

	//Getting all the entries for the dropdown
	let stud_outcomes = await general_queries.get_table_info_inner_join(performance_query).catch((err) => {
		console.log("Error getting the outcomes information: ", err);
	});

	// getting departments for filter
	let departments = await general_queries.get_table_info("DEPARTMENT").catch((err) => {
		console.error("THERE IS AN ERROR GETTING DEPARTMENTS: ", err);
	});

	// get all evaluation rubric
	let evaluation_rubric = await general_queries.get_table_info("PERF_CRITERIA").catch((err) => {
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

			// change date format 
			let date = new Date(outcome.date_created);
			date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

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

	// for dynamic frontend
	study_programs.forEach((element) => {
		locals.dropdown_options.push({
			"ID": element.prog_ID,
			"NAME": element.prog_name
		});
	});

	res.render('admin/layout/create', locals);
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
		if (err.code == "ER_DUP_ENTRY")
			req.flash("error", "Duplicate Outcome");
		else
			req.flash("error", "Cannot edit the outcome");

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
		outcome_to_edit.outc_description,
	]

	let index = 0;
	outcome_create_inputs.forEach((record) => {
		record.value = outcome[index];
		index++;
	});
	locals.inputs = outcome_create_inputs;

	// for dynamic frontend
	study_programs.forEach((element) => {
		locals.dropdown_options.push({
			"ID": element.prog_ID,
			"NAME": element.prog_name
		});
	});

	locals.dropdown_option_selected = outcome_to_edit.prog_ID;
	res.render('admin/layout/create', locals);
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

/* 
	-- API --
	GET ALL STUDY PROGRAMS FROM OUTCOME
*/
router.get('/:id/getStudyProgram', async function (req, res) {

	if (req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "Cannot find the outcome");
		return res.redirect(base_url);
	}

	// id of the study program
	let study_program_id = req.params.id;
	let get_outcomes_query = { "from": "STUDENT_OUTCOME", "where": "prog_ID", "id": study_program_id };

	// fetching data from db
	let outcomes = await general_queries.get_table_info_by_id(get_outcomes_query).catch((err) => {
		console.log("Error getting the information: ", err);
	});

	// verify
	if (outcomes == undefined || outcomes.length == 0) {
		return res.json([]);
	}

	// send response if it's good
	res.json(outcomes);
});

/* 
	-- API --
	GET OUTCOMES TO REMOVE
	GET /outcome/:id/delete
*/
router.get('/get/:id', async function (req, res) {

	if (req.params.id == undefined || isNaN(req.params.id)) {
		return res.end();
	}

	let outcome_query = {
		"from": "STUDENT_OUTCOME",
		"join": "STUDY_PROGRAM",
		"using": "prog_ID",
		"where": "outc_ID",
		"id": req.params.id
	};

	// Get outcome to remove 
	let outcome_to_remove = await general_queries.get_table_info_inner_join_by_id(outcome_query).catch((err) => {
		console.log("Error: ", err);
	});

	if (outcome_to_remove == undefined || outcome_to_remove.length == 0) {
		return res.end();
	}

	outcome_to_remove = outcome_to_remove[0];

	let names = ["Name", "Description", "Study Program", "Date created"];

	// change date format 
	let date = new Date(outcome_to_remove.date_created);
	date = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`;

	let values = [
		outcome_to_remove.outc_name,
		outcome_to_remove.outc_description,
		outcome_to_remove.prog_name,
		date
	];

	let record = [];
	for (let index = 0; index < names.length; index++) {
		record.push({
			"name": names[index],
			"value": values[index]
		});
	}
	res.json(record);
});

/**
 * -- API -- 
 * GET THE PERFORMANCE RUBRIC BY OUTCOME ID
 */
router.get("/get/performances/:outcome_id", async function (req, res) {

	if (req.params.outcome_id == undefined || isNaN(req.params.outcome_id)) {
		return res.json([]);
	}

	let performance_query = {
		"from": "PERF_CRITERIA",
		"where": "outc_ID",
		"id": req.params.outcome_id
	};

	let outcome_performances = await general_queries.get_table_info_by_id(performance_query).catch((err) => {
		console.log("Error getting performance: ", err);
	})

	if (outcome_performances == undefined || outcome_performances.length == 0) {
		return res.json([]);
	}

	let record = [];
	outcome_performances.forEach(element => {
		record.push({ "name": element["perC_Desk"], "value": element["perC_ID"] })
	});

	return res.json(record);
});

/**
 * -- API -- 
 * GET THE OUTCOMES BY STUDY PROGRAM
 */
router.get("/get/outcomes/:programID", async function (req, res) {

	if (req.params.programID == undefined || isNaN(req.params.programID)) {
		return res.json([]);
	}

	let outcomes_query = { "from": "STUDENT_OUTCOME", "where": "prog_ID", "id": req.params.programID };
	let outcomes = await general_queries.get_table_info_by_id(outcomes_query).catch((err) => {
		console.log("Error getting performance: ", err);
	})


	if (outcomes == undefined || outcomes.length == 0) {
		return res.json([]);
	}

	let record = [];
	outcomes.forEach(element => {
		record.push({ "name": element["outc_name"], "value": element["outc_ID"] })
	});

	return res.json(record);
});


module.exports = router;
