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

	parms.table_header = ["Name", "Department", "Date", ""];

	if (study_programs != undefined && study_programs.length > 0){
		
		let results = [];
		study_programs.forEach(std_program => {			

			// change date format 
			let date = new Date(std_program.date_created);
			date = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`;
			
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
	let id_stp = req.params.id;

	let data = {"from":"STUDY_PROGRAM", "where":"prog_ID", "id": id_stp};
	
	let std_program_to_edit = await general_queries.get_table_info_by_id(data).catch((err) => {
		console.log("ERROR: ", err);
	})

	if (std_program_to_edit == undefined || std_program_to_edit.length == 0){
		console.log("Cannot found study program");
		req.flash("error", "Cannot find study program");
		return res.redirect(base_url);
	}
	
	let deparments = await general_queries.get_table_info("DEPARTMENT").catch((err) => {
		console.log("Error getting deparments: ", err);
	});

	if (deparments == undefined || deparments.length == 0){
		console.log("Departments not found");
		req.flash("error", "Cannot find any department, Please create one");
		return res.redirect(base_url);
	}
	
	parms.prog_ID = id_stp;
	parms.dpt_results = resutls;
	parms.user_results = user_results[0];
	parms.current_deptID = user_results[0].dep_ID;

	res.render('studyPrograms/editStudyPrograms', parms);
});


/* REMOVE STUDY PROGRAM ROUTE */
router.get('/:id/remove', function (req, res) {
	console.log("REMOVE ROUTE");

	//TODO: catch error in case there is not id
	let stud_id = req.params.id;
	let stud_table = "STUDY_PROGRAM";
	let where_attr = "prog_ID";
	let data = {"from": stud_table,"where":where_attr, "id":stud_id};
	general_queries.get_table_info_by_id(data, function(err, results){

		//TODO: catch erro
		if (err) throw err;
		try {
			parms.prog_ID = results[0].prog_ID;
			parms.prog_name = results[0].prog_name;
			parms.date_created = results[0].date_created;
			res.render('studyPrograms/deleteStudyPrograms', parms);
		} catch (error) {
			res.redirect(base_url);
		}
	});
});

/* 
	DELETE ROUTE 
*/
router.delete('/:id', function (req, res) {
	console.log("===================DELETED ROUTE=====================");

	//TODO: catch error in case of null
	let std_id = req.params.id;
	let table_name = "STUDY_PROGRAM";
	let where_attr = "prog_ID";

	let data = {"id":std_id, "from":table_name,"where":where_attr };

	general_queries.delete_record_by_id(data, function (err, results) {

		//TODO: catch error
		if (err) {
			throw err;
		}
		console.log("STUDY PROGRAM DELETED")
		console.log("===================DELETED ROUTE=====================");
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.redirect("back");
	});
});


/* EDIT home page. */
router.put('/:id', function(req, res, next) {

	//TODO: verify values befero enter to DB
	let name = req.body.data.cname;
	let std_id = req.params.id;
	let dept_id =  req.body.data.dept_id;

	//TIENE QUE IR EN ESTE ORDEN.
	let data = [name, dept_id, std_id];

	query.update_study_program(data, function(err, results){

		//TODO: cath this error
		if (err) throw err;

		console.log("EDITED STUDY PROGRAM");
		res.redirect(base_url);
	});
});

module.exports = router;
