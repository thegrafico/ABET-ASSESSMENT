var express = require('express');
var query = require("../helpers/queries/studyProgramQueries");
var general_queries = require("../helpers/queries/general_queries");
var router = express.Router();
const { study_program_create_input } = require("../helpers/layout_template/create");


const base_url = '/studyprograms'
// let routes_names = ['create', 'delete', 'edit', 'details']

//Paramns to routes links
let parms = {
	"title": "ABET Assessment",
	"subtitle": "Study Programs",
	"base_url": base_url,
	"url_create": "/studyprograms/create"
};

/* 
	-- SHOW HOME PAGE -- 
	GET /studyprograms
*/
router.get('/', async function(req, res) {

	parms.results = [];

	let study_programs = await general_queries.get_table_info("study_program").catch((err) => {
		console.log("ERROR: ", err)
	});

	parms.table_header = ["Name", "Department ID", "Date", ""];

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
					std_program["dep_ID"],
					date,
					"" // position the buttons of remove, and edit
				]
			});
		});
		parms.results = results;
	}
	res.render('layout/home', parms);
});


/* 	
	-- VIEW CREATE STUDY PROGRAM -- 
	GET /studyprograms/create 
*/
router.get('/create', async function(req, res) {

	let deparments = await general_queries.get_table_info("DEPARTMENT").catch((err) => {
		console.log("Error getting deparments: ", err);
	});

	if (deparments == undefined || deparments.length == 0){
		console.log("Departments not found");
		req.flash("error", "Cannot find any department, Please create one");
		return res.redirect(base_url);
	}

	// store all profiles
	parms.profiles = [];
	parms.dropdown_options = [];
	parms.have_dropdown = true;
	parms.dropdown_title = "Study Programs";
	parms.dropdown_name = "department_id";
	parms.title_action = "Create Study Program";
	parms.url_form_redirect = "/studyprograms/create";
	parms.btn_title = "Create";

	// reset value to nothing when creating a new record
	study_program_create_input.forEach((record) =>{
		record.value = "";
	});

	// set the input for user
	parms.inputs = study_program_create_input;

	// for dynamic frontend
	deparments.forEach( (element) =>{
		parms.dropdown_options.push({
			"ID" : element.dep_ID,
			"NAME": element.dep_name
		});
	});

	res.render('layout/create', parms);
});

/* 	
	--CREATE STUDY PROGRAM -- 
	POST /studyprograms/create 
*/
router.post('/create', function(req, res) {

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
		req.flash("error", "Cannot create the study program");
		res.redirect(base_url);
	});
});

/* 
	-- SHOW std_program edit -- 
	GET /studyprograms/:id/id 
*/
router.get('/:id/edit', async function(req, res) {

	// validate id
	let studyp_id = req.params.id;
	
	// store all profiles
	parms.profiles = [];
	parms.dropdown_options = [];
	parms.have_dropdown = true;
	parms.dropdown_title = "Study Programs";
	parms.dropdown_name = "department_id";
	parms.title_action = "Edit Study Program";
	parms.url_form_redirect = `/studyprograms/${studyp_id}?_method=PUT`;
	parms.btn_title = "Edit";
	

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
	parms.inputs = study_program_create_input;

	deparments.forEach( (element) =>{
		parms.dropdown_options.push({
			"ID" : element.dep_ID,
			"NAME": element.dep_name
		});
	});

	res.render('layout/create', parms);
});

/* 
	-- EDIT study program -- 
	PUT /studyprograms/:id 
*/
router.put('/:id', function(req, res, next) {

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
		console.log("Error: ", err);
		req.flash("error", "Cannot edit study program");
		return res.redirect(base_url);
	});
});

/* 
	-- SHOW REMOVE study program -- 
	GET /studyprograms/:id/remove 
*/
router.get('/:id/remove', async function (req, res) {
	// TODO: validate id, if null or not a number 
	let std_program_id = req.params.id;

	// for dynamic design
	parms.title_action = "Remove";
	parms.title_message = "Are you sure you want to delete this Study Program?";
	parms.form_action = `/studyprograms/${std_program_id}?_method=DELETE`;
	parms.btn_title = "Delete";

	let data = {"from":"STUDY_PROGRAM", "where":"prog_ID", "id": std_program_id};
	
	// get std program
	let std_program_to_remove = await general_queries.get_table_info_by_id(data).catch((err) => {
		console.log("ERROR: ", err);
	})

	// validate std program
	if( std_program_to_remove == undefined || std_program_to_remove.length == 0){
		console.log("There is not study program with the id you're looking for");
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
	parms.record = record;

	res.render("layout/remove", parms);
});

/* 
	-- REMOVE study program -- 
	DELETE /studyprograms/:id/remove 
*/
router.delete('/:id', function (req, res) {

	//TODO: Validate
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
