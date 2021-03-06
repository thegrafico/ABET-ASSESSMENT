// dependencies
var express = require('express');
var router = express.Router();
var query = require("../helpers/queries/department_queries");
var general_queries = require("../helpers/queries/general_queries");
const { department_create_inputs } = require("../helpers/layout_template/create");
var { validate_form } = require("../helpers/validation")
var moment = require("moment");
const table = require("../helpers/DatabaseTables");

// base url
const base_url = '/admin/department';

//Paramns to routes links
let locals = {
	"title": 'ABET Assessment',
	"subtitle": 'Departments',
	"base_url": base_url,
	"url_create": `${base_url}create`,
	"form_id": "department_data",
	"api_get_url": "/api/get/department", // missing id - /api/get/department/:dept_id
	"delete_redirect": null,
	feedback_message: "Number of Departments: "

};
/*
 	-- DEPARTMENT home page-- 
	GET /deparment
*/
router.get('/', async function (req, res) {

	locals.breadcrumb = [
		{ "name": "Department", "url": base_url },
	];

	// page title
	locals.title = "Departments";

	// css style
	locals.css_table = "department.css";
	
	//Getting the  DEPARTMENT information from db
	let all_deparment = await general_queries.get_table_info(table.department).catch((err) => {
		console.error("Error getting deparment information: ", err);
	});

	locals.table_header = ["Name", "Description", "Date Created", ""];
	let results = [];

	// Validate department 
	if (all_deparment != undefined && all_deparment.length > 0) {

		all_deparment.forEach(deparment => {

			let date = moment(deparment.date_created).format('MMMM Do YYYY');

			results.push({
				"ID": deparment.dep_ID,
				"values": [
					deparment.dep_name,
					deparment.dep_description,
					date,
					""
				]
			});
		});
	}
	locals.results = results;
	res.render('layout/home', locals);
});

/*
	--SHOW Deparment create--
	GET /deparment/create
*/
router.get('/create', function (req, res) {

	locals.breadcrumb = [
		{ "name": "Department", "url": base_url },
		{ "name": "Create", "url": "." }
	];

	locals.title = "Create Department";


	locals.have_dropdown = false;
	locals.title_action = "Create Department";
	locals.url_form_redirect = `${base_url}/create`;
	locals.btn_title = "Create";

	// reset value to nothing when creating a new record
	department_create_inputs.forEach((record) => {
		record.value = "";
	});

	locals.inputs = department_create_inputs;
	locals.description_box = { name: "description", text: "Department Description", value: "" }
	res.render('layout/create', locals);
});

/* 
	--Create deparment--
	POST /deparment/create
*/
router.post('/create', function (req, res) {

	// validate body
	if (req.body == undefined) {
		req.flash("error", "Cannot find department data");
		return res.redirect(base_url);
	}

	// to validation - expected values
	let key_types = {
		"name": 's',
		"description": 's'
	}

	// if the values don't mach the type 
	if (!validate_form(req.body, key_types)) {
		console.log("Error in validation");
		req.flash("error", "Error with the data inserted");
		return res.redirect(base_url);
	}

	// Insert into the DB the data from user
	query.insert_into_deparment([req.body.name, req.body.description]).then((was_edit) => {

		console.log("Department was created");
		req.flash("success", "Department created");
		res.redirect(base_url);

	}).catch((err) => {
		// flash message [ERRO]
		console.error("Error: ", err);

		if (err.code == "ER_DUP_ENTRY")
			req.flash("error", "A Departmetn with the same information does already exits");
		else
			req.flash("error", "Cannot Department created");

		res.redirect(base_url);
	});
});

/*
	-- SHOW DEPARMENT EDIT--
	GET /deparment/:id/edit
*/
router.get('/:id/edit', async function (req, res) {

	locals.breadcrumb = [
		{ "name": "Department", "url": base_url },
		{ "name": "Edit", "url": "." }
	];

	locals.title = "Edit Department";


	// validating
	if (req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "Cannot find the department");
		return res.redirect(base_url);
	}

	let dept_id = req.params.id;
	locals.url_form_redirect = `${base_url}/${dept_id}?_method=PUT`;
	locals.have_dropdown = false;
	locals.title_action = "Editing Department";
	locals.btn_title = "Submit";

	let tabla_data = { "from": table.department, "where": "dep_ID", "id": dept_id };

	let dept_data = await general_queries.get_table_info_by_id(tabla_data).catch((err) => {
		console.log("Error: ", err);
	});

	// validate data
	if (dept_data == undefined || dept_data.length == 0) {
		console.log("Cannot find this department");
		req.flash("error", "Cannot find this department");
		return res.redirect(base_url);
	}

	// We only care about the first one
	dept_data = dept_data[0];

	dept = [
		dept_data.dep_name,
	];

	let index = 0;
	department_create_inputs.forEach((record) => {
		record.value = dept[index];
		index++;
	});

	locals.description_box = { name: "description", text: "Department Description", value: dept_data.dep_description }
	locals.inputs = department_create_inputs;

	res.render('layout/create', locals);
});

/*
	-- EDIT DEPARMENT--
	PUT /deparment/:id
*/
router.put('/:id', function (req, res, next) {

	if (req.params.id == undefined || req.body == undefined) {
		req.flash("error", "Department does not exits");
		return res.redirect(base_url);
	}

	// to validation - expected values
	let key_types = {
		"name": 's',
		"description": 's'
	}

	// if the values don't mach the type 
	if (!validate_form(req.body, key_types)) {
		console.log("Error in validation");
		req.flash("error", "Error with the data inserted");
		return res.redirect("back");
	}

	// Exe the query into the database
	query.update_deparment([req.body.name, req.body.description, req.params.id]).then((ok) => {
		console.log("Department EDITED!");
		req.flash("success", "Deparment edited");
		res.redirect(base_url);
	}).catch((err) => {
		console.log("ERROR: ", err);

		if (err.code == "ER_DUP_ENTRY")
			req.flash("error", "A Departmetn with the same information does already exits");
		else
			req.flash("error", "Cannot Edit department");

		res.redirect(base_url);
	});
});

/* 
	-- DELETE DEPARMENT BY ID -- 
	DELETE /admin/deparment/:id
*/
router.delete('/:id', function (req, res, next) {

	// validating
	if (req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "Cannot find the department");
		return res.redirect(base_url);
	}

	let tabla_data = { "from": table.department, "where": "dep_ID", "id": req.params.id };

	general_queries.delete_record_by_id(tabla_data).then((was_deleted) => {
		console.log("Record delete");
		req.flash("success", "Deparment removed");
		res.redirect(base_url);
	}).catch((err) => {
		console.log("ERROR: ", err);
		req.flash("error", "Cannot remove the department");
		res.redirect("/");
	});

});


module.exports = router;
