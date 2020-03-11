var express = require('express');
var query = require("../helpers/queries/studyProgramQueries");
var general_queries = require("../helpers/queries/general_queries");
var router = express.Router();
const { study_program_create_input } = require("../helpers/layout_template/create");
var { validate_form } = require("../helpers/validation");


// for redirtect
const base_url = '/admin/studyprograms';

//Paramns to routes links
let locals = {
	"title": "ABET Assessment",
	"subtitle": "Study Programs",
	"base_url": base_url,
	"url_create": `${base_url}/create`,
	"form_id": "std_data",
	"api_get_url": base_url,
	delete_redirect: null,
	dropdown_option_selected: null,
	filter:true,
	filter_title: "-- Department --",
	feedback_message: "Number of Study Programs: ",

};

/* 
	-- SHOW HOME PAGE -- 
	GET /studyprograms
*/
router.get('/', async function(req, res) {

	// Breadcrum for web
	locals.breadcrumb = [
		{"name": "Study Programs", "url": base_url},
		// {"name": "Edit", "url": ".", "active": true}
	];

	locals.results = [];
	let all_std_query = {
		"from": "DEPARTMENT",
		"join": "STUDY_PROGRAM",
		"using": "dep_ID",
	}

	let study_programs = await general_queries.get_table_info_inner_join(all_std_query).catch((err) => {
		console.log("ERROR: ", err)
	});

	// Departments
	let departments = await general_queries.get_table_info("DEPARTMENT").catch((err) => {
		console.error("ERROR GETTING DEPARTMENTS: ", err);
	});

	if (departments != undefined && departments.length > 0){

		locals.filter_value = departments.map( each => each.dep_name);
	}

	locals.table_header = ["Name", "Department", "Date", ""];

	if (study_programs != undefined && study_programs.length > 0){
		
		let results = [];
		study_programs.forEach(std_program => {			

			// change date format 
			let date = new Date(std_program.date_created);
			date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

			results.push({
				"ID": std_program["prog_ID"],
				"values": [
					std_program["prog_name"],
					std_program["dep_name"],
					date,
					"" // position the buttons of remove, and edit
				]
			});
		});
		locals.results = results;
	}
	res.render('admin/layout/home', locals);
});


/* 	
	-- VIEW CREATE STUDY PROGRAM -- 
	GET /studyprograms/create 
*/
router.get('/create', async function(req, res) {

	// Breadcrum for web
	locals.breadcrumb = [
		{"name": "Study Programs", "url": base_url},
		{"name": "Create", "url": "."}
	];

	let deparments = await general_queries.get_table_info("DEPARTMENT").catch((err) => {
		console.log("Error getting deparments: ", err);
	});

	if (deparments == undefined || deparments.length == 0){
		console.log("Departments not found");
		req.flash("error", "Cannot find any department, Please create one");
		return res.redirect(base_url);
	}

	// store all profiles
	locals.profiles = [];
	locals.dropdown_options = [];
	locals.have_dropdown = true;
	locals.dropdown_title = "Departments";
	locals.dropdown_name = "department_id";
	locals.title_action = "Create Study Program";
	locals.url_form_redirect = `${base_url}/create`;
	locals.btn_title = "Create";

	// reset value to nothing when creating a new record
	study_program_create_input.forEach((record) =>{
		record.value = "";
	});

	// set the input for user
	locals.inputs = study_program_create_input;

	// for dynamic frontend
	deparments.forEach( (element) =>{
		locals.dropdown_options.push({
			"ID" : element.dep_ID,
			"NAME": element.dep_name
		});
	});

	res.render('admin/layout/create', locals);
});

/* 	
	--CREATE STUDY PROGRAM -- 
	POST /studyprograms/create 
*/
router.post('/create', function(req, res) {

	// validate body
	if (req.body == undefined){
		req.flash("error", "Error in the course data");
		return res.redirect(base_url);
	}

	// to validation
	let key_types = {
		"std_name": 's',
		"department_id": 'n'
	}

	// if the values don't mach the type 
	if (!validate_form(req.body, key_types)){
		console.log("Error in validation");
		req.flash("error", "Error in the information of the course");
		return res.redirect(base_url);	
	}
	
	// validate req.body
	let std_to_update = {
		"name": req.body.std_name,
		"department_id": req.body.department_id 
	}
	
	// create in db
	query.insert_into_study_program(std_to_update).then((ok) => {
		req.flash("success", "Study program created");
		res.redirect(base_url);
	}).catch((err) =>{

		if (err.code == "ER_DUP_ENTRY")
			req.flash("error", "Study Program already exist");
		else
			req.flash("error", "Cannot create the study program");
			
		res.redirect(base_url);
	});
});

