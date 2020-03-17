var express = require('express');
var router = express.Router();
var general_queries = require('../helpers/queries/general_queries');
var queries = require('../helpers/queries/performanceCriteria_queries');
const { performance_criteria_create_input } = require("../helpers/layout_template/create");
var { validate_outcome, validate_performance_criteria } = require("../middleware/validate_outcome");

const title = "Evaluating Perfomance Criteria - ";
const base_url = "/admin/outcomes";
//Params to routes links
var locals = {
	title: 'ABET Assessment',
	subtitle: 'Perfomance Criteria',
	url_create: "/perfomanceCriteria/create",
	"form_id": "criteria_data",
	"api_get_url": "/admin/outcomes/performanceCriteria",
	delete_redirect: null,
	feedback_message: "Number of Performance Criteria: ",
};

/*
	GET home page.
*/
router.get('/:outc_id/performanceCriteria', validate_outcome, async function (req, res) {

	locals.breadcrumb = [
		{ "name": "Outcomes", "url": base_url },
		{ "name": "Performance Criteria", "url": '.' }
	];

	locals.subtitle = title + (req.body.outcome["outc_name"] || "N/A") + " - " + (req.body.outcome["prog_name"] || "");
	locals.base_url = `/admin/outcomes/${req.params.outc_id}/performanceCriteria`;

	let performance_query = {
		"from": "perf_criteria".toUpperCase(),
		"where": "outc_ID",
		"id": req.params.outc_id,
	}

	//Get all perfCrit from the database
	let all_perfomance = await general_queries.get_table_info_by_id(performance_query).catch((err) => {
		console.log("There is an error getting the Performance Criteria: ", err);
	});

	locals.results = [];
	locals.table_header = ["Description", "Order", ""];

	// Validate data
	if (all_perfomance != undefined && all_perfomance.length > 0) {
		let results = [];

		all_perfomance.forEach(performance => {

			results.push({
				"ID": performance["perC_ID"],
				"values": [
					performance["perC_Desk"],
					performance["perC_order"],
					"" // position the buttons of remove, and edit
				]
			});
		});
		locals.results = results;
	}
	res.render('admin/layout/home', locals);
});

/* 
	-- CREATE PERF CRIT -- 
	GET /performanceCriteria/create
*/
router.get("/:outc_id/performanceCriteria/create", validate_outcome, async function (req, res) {

	locals.breadcrumb = [
		{ "name": "Outcomes", "url": base_url },
		{ "name": "Performance Criteria", "url": `${base_url}/${req.params.outc_id}/performanceCriteria` },
		{ "name": "Create", "url": '.' }
	];

	locals.title_action = (req.body.outcome["outc_name"] || "N/A") + " - " + (req.body.outcome["prog_name"] || "");
	locals.have_dropdown = false;
	locals.btn_title = "Create";
	locals.base_url = `/admin/outcomes/${req.params.outc_id}/performanceCriteria`;
	locals.url_form_redirect = `/admin/outcomes/${req.params.outc_id}/performanceCriteria/create`;

	// reset value to nothing when creating a new record
	performance_criteria_create_input.forEach((record) => {
		record.value = "";
	});

	locals.inputs = performance_criteria_create_input;
	locals.description_box = { name: "description", text: "Criteria Description", value: "" };


	res.render('admin/layout/create', locals);
});

router.post("/:outc_id/performanceCriteria/create", validate_outcome, async function (req, res) {

	if (req.body.description == undefined || req.body.order == undefined) {
		req.flash("error", "Invalid inserted information");
		return res.redirect("back");
	}

	let outcome_id = req.params.outc_id;
	let description = req.body.description;
	let order = req.body.order;
	let base_url = `/admin/outcomes/${req.params.outc_id}/performanceCriteria`;

	queries.create_performance({ "description": description, "order": order, "outcome_id": outcome_id }).then((ok) => {
		req.flash("success", "Performance Criteria Created!");
		res.redirect(base_url);
	}).catch((err) => {
		console.log("Error: ", err);
		req.flash("error", "Error Creating the Performance rubric!");
		res.redirect(base_url);
	});
});

