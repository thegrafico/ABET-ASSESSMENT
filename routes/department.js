// dependencies
var express = require('express');
var router = express.Router();
var query = require("../helpers/queries/department_queries");
var general_queries = require("../helpers/queries/general_queries");

// base url
let base_url = '/department'

//Paramns to routes links
let parms = {
	"title": 'ABET Assessment',
	"subtitle": 'Departments',
	"base_url": "/department"
};


/*
 	-- DEPARTMENT home page-- 
	GET /deparment
*/
router.get('/', async function (req, res) {
	
	//Table to look into the database
	let deparment_table = "DEPARTMENT";

	//Getting the information from db
	let all_deparment = await general_queries.get_table_info(deparment_table).catch((err) => {
		console.log("Cannot get deparment information: ", err);
		
		// TODO: flash message with err
		return res.redirect("/");
	});

	parms.results = all_deparment;
	
	res.render('departments/department', parms);

});

/*
	--SHOW Deparment create--
	GET /deparment/create
*/
router.get('/create', function (req, res) {	
	res.render('departments/createDepartment', parms);
});

/* 
	--Create deparment--
	POST /deparment/create
*/
router.post('/create', function (req, res, next) {
	
	//TODO: verify is empty
	var depName = req.body.depName;
	var depDesc = req.body.depDesc;

	//Insert into the DB the data from user
	query.insert_into_deparment([depName, depDesc], function(err, results){

		//TODO: catch error properly
		if (err) throw err;

		console.log("DEPARTMENT INSERTED WITH THE ID: ", results.insertId);

		res.redirect(base_url);
	});
});

/*
	--SHOW REMOVE DEPARMENT
	GET /deparment/:id/remove
*/
router.get('/:id/remove', function (req, res) {

	let tabla_data = {"from": "DEPARTMENT", "where": "dep_ID", "id": req.params.id };

	general_queries.get_table_info_by_id(tabla_data, function (err, results) {
		
		//TODO: catch error
		if (err) throw err;
		
		parms.dep_ID = results[0].dep_ID;
		parms.depName = results[0].dep_name;
		parms.depDesc = results[0].dep_description;
		parms.depDate = results[0].date_created;

		res.render('departments/deleteDepartment', parms);
	});

});

/* 
	-- DELETE DEPARMENT
	DELETE /deparment/:id
*/
router.delete('/:id' , function (req, res, next) {

	let tabla_data = {"from": "DEPARTMENT", "where": "dep_ID", "id": req.params.id };

	general_queries.delete_record_by_id(tabla_data, function(err, results){
		//TODO: catch error
		if (err) throw err;

		console.log("Record delete");
		res.redirect(base_url);
	});
});

/*
	-- SHOW DEPARMENT EDIT--
	GET /deparment/:id/edit
*/
router.get('/:id/edit', function (req, res) {

	let tabla_data = {"from": "DEPARTMENT", "where": "dep_ID", "id": req.params.id };

	general_queries.get_table_info_by_id(tabla_data, function (err, results) {
		
		//TODO: catch error
		if (err) throw err;
		
		parms.dep_ID = results[0].dep_ID;
		parms.depName = results[0].dep_name;
		parms.depDesc = results[0].dep_description;

		res.render('departments/editDepartment', parms);
	});

});

/*
	-- EDIT DEPARMENT EDIT--
	PUT /deparment/:id
*/
router.put('/:id', function (req, res, next) {

	//TODO: validate user data
	let dpt_data = [req.body.depName, req.body.depDesc, req.params.id] 
	
	//Exe the query into the database
	query.update_deparment(dpt_data, function(err, results){
	
		//TODO: catch error
		if (err){
			throw err;
		}

		console.log("USER EDITED!")
		res.redirect(base_url);
	});
});

//===============================================================================

module.exports = router;
