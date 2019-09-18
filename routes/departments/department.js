//Variables and queries to use
var express = require('express');
var router = express.Router();
var query = require("../../helpers/queries/department_queries");
var general_queries = require("../../helpers/queries/general_queries");

//Routing for CRUD
let base_url = '/department/'
let routes_names = ['create', 'delete', 'edit', 'details']

//Paramns to routes links
let parms = {};

//Populate parms
routes_names.forEach(e => {
	parms[e] = base_url + e;
});
//Same title for every department route??
parms["title"] = 'ABET Assessment';
//============================================ DEPARMENT MAIN ROUTE =============================

/* DEPARTMENT home page. */
router.get('/', function (req, res, next) {
	
	//Table to look into the database
	let deparment_table = "DEPARTMENT";

	//Getting the information from db
	general_queries.get_table_info(deparment_table, function (err, results) {
		
		//TODO: redirect user to another route or send messsage to the user
		if(err) throw err;

		// console.log("DEBUG: ", results)
		parms.results = results;
		
		res.render('departments/department', parms);
	});

});
//===================================CREATE DEPARTMENT=====================================

// GET
router.get('/' + routes_names[0], function (req, res) {	
		res.render('departments/createDepartment', parms);
});

// POST
router.post('/' + routes_names[0], function (req, res, next) {
	
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
//===================================DELETE DEPARTMENT=====================================

// GET
router.get('/:id/' + routes_names[1], function (req, res, next) {


	let tabla_data = {"table_name": "DEPARTMENT", "atribute": "dep_ID", "id": req.params.id };

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

// DELETE
router.delete('/:id' , function (req, res, next) {

	let tabla_data = {"table_name": "DEPARTMENT", "atribute": "dep_ID", "id": req.params.id };

	general_queries.delete_record_by_id(tabla_data, function(err, results){
		//TODO: catch error
		if (err) throw err;

		console.log("Record delete");
		res.redirect(base_url);
	});
});
//================================== EDIT ROUTE=============================================

/* GET */
router.get('/:id/' + routes_names[2], function (req, res, next) {

	let tabla_data = {"table_name": "DEPARTMENT", "atribute": "dep_ID", "id": req.params.id };

	general_queries.get_table_info_by_id(tabla_data, function (err, results) {
		
		//TODO: catch error
		if (err) throw err;
		
		parms.dep_ID = results[0].dep_ID;
		parms.depName = results[0].dep_name;
		parms.depDesc = results[0].dep_description;

		res.render('departments/editDepartment', parms);
	});

});

/* EDIT */
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


/* DETAILS home page. */
router.get('/' + routes_names[3], function (req, res, next) {
	res.render('departments/detailDepartment', parms);
});



module.exports = router;
