var express = require('express');
var query = require("../helpers/queries/course_queries");
var general_queries = require("../helpers/queries/general_queries");
var router = express.Router();
const { course_create_inputs } = require("../helpers/layout_template/create");
var { validate_form } = require("../helpers/validation");


// var authHelper = require('../helpers/auth');

const base_url = '/courses'
let locals = {
	"title": 'ABET Assessment',
	"base_url":base_url,
	"subtitle": 'Courses',
	"url_create": "/courses/create"
};

/*
	--HOME PAGE--
	GET /courses
*/
router.get('/', async function(req, res) {

	locals.table_header = ["Course Name", "Course Number", "Study Program", "Date Created", ""];
	locals.results = [];
	
	let course_results = await query.get_course_info().catch((err) =>{
		console.log("Error getting the courses results: ", err);
		return res.redirect("/");
	});
	
	let results = [];
	if (course_results != undefined || course_results.length > 0 ){
		
		course_results.forEach(course => {

			// change date format 
			let date = new Date(course.date_created);
			date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
			
			results.push({
				"ID": course["course_ID"],
				"values": [
					course["course_name"],
					course["course_number"],
					course["prog_name"],
					date,
					""
				]
			});
		});
		locals.results = results;
	}
	res.render('layout/home', locals);
});


/*
	--SHOW CREATE--
 	GET /courses/create 
*/
router.get('/create', async function(req, res, next) {
	
	locals.have_dropdown = true;
	locals.dropdown_options = [];
	locals.dropdown_title = "Study Program";
	locals.dropdown_name = "data[prog_id]";
	locals.title_action = "Create Course";

	let all_study_program =  await general_queries.get_table_info("STUDY_PROGRAM").catch((err)=>{
		console.log("Error getting the programs: ", err);
	});

	// Validate study program
	if (all_study_program == undefined || all_study_program.length == 0){
		console.log("NOT study programn found");
		// Flash message ERROR
		return res.redirect("/");
	}
	
	all_study_program.forEach( (element) =>{
		locals.dropdown_options.push({
			"ID" : element.prog_ID,
			"NAME": element.prog_name
		});
	});

	// reset value to nothing when creating a new record
	course_create_inputs.forEach((record) =>{
		record.value = "";
	});
	locals.inputs = course_create_inputs;

	locals.url_form_redirect = "/courses/create";
	locals.btn_title = "Create";
  	res.render('layout/create', locals);
});

/* 
	--CREATE COURSE--
	POST courses/create
*/
router.post('/create', async function(req, res) {

	// validate body
	if (req.body == undefined || req.body.data == undefined){
		req.flash("error", "Error in the course data");
		return res.redirect(base_url);
	}

	// to validation
	let key_types = {
		"prog_id": 'n',
		"number": 's',
		"name": 's',
		"description": 's'
	}

	// get the course data 
	let data = req.body.data;

	// if the values don't mach the type 
	if (!validate_form(data, key_types)){
		console.log("Error in validation");
		req.flash("error", "Error in the information of the course");
		return res.redirect(base_url);	
	}

	let course_id = await query.insert_into_course(data).catch((err) => {
		console.log("Cannot create the course");
	});

	if (course_id == undefined){
		req.flash("error", "Error creating the course");
		return res.redirect(base_url);
	}

	query.insert_program_course(course_id, data.prog_id).then((ok) => {
		req.flash("success", "Course created");
		res.redirect(base_url);
	}).catch((err) => {
		console.log("error: ", err);
		req.flash("error", "Error creating the course");
		return res.redirect(base_url);
	});
});

