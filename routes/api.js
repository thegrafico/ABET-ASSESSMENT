/*
	ROUTE - /users
*/
var express = require('express');
var router = express.Router();
const api_queries = require("../helpers/queries/api");

/*
	-- GET all performance criteria from rubric -- 
	GET /users
*/
router.get('/evaluationRubric/get/performances/:rubric_id', async function (req, res) {

    // validate if rubric_id is good
	if (req.params.rubric_id == undefined || isNaN(req.params.rubric_id)) {
		return res.end();
	}

	let performances = await api_queries.get_performance_from_rubric(req.params.rubric_id).catch((err) => {
		console.error(err);
	});

	// verify is user data is good
	if (performances == undefined || performances.length == 0) {
		return res.json([]);
	}
	
	res.json(performances);
});

module.exports = router;