/* 
	-- SHOW std_program edit -- 
	GET /studyprograms/:id/id 
*/
router.get('/:id/edit', async function(req, res) {

	
	// Breadcrum for web
	locals.breadcrumb = [
		{"name": "Study Programs", "url": base_url},
		{"name": "Edit", "url": "."}
	];

	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id)){
		req.flash("error", "This Study program does not exits");
		return res.redirect(base_url);
	}

	// validate id
	let studyp_id = req.params.id;
	
	// store all profiles
	locals.profiles = [];
	locals.dropdown_options = [];
	locals.have_dropdown = true;
	locals.dropdown_title = "Department";
	locals.dropdown_name = "department_id";
	locals.title_action = "Edit Study Program";
	locals.url_form_redirect = `${base_url}/${studyp_id}?_method=PUT`;
	locals.btn_title = "Edit";
	

	let data = {"from":"STUDY_PROGRAM", "where":"prog_ID", "id": studyp_id};
	
	let std_program_to_edit = await general_queries.get_table_info_by_id(data).catch((err) => {
		console.log("ERROR: ", err);
	})

	if (std_program_to_edit == undefined || std_program_to_edit.length == 0){
		console.log("Cannot found study program");
		req.flash("error", "Cannot find study program");
		return res.redirect(base_url);
	}

	std_program_to_edit = std_program_to_edit[0];
	
	let deparments = await general_queries.get_table_info("DEPARTMENT").catch((err) => {
		console.log("Error getting deparments: ", err);
	});

	if (deparments == undefined || deparments.length == 0){
		console.log("Departments not found");
		req.flash("error", "Cannot find any department, Please create one");
		return res.redirect(base_url);
	}

	let std_progran = [
		std_program_to_edit.prog_name,
		"" //description
	]

	let index = 0;
	study_program_create_input.forEach((record) =>{
		record.value = std_progran[index];
		index++;
	});
	locals.inputs = study_program_create_input;

	deparments.forEach( (element) =>{
		locals.dropdown_options.push({
			"ID" : element.dep_ID,
			"NAME": element.dep_name
		});
	});

	locals.dropdown_option_selected = std_program_to_edit.dep_ID;

	res.render('admin/layout/create', locals);
});

/* 
	-- EDIT study program -- 
	PUT /studyprograms/:id 
*/
router.put('/:id', function(req, res) {

	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id) || req.body == undefined){
		req.flash("error", "This Study program does not exits");
		return res.redirect(base_url);
	}

	// to validation
	let key_types = {
		"std_name": 's',
		"department_id": 'n'
	}

	// if the values don't mach the type 
	if (!validate_form(req.body, key_types)){
		console.log("Error in validation");
		req.flash("error", "Error in inputs");
		return res.redirect("back");	
	}

	// TODO: validate id
	let stdp_id = req.params.id;

	let data = {
		"name": req.body.std_name,
		"program_id": stdp_id,
		"department_id": req.body.department_id
	};

	query.update_study_program(data).then((ok) => {
		req.flash("success", "Study Program edited");
		return res.redirect(base_url);
	}).catch((err) => {
		
		if (err.code == "ER_DUP_ENTRY")
			req.flash("error", "Study Program already exist");
		else
			req.flash("error", "Cannot Edit the study program");
			
		return res.redirect(base_url);
	});
});

/* 
	-- API TO GET study program by ID-- 
	GET /studyprograms/:id/remove 
*/
router.get('/get/:id', async function (req, res) {

	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id)){
		req.flash("error", "This Study program does not exits");
		return res.redirect("back");
	}

	let std_program_id = req.params.id;

	let data = {"from":"STUDY_PROGRAM", "where":"prog_ID", "id": std_program_id};
	
	// get std program
	let std_program_to_remove = await general_queries.get_table_info_by_id(data).catch((err) => {
		console.log("ERROR: ", err);
	})

	// validate std program
	if( std_program_to_remove == undefined || std_program_to_remove.length == 0){
		req.flash("error", "Cannot find study program, Please create one");
		return res.redirect(base_url);
	}
	std_program_to_remove = std_program_to_remove[0];

	let date = new Date(std_program_to_remove.date_created);
	date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
	
	// header of inputs
	let names = ["Name", "Department", "Date created"];
	let values = [ std_program_to_remove.prog_name, std_program_to_remove.dep_ID, date];

	let record = [];
	for (let index = 0; index < names.length; index++)
		record.push({"name": names[index], "value": values[index]})

	res.json(record);
});



/* 
	-- REMOVE study program -- 
	DELETE /studyprograms/:id/remove 
*/
router.delete('/:id', function (req, res) {
	
	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id)){
		req.flash("error", "This Study program does not exits");
		return res.redirect(base_url);
	}

	let std_id = req.params.id;

	let data = {"id":std_id, "from":"STUDY_PROGRAM","where":"prog_ID" };

	general_queries.delete_record_by_id(data).then((ok) => {
		req.flash("success", "Study Program removed");
		res.redirect(base_url);
	}).catch((err) => {
		console.log("Error:", err);
		req.flash("error", "Cannot remove Study Program");
		res.redirect(base_url);
	});
});




module.exports = router;
