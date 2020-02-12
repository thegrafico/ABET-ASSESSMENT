// dependencies
var express = require('express');
var router = express.Router();
var query = require("../helpers/queries/department_queries");
var general_queries = require("../helpers/queries/general_queries");
const { department_create_inputs } = require("../helpers/layout_template/create");

// base url
let base_url = '/department'

//Paramns to routes links
let parms = {
	"title": 'ABET Assessment',
	"subtitle": 'Departments',
	"base_url": "/department",
	"url_create": "/department/create"
};
/*
 	-- DEPARTMENT home page-- 
	GET /deparment
*/
router.get('/', async function (req, res) {
	
	//Getting the  DEPARTMENT information from db
	let all_deparment = await general_queries.get_table_info("DEPARTMENT").catch((err) => {
		console.log("Cannot get deparment information: ", err);
		
		// TODO: flash message with err
		return res.redirect("/");
	});

	parms.table_header = ["Name", "Description", "Date Created", ""];
	let results = [];

	// Validate department 
	if (all_deparment != undefined && all_deparment.length > 0){
		
		all_deparment.forEach(deparment => {
			
			// change date format 
			let date = new Date(deparment.date_created);
			date = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`;
			
			results.push({
				"ID": deparment.dep_ID,
				"values": [
					deparment.dep_name,
					deparment.dep_description,
					date,
					" "
				]
			});
		});
	}
	parms.results = results;
	res.render('layout/home', parms);
});

/*
	--SHOW Deparment create--
	GET /deparment/create
*/
router.get('/create', function (req, res) {	

	parms.have_dropdown = false;
	parms.title_action = "Create Department";
	parms.dropdown_options = [];
	parms.dropdown_title = "Study Program";
	parms.dropdown_name = "data[prog_id]";
	parms.form_method = "POST";
	parms.url_form_redirect = "/department/create";
	parms.btn_title = "Create";

	// reset value to nothing when creating a new record
	department_create_inputs.forEach((record) =>{
		record.value = "";
	});

	parms.inputs = department_create_inputs;

	res.render('layout/create', parms);
});

/* 
	--Create deparment--
	POST /deparment/create
*/
router.post('/create', function (req, res, next) {
	
	// TODO: verify is empty or string
	var depName = req.body.depName;
	var depDesc = req.body.depDesc;

	// Insert into the DB the data from user
	query.insert_into_deparment([depName, depDesc]).then((was_edit) =>{
		console.log("Department was created");
		// TODO: flash message [OK]
		res.redirect(base_url);

	}).catch((err) =>{
		// flash message [ERRO]
		console.log("Error: ", err);
		res.redirect("/");
	});
});

/*
	-- SHOW DEPARMENT EDIT--
	GET /deparment/:id/edit
*/
router.get('/:id/edit', async function (req, res) {
	
	// TODO: validate dept_id
	let dept_id = req.params.id;

	let tabla_data = {"from": "DEPARTMENT", "where": "dep_ID", "id":  dept_id};

	let dept_data = await general_queries.get_table_info_by_id(tabla_data).catch((err) => {
		console.log("Error: ", err);
	});

	// validate data
	if (dept_data == undefined ||  dept_data.length == 0){
		console.log("Cannot find this department");
		return res.redirect("/");
	}

	// We only care about the first one
	dept_data = dept_data[0];

	dept = [
		dept_data.dep_name,
		dept_data.dep_description
	];

	let index = 0;
	department_create_inputs.forEach((record) =>{
		record.value = dept[index];
		index++;
	});

	parms.url_form_redirect = `/department/${dept_id}?_method=PUT`;
	parms.have_dropdown = false;
	parms.title_action = "Editing Department";
	parms.btn_title = "Submit";
	parms.inputs = department_create_inputs;

	res.render('layout/create', parms);
});

/*
	-- EDIT DEPARMENT--
	PUT /deparment/:id
*/
router.put('/:id', function (req, res, next) {

	//TODO: validate user data
	let dpt_data = [req.body.depName, req.body.depDesc, req.params.id] 
	
	//Exe the query into the database
	query.update_deparment(dpt_data).then((ok) => {
		console.log("Department EDITED!");
		// TODO: flash message [SUCCESS]
		res.redirect(base_url);
	}).catch((err) => {
		console.log("ERROR: ", err);
		// TODO: flash message [ERROR];
		res.redirect("/");
	});		
});


/*
	--SHOW REMOVE DEPARMENT
	GET /deparment/:id/remove
*/
router.get('/:id/remove', async function (req, res) {

	// TODO: validate id
	let dept_id =  req.params.id ;

	let tabla_data = {"from": "DEPARTMENT", "where": "dep_ID", "id":dept_id};
	
	let department =  await general_queries.get_table_info_by_id(tabla_data).catch((err) =>{
		console("ERROR: ", err);
	});

	if( department == undefined || department.length == 0){
		console.log("There is not deparment with the id you're looking for");
		return res.redirect(base_url);
	}

	// we only care about the first element
	department = department[0];

	// change date format 
	let date = new Date(department.date_created);
	date = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`;
	
	let names = ["Name", "Description", "Date"];
	let values = [ department.dep_name, department.dep_description, date];

	let record = [];
	for (let index = 0; index < names.length; index++)
		record.push({"name": names[index], "value": values[index]})
	parms.record = record;
	
	// dynamic frontend
	parms.title_action = "Remove";
	parms.title_message = "Are you sure you want to delete this department?";
	parms.form_action = `/department/${dept_id}?_method=DELETE`;
	parms.btn_title = "Delete";

	res.render('layout/remove', parms);
});

/* 
	-- DELETE DEPARMENT
	DELETE /deparment/:id
*/
router.delete('/:id' , function (req, res, next) {

	let tabla_data = {"from": "DEPARTMENT", "where": "dep_ID", "id": req.params.id };

	general_queries.delete_record_by_id(tabla_data).then((was_deleted) => {
		console.log("Record delete");
		// TODO: flash success 
		res.redirect(base_url);
	}).catch((err) => {
		console.log("ERROR: ", err);
		// TODO: flash error 
		res.redirect("/");		
	});		
});

module.exports = router;