/*
	--SHOW EDIT ROUTE--
 	GET /courses/:id/edit
*/
router.get('/:id/edit', async function(req, res) {

	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id)){
		req.flash("error", "This course does not exits");
		return res.redirect(base_url);
	}

	let id_course = req.params.id;
	
  	let data = {"from":"COURSE", "where": "course_ID", "id": id_course};
	
	// get course information by id
 	let courses_info = await general_queries.get_table_info_by_id(data).catch((err) => {
		console.log("Error Getting course info: ", err);
		//throw err;
	});

	// validate course 
	if (courses_info == undefined || courses_info.length == 0){
		console.log("There is not information about this course");
		req.flash("error", "This course does not exits");
		return res.redirect("/");
	}
	// We only care about the first position
	courses_info = courses_info[0];
	
	// Get all study program
	let study_programs = await general_queries.get_table_info("STUDY_PROGRAM").catch((err) =>{
		console.log("Error getting study program info: ", err);
	});
	
	// verify study program
	if (study_programs == undefined || study_programs.length == 0){
		console.log("This course do not belong to any study program");
		req.flash("error", "This course does not belong to any study program");
		return res.redirect(base_url);
	}

	// Dynamic frontend vars
	locals.dropdown_options = [];
	locals.have_dropdown = true;
	locals.title_action = "Editing Course";
	locals.dropdown_title = "Study Program";
	locals.dropdown_name = "data[prog_id]";
	locals.btn_title = "Submit";
	locals.url_form_redirect = `/courses/${id_course}?_method=PUT`;

	// Set dropdown data 
	study_programs.forEach( (element) =>{
		locals.dropdown_options.push({
			"ID" : element.prog_ID,
			"NAME": element.prog_name
		});
	});

	// course information for edit
	course = [
		courses_info.course_number,
		courses_info.course_name,
		courses_info.course_description
	];

	// set the ejs data to append
	let index = 0;
	course_create_inputs.forEach((record) =>{
		record.value = course[index];
		index++;
	});

	// append the course information to the EJS
	locals.inputs = course_create_inputs;

	res.render('layout/create', locals);
});

/*
	** EDIT COURSES ** 
	PUT /courses/:id
*/
router.put('/:id', function(req, res) {

	if (req.params.id == undefined || isNaN(req.params.id) || req.body == undefined ||
		req.body.data == undefined){
		req.flash("error", "Cannot find the user");
		return res.redirect(base_url);
	}

		// to validation
	let key_types = {
		"prog_id": 'n',
		"number": 's',
		"name": 's',
		"description": 's'
	}

	// get the course data 
	let data = req.body.data;

	// if the values don't mach the type 
	if (!validate_form(data, key_types)){
		console.log("Error in validation");
		req.flash("error", "Error in the information of the course");
		return res.redirect(base_url);	
	}
	
	data["id"] = req.params.id;

	query.update_course(data);
	req.flash("success", "Course Edited");
	res.redirect(base_url);
});

/*
	--SHOW REMOVE COURSE--
	GET cousers/:id/remove
*/
router.get('/:id/remove', async function (req, res) {

	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id)){
		req.flash("error", "This course don't exits");
		return res.redirect(base_url);
	}

	let course_id = req.params.id;

	// for query
	let data = {"from": "COURSE", "where":"course_ID", "id":course_id, "join": "PROG_COURSE"};
	
	// getting course information from db
	let course = await general_queries.get_table_info_by_id_naturalJoin(data).catch((err) =>{
		console.log("Error getting the course: ", err);
	});

	// validate course
	if (course == undefined || course.length == 0){
		console.log("Course not found");
		return res.redirect(base_url);
	}

	// we only care about the first position
	course = course[0];

	// == variables for dinamic frondend ==
	locals.title_action = "Remove";
	locals.title_message = "Are you sure you want to delete this Course?";
	locals.form_action = `/courses/${course_id}?_method=DELETE`;
	locals.btn_title = "Delete";

	let names = ["Study Program", "Number", "Name", "description"];
	let values = [course.prog_ID, course.course_number, course.course_name, course.course_description];

	let record = [];
	for (let index = 0; index < names.length; index++) {
		record.push({"name": names[index], "value": values[index]})
	}
	// == end ==
	locals.record = record;
	res.render('layout/remove', locals);
});


/*
 	-- DELETE ROUTE -- 
	DELETE /users/:id
*/
router.delete('/:id', async function (req, res) {
	
	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id)){
		req.flash("error", "This course don't exits");
		return res.redirect(base_url);
	}

	let course_id = req.params.id;

	let data = {"id": course_id, "from":"COURSE","where":"course_ID" };

	await general_queries.delete_record_by_id(data).catch((err) =>{
		console.log("Cannot remove the record: ", err);
	});

	req.flash("success", "Course Removed");
	res.redirect(base_url);
});

module.exports = router;