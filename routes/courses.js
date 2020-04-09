var express = require('express');
var query = require("../helpers/queries/course_queries");
var general_queries = require("../helpers/queries/general_queries");
var roolback_queries = require("../helpers/queries/roolback_queries");
var router = express.Router();
const table = require("../helpers/DatabaseTables");
const { course_create_inputs } = require("../helpers/layout_template/create");
var { validate_form, split_and_filter, get_data_for_update } = require("../helpers/validation");


// var authHelper = require('../helpers/auth');

const base_url = '/admin/courses'
let locals = {
	"title": 'ABET Assessment',
	"base_url": base_url,
	"subtitle": 'Courses',
	"url_create": `${base_url}/create`,
	"form_id": "course_data",
	"api_get_url": "/api/get/course", // missing id - /apig/get/course/:id
	"delete_redirect": null,
	filter: true,
	"filter_title": "-- Study Program --",
	feedback_message: "Number of Courses: ",
};

/*
	--HOME PAGE--
	GET /courses
	// TODO: FIX ERROR WITH DATE
*/
router.get('/', async function (req, res) {

	locals.breadcrumb = [
		{ "name": "Courses", "url": base_url },
	];

	locals.table_header = ["Course Name", "Course Number", "Study Program", "Date Created", ""];
	locals.results = [];

	let courses = await query.get_course_with_std_program().catch((err) => {
		console.log("Error getting the courses with std program results: ", err);
	});

	let study_program = await general_queries.get_table_info(table.study_program).catch((err) =>{
		console.error("Error getting study programs:", err);
	});

	// validate study program
	if (study_program == undefined || study_program.length == 0){
		res.flash("error", "cannot find study programs");
		return res.redirect("/admin");
	}
	
	let results = [];
	if (courses != undefined && Object.keys(courses).length > 0) {

		for (let key in courses) {

			date = new Date(courses[key].date_created);
			// change date format 
			date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

			results.push({
				"ID": courses[key]["course_ID"],
				"values": [
					courses[key]["course_name"],
					courses[key]["course_number"],
					courses[key]["prog_name"],
					date,
					""
				]
			});
		}
		// remove duplicates
		locals.filter_value = study_program.map(each => each["prog_name"]);
		locals.results = results;
	}
	res.render('layout/home', locals);
});


/*
	--SHOW CREATE--
 	GET /courses/create 
*/
router.get('/create', async function (req, res, next) {

	locals.breadcrumb = [
		{ "name": "Courses", "url": base_url },
		{ "name": "Create", "url": locals.url_create }
	];

	locals.have_dropdown = true;
	locals.dropdown_options = [];
	locals.dropdown_title = "Study Program";
	locals.dropdown_name = "data[prog_id]";
	locals.title_action = "Create Course";
	locals.url_form_redirect = `${base_url}/create`;
	locals.btn_title = "Create";
	locals.study_programs = [];
	locals.selected = [];

	// get all study program
	let all_study_program = await general_queries.get_table_info("STUDY_PROGRAM").catch((err) => {
		console.log("Error getting the programs: ", err);
	});

	// Validate study program
	if (all_study_program == undefined || all_study_program.length == 0) {
		req.flash("error", "Need to create Study Program in order to create a Course");
		return res.redirect(base_url);
	}

	all_study_program.forEach((element) => {
		locals.study_programs.push({
			label: element.prog_name,
			value: element.prog_ID.toString()
		});
	});

	// reset value to nothing when creating a new record
	course_create_inputs.forEach((record) => {
		record.value = "";
	});

	// front
	locals.inputs = course_create_inputs;
	locals.description_box = { name: "data[description]", text: "Course Description", value: "" }


	res.render('admin/course/create_edit', locals);
});

/* 
	--CREATE COURSE--
	POST courses/create
*/
router.post('/create', async function (req, res) {

	// validate body
	if (req.body == undefined || req.body.data == undefined) {
		req.flash("error", "Error in the course data");
		return res.redirect(base_url);
	}

	req.body.data["study_programs"] = req.body.user_selection;
	// to validation
	let key_types = {
		"number": 's',
		"name": 's',
		// "description": 's',
		"study_programs": 's',
	};

	let data = req.body.data;

	// if the values don't mach the type 
	if (!validate_form(data, key_types)) {
		console.log("Error in validation");
		req.flash("error", "Error in the information of the course");
		return res.redirect("back");
	}

	data["study_programs"] = split_and_filter(data["study_programs"], ",")

	roolback_queries.create_course(data).then((ok) => {
		req.flash("success", "Course created");
		res.redirect(base_url);
	}).catch((err) => {
		console.log("ERROR: ", err);
		req.flash("error", "Error creating the course, Contact the Admin");
		return res.redirect(base_url);
	});
});

