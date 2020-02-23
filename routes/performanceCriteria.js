var express = require('express');
var router = express.Router();
var general_queries = require('../helpers/queries/general_queries');
var queries = require('../helpers/queries/performanceCriteria_queries');

let base_url = '/performanceCriteria';

//Params to routes links
var locals = {
	title: 'ABET Assessment',
	subtitle: 'Perfomance Criteria',
	url_create: "/perfomanceCriteria/create",
	base_url: base_url
};

/*
	GET home page.
*/
router.get('/', async function(req, res) {

	locals.results = [];
	locals.table_header = ["Description", "Order", "outcome", ""];
	
	//Get all perfCrit from the database
	let all_perfomance = await general_queries.get_table_info("perf_criteria").catch((err) => {
		console.log("There is an error getting the Performance Criteria: ", err);
	});

	// Validate data
	if (all_perfomance != undefined && all_perfomance.length > 0){
		let results = [];
		
		all_perfomance.forEach(performance => {			

			results.push({
				"ID": performance["perC_ID"],
				"values": [
					performance["perC_Desk"],
					performance["perC_order"],
					performance["outc_ID"],
					"" // position the buttons of remove, and edit
				]
			});
		});
		locals.results = results;
	}
	res.render('layout/home', locals);
});

/* 
	-- SHOW CREATE PERF CRIT -- 
	GET /performanceCriteria/create
*/

router.get("/create", async function(req, res){
	res.send("WORKING ON IT");
});

/* 
	-- SHOW EDIT PERF CRIT -- 
	GET /performanceCriteria/:id/edit
*/
router.get("/:id/edit", async function(req, res){
	res.send("WORKING ON IT");
});

/* 
	-- SHOW REMOVE PERF CRIT -- 
	GET /performanceCriteria/:id/remove
*/
router.get("/:id/remove", async function(req, res){
	res.send("WORKING ON IT");
});

module.exports = router;
