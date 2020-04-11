var express = require('express');
var query = require("../helpers/queries/term_queries");
var general_queries = require("../helpers/queries/general_queries");
var router = express.Router();
const { academic_term } = require("../helpers/layout_template/create");
var { validate_form } = require("../helpers/validation");


const base_url = '/admin/term';

//Paramns to routes links
let locals = {
	"title": "ABET Assessment",
	"subtitle": "Term",
	"base_url": base_url,
	"url_create": `${base_url}/create`,
	"form_id": "term_data",
	"api_get_url": "/api/get/schoolterm", // missing id
	delete_redirect: null,
	feedback_message: "Number of Term: ",
};

/* 
	-- SHOW all terms -- 
	GET /term
*/
router.get('/', async function (req, res) {

	locals.breadcrumb = [
		{ "name": "Term", "url": base_url },
	];

	locals.title = "Academic Term";
	locals.css_table = "academic_term.css";

	locals.results = [];

	let academic_terms = await general_queries.get_table_info("ACADEMIC_TERM").catch((err) => {
		console.log("Error getting the terms");
	});

	// Validation
	if (academic_terms != undefined && academic_terms.length > 0) {

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
router.get('/create', function (req, res) {

	locals.breadcrumb = [
		{ "name": "Term", "url": base_url },
		{ "name": "Create", "url": locals.url_create }
	];

	locals.title = "Create Academic Term";


	// store all profiles
	locals.have_dropdown = false;
	locals.title_action = "Create Academic Term";
	locals.url_form_redirect = `${base_url}/create`;
	locals.btn_title = "Create";

	// reset value to nothing when creating a new record
	academic_term.forEach((record) => {
		record.value = "";
	});

	// set the input for user
	locals.inputs = academic_term;

	res.render("layout/create", locals);
});

router.post('/create', function (req, res) {

	// validate body
	if (req.body == undefined) {
		req.flash("error", "Cannot find term data");
		return res.redirect(base_url);
	}

	// to validation - expected values
	let key_types = {
		"name": 's',
	}

	// if the values don't mach the type 
	if (!validate_form(req.body, key_types)) {
		console.log("Error in validation");
		req.flash("error", "Input Erros");
		return res.redirect("back");
	}

	//Insert into the DB the data from user
	query.insert_into_term({ "name": req.body.name }).then((ok) => {
		req.flash("success", "Term Created");
		res.redirect(base_url);
	}).catch((err) => {
		console.log(err);
		if (err.code == "ER_DUP_ENTRY")
			req.flash("error", "Term already exist");
		else
			req.flash("error", "Error Creating the Term");
		res.redirect(base_url);
	});
});

/* 
	-- SHOW Update the term -- 
	PUT /term/:id/edit 
*/
router.get('/:id/edit', async function (req, res) {

	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "This term don't exits");
		return res.redirect(base_url);
	}

	locals.title = "Edit Academic Term";


	locals.breadcrumb = [
		{ "name": "Term", "url": base_url },
		{ "name": "Edit", "url": "." }
	];

	let id_term = req.params.id;
	locals.url_form_redirect = `${base_url}/${id_term}?_method=PUT`;
	locals.have_dropdown = false;
	locals.title_action = "Editing Academic Term";
	locals.btn_title = "Submit";
	locals.inputs = academic_term;

	let data = { "from": "ACADEMIC_TERM", "where": "term_ID", "id": id_term };

	let term_to_edit = await general_queries.get_table_info_by_id(data).catch((err) => {
		console.error("Error getting the term: ", err);
	});

	if (term_to_edit == undefined || term_to_edit.length == 0) {
		req.flash("error", "Cannot find the term");
		return res.redirect(base_url);
	}

	// We only care about the first one
	term_to_edit = term_to_edit[0];

	term = [
		term_to_edit.term_name,
	];

	let index = 0;
	academic_term.forEach((record) => {
		record.value = term[index];
		index++;
	});

	res.render('layout/create', locals);
});

/* 
	-- Update the term -- 
	PUT /term/:id 
*/
router.put('/:id', function (req, res) {

	// validate body
	if (req.body == undefined || req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "Cannot find term data");
		return res.redirect(base_url);
	}

	// to validation - expected values
	let key_types = {
		"name": 's',
	}

	// if the values don't mach the type 
	if (!validate_form(req.body, key_types)) {
		console.log("Error in validation");
		req.flash("error", "Error in the information of the outcome");
		return res.redirect("back");
	}

	// data for db
	let data = {
		"name": req.body.name,
		"id": req.params.id
	}

	query.update_term(data).then((ok) => {
		req.flash("success", "Term edited");
		res.redirect(base_url);
	}).catch((err) => {
		console.log(err);
		if (err.code == "ER_DUP_ENTRY")
			req.flash("error", "Term already exist");
		else
			req.flash("error", "Error Editing the Term");

		res.redirect(base_url);
	});
});

/* 
	--  DELETE TERM --
	DELETE /term/:id
*/
router.delete('/:id', function (req, res) {

	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "This term don't exits");
		return res.redirect(base_url);
	}

	let term_id = req.params.id;

	let data = { "id": term_id, "from": "ACADEMIC_TERM", "where": "term_ID" };

	general_queries.delete_record_by_id(data).then((ok) => {
		req.flash("success", "Term deleted");
		res.redirect("back");
	}).catch((err) => {
		console.log(err);
		req.flash("error", "Cannot delete the term");
		res.redirect("back");
	});

});


module.exports = router;