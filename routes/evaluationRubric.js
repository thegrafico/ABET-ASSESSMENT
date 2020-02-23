/* 
	EVALUATION RUBRIC ROUTE
	GET /evaluation
*/
var express = require('express');
var router = express.Router();
var query = require('../helpers/queries/evaluation_queries');
var general_queries = require('../helpers/queries/general_queries');
const { evaluation_rubric_input } = require("../helpers/layout_template/create");

let base_url = '/evaluation';

//Paramns to routes links
let locals = {
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

	let rubric_query = {
		"from": "evaluation_rubric",
		"join": "student_outcome",
		"using": "outc_ID",
	}
	// getting evaluation rubric from db
	let eval_rubric = await general_queries.get_table_info_inner_join(rubric_query).catch((err) => {
		console.log("Error getting all evaluation rubric: ", err);
	});

	
	locals.results = [];
	locals.table_header = ["Name", "Description", "outcome", ""];

	// Validate data
	if (eval_rubric != undefined && eval_rubric.length > 0){
		let results = [];
		
		eval_rubric.forEach(rubric => {			

			results.push({
				"ID": rubric["rubric_ID"],
				"values": [
					rubric["rubric_name"],
					rubric["rubric_description"],
					rubric["outc_name"],
					"" // position the buttons of remove, and edit
				]
			});
		});
		locals.results = results;
	}
	res.render('layout/home', locals);
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
	locals.profiles = [];
	locals.dropdown_options = [];
	locals.have_dropdown = true;
	locals.dropdown_title = "Outcomes";
	locals.dropdown_name = "outcome";
	locals.title_action = "Create Evaluation Rubric";
	locals.url_form_redirect = "/evaluation/create";
	locals.btn_title = "Create";

	// reset value to nothing when creating a new record
	evaluation_rubric_input.forEach((record) =>{
		record.value = "";
	});

	// set the input for user
	locals.inputs = evaluation_rubric_input;

	// for dynamic frontend
	outcomes.forEach( (element) =>{
		locals.dropdown_options.push({
			"ID" : element.outc_ID,
			"NAME": element.outc_name
		});
	});

	res.render('layout/create', locals);
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
	GET /evaluation/:id/edit
*/
router.get('/:id/edit', async function(req, res) {

	//TODO: Validate of null of not a number
	let evaluation_id = req.params.id;
	
	// store all profiles
	locals.profiles = [];
	locals.dropdown_options = [];
	locals.have_dropdown = true;
	locals.dropdown_title = "Outcomes";
	locals.dropdown_name = "outcome";
	locals.title_action = "Edit Evaluation Rubric";
	locals.url_form_redirect = `/evaluation/${evaluation_id}?_method=PUT`;
	locals.btn_title = "Edit";
	
	let rubric_data = {"from": "evaluation_rubric", "where": "rubric_ID", "id": evaluation_id};
	let rubric_to_edit = await general_queries.get_table_info_by_id(rubric_data).catch((err) =>{
		console.log("Cannot get the rubric");
	});

	// validate
	if (rubric_to_edit == undefined || rubric_to_edit.length == 0){
		req.flash("error", "Cannot find the rubric to edit");
		return res.redirect(base_url);
	}
	
	// Only contain one element
	rubric_to_edit = rubric_to_edit[0];

	// get all outcomes
	let outcomes = await general_queries.get_table_info("student_outcome").catch((err) => {
		console.log("Error: ", err);
	});

	// validate outcomes
	if (outcomes == undefined || outcomes.length == 0){
		res.flash("error", "Need to create outcome first");
		return res.redirect(base_url);
	}

	// input data
	let rubric_to_input = [
		rubric_to_edit.rubric_name,
		rubric_to_edit.rubric_description,
	]

	// fill out the values with the template 
	let index = 0;
	evaluation_rubric_input.forEach((record) =>{
		record.value = rubric_to_input[index];
		index++;
	});

	// fill out the dropdowm menu
	outcomes.forEach( (element) =>{
		locals.dropdown_options.push({
			"ID" : element.outc_ID,
			"NAME": element.outc_name
		});
	});
	
	// Dynamic EJS
	locals.inputs = evaluation_rubric_input;

	res.render('layout/create', locals);
});

/* 
	-- EDIT Evaluation rubric -- 
	PUT /evaluation/:id
*/
router.put('/:id', function(req, res) {
	// validate id
	let evaluation_id = req.params.id;

	let evaluation_data = {
		"name": req.body.name,
		"description": req.body.description,
		"outcome_id": req.body.outcome,
		"rubric_id": evaluation_id
	}
	query.update_evaluation_rubric(evaluation_data).then((ok) => {
		req.flash("success", "Evaluation Rubric edited");
		res.redirect(base_url);
	}).catch((err) => {
		console.log("Error: ", err);
		req.flash("error", "Cannot edit the Evaluation Rubric");
		res.redirect(base_url);
	});
});

/* 
	-- SHOW DELETE EVAluation rubric --
	GET /evaluation/:id/delete 
*/
router.get('/:id/remove', async function(req, res) {

	// TODO: validate id, if null or not a number 
	let rubric_id = req.params.id;

	locals.title_action = "Remove";
	locals.title_message = "Are you sure you want to delete this Evaluation Rubric?";
	locals.form_action = `/evaluation/${rubric_id}?_method=DELETE`;
	locals.btn_title = "Delete";

	
	let rubric_for_query = {"from": "evaluation_rubric", "where": "rubric_ID", "id": rubric_id};
	let rubric_to_remove = await general_queries.get_table_info_by_id(rubric_for_query).catch((err) =>{
		console.log("Cannot get the rubric: ", err);
	});

	// verify is user data is good
	if (rubric_to_remove == undefined ||  rubric_to_remove.length == 0){
		req.flash("error", "Cannot find the Evaluation rubric");
		return res.redirect(base_url);
	}

	rubric_to_remove = rubric_to_remove[0];

	let names = ["Outcome", "Name", "Description"];
	let values = [
		rubric_to_remove.outc_ID, 
		rubric_to_remove.rubric_name, 
		rubric_to_remove.rubric_description,
	];

	let record = [];
	for (let index = 0; index < names.length; index++) {
		record.push({"name": names[index], "value": values[index]})
	}

	locals.record = record;
	res.render('layout/remove', locals);
});

/* 
	-- DELETE evaluation rubric -- 
	DELETE /evaluation/:id
*/
router.delete('/:id', function(req, res) {

	// TODO: validate data
	let rubric_id = req.params.id;
	let rubric_for_query = {"from": "evaluation_rubric", "where": "rubric_ID", "id": rubric_id};
	general_queries.delete_record_by_id(rubric_for_query).then((ok) =>{
		req.flash("success", "Rubric removed");
		res.redirect(base_url);
	}).catch((err) => {
		console.log("Error: ", err);
		req.flash("error", "Cannot removed Rubric");
		res.redirect(base_url);		
	});	
});

module.exports = router;
