var express = require('express');
var query = require("../helpers/queries/course_queries");
var general_queries = require("../helpers/queries/general_queries");
var roolback_queries = require("../helpers/queries/roolback_queries");
var router = express.Router();
const { course_create_inputs } = require("../helpers/layout_template/create");
var { validate_form, split_and_filter, get_data_for_update } = require("../helpers/validation");


// var authHelper = require('../helpers/auth');

const base_url = '/courses'
let locals = {
	"title": 'ABET Assessment',
	"base_url":base_url,
	"subtitle": 'Courses',
	"url_create": "/courses/create",
	"form_id": "course_data",
};

/*
	--HOME PAGE--
	GET /courses
*/
router.get('/', async function(req, res) {

	locals.table_header = ["Course Name", "Course Number", "Study Program", "Date Created", ""];
	locals.results = [];
	
	let courses = await query.get_course_with_std_program().catch((err) =>{
		console.log("Error getting the courses with std program results: ", err);
	});

	let results = [];
	if (courses != undefined && Object.keys(courses).length > 0 ){
		
		for (let key in courses){

			// change date format 
			let date = new Date(courses[key].date_created);
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
	locals.url_form_redirect = "/courses/create";
	locals.btn_title = "Create";

	let all_study_program =  await general_queries.get_table_info("STUDY_PROGRAM").catch((err)=>{
		console.log("Error getting the programs: ", err);
	});

	// Validate study program
	if (all_study_program == undefined || all_study_program.length == 0){
		console.log("NOT study programn found");
		// Flash message ERROR
		return res.redirect("/");
	}
	
	locals.study_programs = [];
	locals.selected = [];

	all_study_program.forEach( (element) =>{
		locals.study_programs.push({
			label: element.prog_name,
			value: element.prog_ID.toString()
		});
	});

	// reset value to nothing when creating a new record
	course_create_inputs.forEach((record) =>{
		record.value = "";
	});

	locals.inputs = course_create_inputs;
	  
	res.render('course/create_edit', locals);
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

	req.body.data["study_programs"] = req.body.user_selection;
	// to validation
	let key_types = {
		"number": 's',
		"name": 's',
		"description": 's',
		"study_programs": 's',
	};

	let data = req.body.data;

	// if the values don't mach the type 
	if (!validate_form(data, key_types)){
		console.log("Error in validation");
		req.flash("error", "Error in the information of the course");
		return res.redirect("back");	
	}

	data["study_programs"] = split_and_filter(data["study_programs"], ",") 

	roolback_queries.create_course(data).then((ok) => {
		req.flash("success", "Course created");
		res.redirect(base_url);
	}).catch((err) =>{
		console.log("ERROR: ", err);
		req.flash("error", "Error creating the course, Contact the Admin");
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

	// Dynamic frontend vars
	let id_course = req.params.id;
	locals.dropdown_options = [];
	locals.have_dropdown = true;
	locals.title_action = "Editing Course";
	locals.dropdown_title = "Study Program";
	locals.dropdown_name = "data[prog_id]";
	locals.btn_title = "Submit";
	locals.url_form_redirect = `/courses/${id_course}?_method=PUT`;
	locals.study_programs = [];
	locals.selected = [];

  	let data = {"from":"COURSE", "where": "course_ID", "id": id_course};
	
	// get course information by id
 	let courses_info = await general_queries.get_table_info_by_id(data).catch((err) => {
		console.log("Error Getting course info: ", err);
		//throw err;
	});

	// validate course 
	if (courses_info == undefined || courses_info.length == 0){
		req.flash("error", "This course does not exits");
		return res.redirect("/");
	}
	// We only care about the first position
	courses_info = courses_info[0];
	
	// Get all study program
	let all_study_program = await general_queries.get_table_info("STUDY_PROGRAM").catch((err) =>{
		console.log("Error getting study program info: ", err);
	});
	
	// verify study program
	if (all_study_program == undefined || all_study_program.length == 0){
		console.log("This course do not belong to any study program");
		req.flash("error", "This course does not belong to any study program");
		return res.redirect(base_url);
	}

	let course_study_program = await query.get_study_program_for_course(id_course).catch((err) => {
		console.log("Error getting the course: ", err);
	});

	locals.selected = course_study_program;

	all_study_program.forEach( (element) =>{
		locals.study_programs.push({
			label: element.prog_name,
			value: element.prog_ID.toString()
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

	res.render('course/create_edit', locals);
});

/*
	** EDIT COURSES ** 
	PUT /courses/:id
*/
router.put('/:id', async function(req, res) {

	if (req.params.id == undefined || isNaN(req.params.id) || req.body == undefined ||
		req.body.data == undefined){
		req.flash("error", "Cannot find the user");
		return res.redirect(base_url);
	}

	// if the user remove all options
	if (req.body.user_selection == ","){
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
	if (!validate_form(data, key_types)){
		console.log("Error in validation");
		req.flash("error", "Error in the information of the course");
		return res.redirect("back");	
	}

	if (req.body.user_selection == undefined || req.body.user_selection.length == 0 || req.body.user_selection == ""){
		req.body.user_selection = req.body.selected;
	}
	let current_study_program = split_and_filter(req.body.selected, ",");
	let expected_study_program = split_and_filter(req.body.user_selection, ",");

	let study_program_for_update = get_data_for_update(current_study_program, expected_study_program);
	// console.log(study_program_for_update);

	// remove element if there is any
	if (study_program_for_update["delete"].length > 0){
		
		await query.remove_program_course(course_id, study_program_for_update["delete"]).catch((err) =>{
			console.log("There is an error removing: ", err);
			throw err;
		});
	}

	// remove element if there is any
	if (study_program_for_update["insert"].length > 0){
		await query.insert_program_course(course_id, study_program_for_update["insert"]).catch((err) =>{
			console.log("There is an error Updating: ", err);
			throw err;
		});
	}

	query.update_course(data).then((ok) => {
		req.flash("success", "Course Edited");
		res.redirect(base_url);
	}).catch((err) =>{
		console.log(err);
		req.flash("error", "Cannot update the course");
		res.redirect(base_url);
	});
	
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