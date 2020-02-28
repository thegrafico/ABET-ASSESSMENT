var express = require('express');
var query = require("../helpers/queries/term_queries");
var general_queries = require("../helpers/queries/general_queries");
var router = express.Router();
const { academic_term } = require("../helpers/layout_template/create");
var { validate_form } = require("../helpers/validation");


const base_url = '/term';

//Paramns to routes links
let locals = {
	"title": "ABET Assessment",
	"subtitle": "Term",
	"base_url": base_url,
	"url_create": "/term/create",
	"form_id": "term_data",
	"api_get_url": "/term",
	delete_redirect: null

};

/* 
	-- SHOW all terms -- 
	GET /term
*/
router.get('/', async function(req, res) {

	locals.results = [];

	let academic_terms = await general_queries.get_table_info("ACADEMIC_TERM").catch((err) => {
		console.log("Error getting the terms");
	});

	// Validation
	if (academic_terms != undefined && academic_terms.length > 0){
		
		let results = [];
		academic_terms.forEach(term => {			

			results.push({
				"ID": term["term_ID"],
				"values": [
					term["term_name"],
					"" // position the buttons of remove, and edit
				]
			});
		});
		locals.results = results;
	}
	locals.table_header = ["Name", ""];

	res.render('layout/home', locals);
});

/* 
	-- SHOW CREATE TERM --
	GET /term/create
*/ 
router.get('/create', function(req, res) {
	
	// store all profiles
	locals.have_dropdown = false;
	locals.title_action = "Create Academic Term";
	locals.url_form_redirect = "/term/create";
	locals.btn_title = "Create";

	// reset value to nothing when creating a new record
	academic_term.forEach((record) =>{
		record.value = "";
	});

	// set the input for user
	locals.inputs = academic_term;

	res.render("layout/create", locals);
});

router.post('/create', function(req, res) {

	// validate body
	if (req.body == undefined){
		req.flash("error", "Cannot find term data");
		return res.redirect(base_url);
	}

	// to validation - expected values
	let key_types = {
		"name": 's',
	}

	// if the values don't mach the type 
	if (!validate_form(req.body, key_types)){
		console.log("Error in validation");
		req.flash("error", "Error in the information of the outcome");
		return res.redirect(base_url);	
	}

	//TODO: verify values, null, undefined
	let data = {"name": req.body.name }; 

	//Insert into the DB the data from user
	query.insert_into_term(data).then((ok) => {
		req.flash("success", "Term Created");
		res.redirect(base_url);
	}).catch((err) => {
		console.log(err);
		req.flash("error", "Cannot Create the term");
		res.redirect(base_url);
	});
});

/* 
	-- SHOW Update the term -- 
	PUT /term/:id/edit 
*/
router.get('/:id/edit', async function(req, res) {

	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id)){
		req.flash("error", "This term don't exits");
		return res.redirect(base_url);
	}

	// Validate id
	let id_term = req.params.id;

	let data = {"from":"ACADEMIC_TERM", "where":"term_ID", "id": id_term};

	let term_to_edit = await general_queries.get_table_info_by_id(data).catch((err) => {
		console.log("Error getting the term: ", err);
	});

	if (term_to_edit == undefined || term_to_edit.length == 0){
		req.flash("error", "Cannot find the term");
		return res.redirect(base_url);
	}

	// We only care about the first one
	term_to_edit = term_to_edit[0];

	term = [
		term_to_edit.term_name,
	];

	let index = 0;
	academic_term.forEach((record) =>{
		record.value = term[index];
		index++;
	});

	locals.url_form_redirect = `/term/${id_term}?_method=PUT`;
	locals.have_dropdown = false;
	locals.title_action = "Editing Academic Term";
	locals.btn_title = "Submit";
	locals.inputs = academic_term;

	res.render('layout/create', locals);
});

/* 
	-- Update the term -- 
	PUT /term/:id 
*/
router.put('/:id', function(req, res) {

	// validate body
	if (req.body == undefined || req.params.id == undefined || isNaN(req.params.id)){
		req.flash("error", "Cannot find term data");
		return res.redirect(base_url);
	}

	// to validation - expected values
	let key_types = {
		"name": 's',
	}

	// if the values don't mach the type 
	if (!validate_form(req.body, key_types)){
		console.log("Error in validation");
		req.flash("error", "Error in the information of the outcome");
		return res.redirect(base_url);	
	}

	// TODO: verify values befero enter to DB
	let data = {
		"name": req.body.name,
		"id": req.params.id
	}

	query.update_term(data).then((ok) => {
		req.flash("success", "Term edited");
		res.redirect(base_url);
	}).catch((err) => {
		console.log(err);
		req.flash("error", "Cannot edit the term");
		res.redirect(base_url);
	});
});



/* 
	-- SHOW TERM TO DELETE --
	GET /term/:id/remove
*/
router.get('/get/:id', async function (req, res) {
	
	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id)){
		req.flash("error", "This term don't exits");
		return res.redirect(base_url);
	}

	let term_id = req.params.id;
	let data = {"from": "ACADEMIC_TERM", "where": "term_ID", "id": term_id};
	
	let term_to_remove = await general_queries.get_table_info_by_id(data).catch((err) =>{
		console.log("Error getting the term: ", err);
	});

	if (term_to_remove == undefined || term_to_remove.length == 0){
		req.flash("error", "Cannot find the term");
		return res.redirect(base_url);
	}

	term_to_remove = term_to_remove[0];

	let names = ["Name"];
	let values = [term_to_remove.term_name];

	let record = [];
	for (let index = 0; index < names.length; index++) {
		record.push({"name": names[index], "value": values[index]})
	}

	res.json(record);
});


/* 
	--  DELETE TERM --
	DELETE /term/:id
*/
router.delete('/:id', function (req, res) {
	
	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id)){
		req.flash("error", "This term don't exits");
		return res.redirect(base_url);
	}
	
	let term_id = req.params.id;

	let data = {"id": term_id, "from": "ACADEMIC_TERM", "where":"term_ID" };

	general_queries.delete_record_by_id(data).then((ok) => {
		req.flash("success", "Term deleted");
		res.redirect(base_url);
	}).catch((err) => {
		console.log(err);
		req.flash("error", "Cannot delete the term");
		res.redirect(base_url);
	});

});


module.exports = router;