/*
	--SHOW EDIT ROUTE--
 	GET /courses/:id/edit
*/
router.get('/:id/edit', async function (req, res) {

	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "This course does not exits");
		return res.redirect(base_url);
	}

	locals.breadcrumb = [
		{ "name": "Courses", "url": base_url },
		{ "name": "Edit", "url": "." }
	];

	// Dynamic frontend vars
	let id_course = req.params.id;
	locals.dropdown_options = [];
	locals.have_dropdown = true;
	locals.title_action = "Editing Course";
	locals.dropdown_title = "Study Program";
	locals.dropdown_name = "data[prog_id]";
	locals.btn_title = "Submit";
	locals.url_form_redirect = `${base_url}/${id_course}?_method=PUT`;
	locals.study_programs = [];
	locals.selected = [];

	let data = { "from": "COURSE", "where": "course_ID", "id": id_course };

	// get course information by id
	let courses_info = await general_queries.get_table_info_by_id(data).catch((err) => {
		console.log("Error Getting course info: ", err);
		//throw err;
	});

	// validate course 
	if (courses_info == undefined || courses_info.length == 0) {
		req.flash("error", "This course does not exits");
		return res.redirect("/");
	}
	// We only care about the first position
	courses_info = courses_info[0];

	// Get all study program
	let all_study_program = await general_queries.get_table_info("STUDY_PROGRAM").catch((err) => {
		console.log("Error getting study program info: ", err);
	});

	// verify study program
	if (all_study_program == undefined || all_study_program.length == 0) {
		console.log("This course do not belong to any study program");
		req.flash("error", "This course does not belong to any study program");
		return res.redirect(base_url);
	}

	let course_study_program = await query.get_study_program_for_course(id_course).catch((err) => {
		console.log("Error getting the course: ", err);
	});

	locals.selected = course_study_program;

	all_study_program.forEach((element) => {
		locals.study_programs.push({
			label: element.prog_name,
			value: element.prog_ID.toString()
		});
	});

	// course information for edit
	course = [
		courses_info.course_number,
		courses_info.course_name,
	];

	// set the ejs data to append
	let index = 0;
	course_create_inputs.forEach((record) => {
		record.value = course[index];
		index++;
	});

	// append the course information to the EJS
	locals.inputs = course_create_inputs;
	locals.description_box = { name: "data[description]", text: "Course Description", value: courses_info.course_description }


	res.render('admin/course/create_edit', locals);
});

/*
	** EDIT COURSES ** 
	PUT /courses/:id
*/
router.put('/:id', async function (req, res) {

	if (req.params.id == undefined || isNaN(req.params.id) || req.body == undefined ||
		req.body.data == undefined) {
		req.flash("error", "Cannot find the user");
		return res.redirect(base_url);
	}

	// if the user remove all options
	if (req.body.user_selection == ",") {
		req.flash("error", "Course need to have a least one study program");
		return res.redirect("back");
	}

	let course_id = req.params.id;
	let data = req.body.data;
	data["id"] = course_id;

	// to validation
	let key_types = {
		"number": 's',
		"name": 's',
		"description": 's'
	}

	// // if the values don't mach the type 
	if (!validate_form(data, key_types)) {
		console.log("Error in validation");
		req.flash("error", "Error in the information of the course");
		return res.redirect("back");
	}

	if (req.body.user_selection == undefined || req.body.user_selection.length == 0 || req.body.user_selection == "") {
		req.body.user_selection = req.body.selected;
	}
	let current_study_program = split_and_filter(req.body.selected, ",");
	let expected_study_program = split_and_filter(req.body.user_selection, ",");

	let study_program_for_update = get_data_for_update(current_study_program, expected_study_program);
	// console.log(study_program_for_update);

	// remove element if there is any
	if (study_program_for_update["delete"].length > 0) {

		await query.remove_program_course(course_id, study_program_for_update["delete"]).catch((err) => {
			console.error("There is an error removing: ", err);
		});
	}

	// remove element if there is any
	if (study_program_for_update["insert"].length > 0) {
		await query.insert_program_course(course_id, study_program_for_update["insert"]).catch((err) => {
			console.error("There is an error Updating: ", err);
		});
	}

	query.update_course(data).then((ok) => {
		req.flash("success", "Course Edited");
		res.redirect(base_url);
	}).catch((err) => {
		console.log(err);
		req.flash("error", "Cannot update the course");
		res.redirect(base_url);
	});

});

/*
 	-- DELETE ROUTE -- 
	DELETE /users/:id
*/
router.delete('/:id', async function (req, res) {

	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "This course don't exits");
		return res.redirect(base_url);
	}

	let course_id = req.params.id;

	let data = { "id": course_id, "from": "COURSE", "where": "course_ID" };

	await general_queries.delete_record_by_id(data).catch((err) => {
		console.log("Cannot remove the record: ", err);
	});

	req.flash("success", "Course Removed");
	res.redirect(base_url);
});

module.exports = router;