/* 
	-- SHOW EDIT PERF CRIT -- 
	GET /performanceCriteria/:id/edit
*/
router.get("/:outc_id/performanceCriteria/:perf_id/edit", validate_outcome, validate_performance_criteria, async function (req, res) {


	locals.breadcrumb = [
		{ "name": "Outcomes", "url": base_url },
		{ "name": "Performance Criteria", "url": `${base_url}/${req.params.outc_id}/performanceCriteria` },
		{ "name": "Edit", "url": '.' }
	];

	let message = "Edit Performance Criteria for: ";
	locals.title_action = message + (req.body.outcome["outc_name"] || "N/A") + " - " + (req.body.outcome["prog_name"] || "");
	locals.have_dropdown = false;
	locals.url_form_redirect = `/admin/outcomes/${req.params.outc_id}/performanceCriteria/${req.params.perf_id}?_method=PUT`;
	locals.btn_title = "Edit";
	locals.base_url = `/admin/outcomes/${req.params.outc_id}/performanceCriteria`;

	// append the rubric data to the array
	let performance_rubric = [req.body.rubric.perC_order];

	// add the rubric data to front-end
	let index = 0;
	performance_criteria_create_input.forEach((record) => {
		record.value = performance_rubric[index];
		index++;
	});

	locals.inputs = performance_criteria_create_input;
	locals.description_box = { name: "description", text: "Criteria Description", value: req.body.rubric.perC_Desk };

	res.render('admin/layout/create', locals);
});

/* 
	-- SHOW REMOVE PERF CRIT -- 
	GET /performanceCriteria/:id/remove
*/
router.put("/:outc_id/performanceCriteria/:perf_id", validate_outcome, validate_performance_criteria, async function (req, res) {

	// validatin the parameters
	if (req.body == undefined || req.body.description == undefined || req.body.order == undefined) {
		req.flash("error", "Error with the data");
		return res.redirect("back");
	}
	let base_url = `/admin/outcomes/${req.params.outc_id}/performanceCriteria`;

	let new_description = req.body.description;
	let new_order = req.body.order;

	let rubric_query = { "description": new_description, "order": new_order, "id": req.params.perf_id }

	queries.update_performance(rubric_query).then((ok) => {
		req.flash("success", "Performance Criteria updated!");
		res.redirect(base_url);
	}).catch((err) => {
		console.log("Error: ", err);
		req.flash("error", "Error updating the Performance Criteria!");
		res.redirect(base_url);
	});
});


/* 
	-- API GET PERFORMANCE CRITERIA -- 
	GET /performanceCriteria/:id/remove
	TODO: ADD USER VALIDATION
*/
router.get("/performanceCriteria/get/:perf_id", async function (req, res) {

	if (req.params.perf_id == undefined || isNaN(req.params.perf_id)) {
		return res.json([]);
	}
	let performance_query = { "from": "perf_criteria", "where": "perC_ID", "id": req.params.perf_id };
	let performance = await general_queries.get_table_info_by_id(performance_query).catch((err) => {
		console.log("Error getting performance: ", err);
	})

	if (performance == undefined || performance.length == 0) {
		return res.json([]);
	}

	performance = performance[0];

	let names = ["Description", "Order"];

	let values = [performance.perC_Desk, performance.perC_order];

	let record = [];
	for (let index = 0; index < names.length; index++) {
		record.push({ "name": names[index], "value": values[index] })
	}

	// console.log(record);
	return res.json(record);
});

router.delete("/performanceCriteria/:perf_id", async function (req, res) {

	if (req.params.perf_id == undefined || isNaN(req.params.perf_id)) {
		req.flash("error", "Error removing the Performance Criteria!");
		return res.redirect("back");
	}
	general_queries.delete_record_by_id({ "from": "perf_criteria", "where": "perC_ID", "id": req.params.perf_id }).then((ok) => {
		req.flash("success", "Performance Criteria removed!");
		res.redirect("back");
	}).catch((err) => {
		console.log("Error: ", err);
		req.flash("error", "Error removing the Performance Criteria!");
		res.redirect("back");
	});
});

module.exports = router;
