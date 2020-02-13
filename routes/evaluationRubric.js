/* 
	EVALUATION RUBRIC ROUTE
	GET /evaluation
*/
var express = require('express');
var router = express.Router();
var queries = require('../helpers/queries/evaluation_queries');
var general_queries = require('../helpers/queries/general_queries');
// var queries = require('../helpers/queries');

let base_url = '/evaluation'

//Paramns to routes links
let parms = {
	"base_url": base_url,
	"title": 'ABET Assessment',
	"subtitle": 'Evaluation',
	"base_url": "/evaluation",
	"url_create": "/evaluation/create"
};

/* 	
	-- SHOW all evaluation -- 
	GET /evaluation
*/
router.get('/', async function(req, res) {

	parms.results = [];
	parms.current_outName = null;
	parms.create = "/evaluation/create";

	//Get all perfCrit from the database (callback)
	let stud_outcomes = await general_queries.get_table_info("STUDENT_OUTCOME").catch((err) => {
		console.log("Error getting student outcomes: ", err);
	});

	// Validate data
	if (stud_outcomes != undefined && stud_outcomes.length > 0){
		parms.resultsF = stud_outcomes;
	}

	console.log("OUTCOMES: ", stud_outcomes);

	res.render('evaluations/evaluation', parms);
});

/* POST home page. */
router.post('/', function(req, res, next) {
	try{

		let performance_table = 'STUDENT_OUTCOME';

		//Get all perfCrit from the database (callback)
		general_queries.get_table_info(performance_table, function (err, results) {

			//TODO: redirect user to another page
			if (err) {
				//HERE HAS TO REDIRECT the user or send a error message
				throw err;
			}

			//IF found results from the database
			if (results) {
				// console.log(results)
				parms.resultsF = results;
				let data = {
					"from": "EVALUATION_RUBRIC",
					"where": "outc_ID",
					"id": req.body.outc_ID
				};

				general_queries.get_table_info_by_id(data, function (err, results) {

					parms.results = results;

					parms.current_outcID = req.body.outc_ID;

					let data2 = {
						"from" : "STUDENT_OUTCOME",
						"where": "outc_ID",
						"id"   : parms.current_outcID
					};

					console.log(data);

					general_queries.get_table_info_by_id(data2, function (err, results) {

						parms.current_outName = results[0].outc_name;
						console.log(parms);
						res.render('evaluations/evaluation', parms);
					});
				});
			}
		});
	}
	catch (error) {

		//TODO: send a error message to the user.
		console.log(error);
		res.render('evaluations/evaluation', parms);
	}
});

/*
	-- SHOW EVALUATION --
	GET evaluation/create
*/
router.get('/create', function(req, res, next) {
	try{
		let evaluation_table = 'STUDENT_OUTCOME';

		//Get all perfCrit from the database (callback)
		general_queries.get_table_info(evaluation_table, function (err, results) {

			//TODO: redirect user to another page
			if (err) {
				//HERE HAS TO REDIRECT the user or send a error message
				throw err;
			}

			//IF found results from the database
			if (results) {
				// console.log(results)
				parms.results = results;
			}

			res.render('evaluations/createEvaluation', parms);
		});
	}
	catch (error) {
		//TODO: send a error message to the user.
		console.log(error);
		res.render('evaluations/createEvaluation', parms);
	}
});

router.get('/create/:id', function(req, res, next) {
	try {

		// sending the outc id to the post method
		parms.id = req.params.id;

		let data = {
			"from": "PERF_CRITERIA",
			"where": "outc_ID",
			"id": req.params.id
		};

		let data2 = {
			"from": "STUDENT_OUTCOME",
			"where": "outc_ID",
			"id": req.params.id
		};

		//Insert all data to the database (callback)
		general_queries.get_table_info_by_id(data, function (err, results) {

			parms.resultsPC = results;

			//TODO: redirect user to another page
			if (err) {
				//HERE HAVE TO REDIRECT the user or send a error message
				throw err;
			}

			general_queries.get_table_info_by_id(data2, function (err, results) {

				parms.current_outName = results[0].outc_name;

				res.render('evaluations/createEvaluation', parms);
				});
		});
	}

	catch (error) {
		//TODO: send a error message to the user.
		console.log(error);
		res.reder('evaluations/createEvaluation', parms);
	}
});


router.post('/create/:id', function(req, res, next) {
	try {

		console.log("Performance Criteria Selected", req.body.perfIDs);
		console.log("req.body", req.params.id);

		let data = [req.body.eval_name, req.body.eval_decription, req.params.id];

		//Insert all data to the database (callback)
		queries.insert_evalRub(data, function (err, results) {

			// TODO: redirect user to another page
			if (err) {
				//HERE HAVE TO REDIRECT the user or send a error message
				throw err;
			}

			let perfIDs = req.body.perfIDs;

			for (var i = 0; i < perfIDs.length; i++){

				let data2 = [results.insertId, perfIDs[i]];

				queries.insert_evalRubPerfCrit(data2, function (err, results) {

					// TODO: redirect user to another page
					if (err) {
						//HERE HAVE TO REDIRECT the user or send a error message
						throw err;
					}
					// console.log(results);
					console.log("Rubric Created");

					});
				}
				res.redirect('/evaluation');
		});
	}
	catch (error) {
		//TODO: send a error message to the user.
		console.log(error);
		res.redirect('/evaluation');
	}
});


/* DELETE home page. */
router.get('/:id/delete', function(req, res, next) {
	try {

		let data = {
			"from": "EVALUATION_RUBRIC",
			"where": "rubric_ID",
			"id": req.params.id
		};

		//Insert all data to the database (callback)
		general_queries.get_table_info_by_id(data, function (err, results) {

			parms.Name = results[0].rubric_name;
			parms.Description = results[0].rubric_description;
			parms.StudentOutcome = results[0].outc_ID;

			//TODO: redirect user to another page
			if (err) {
				//HERE HAVE TO REDIRECT the user or send a error message
				throw err;
			}

			// console.log(results);
			console.log("Rubric Created");
			res.render('evaluations/deleteEvaluation', parms);
		});
	}
	catch (error) {
		//TODO: send a error message to the user.
		console.log(error);
		res.render('evaluations/deleteEvaluation', parms);
	}
});

router.delete('/:id/delete', function(req, res, next) {
	try {

		let data = {
			"from": "EVALUATION_RUBRIC",
			"where": "rubric_ID",
			"id": req.params.id
		};

		//Insert all data to the database (callback)
		general_queries.delete_record_by_id(data, function (err, results) {

			//TODO: redirect user to another page
			if (err) {
				//HERE HAVE TO REDIRECT the user or send a error message
				throw err;
			}

			// console.log(results);
			console.log("Rubric Created");
			res.redirect('/evaluation');
		});
	}
	catch (error) {
		//TODO: send a error message to the user.
		console.log(error);
		res.redirect('/evaluation');
	}
});


/* EDIT home page. */
router.get('/:id/edit', function(req, res, next) {
	try {

		let data = {
			"from": "EVALUATION_RUBRIC",
			"where": "rubric_ID",
			"id": req.params.id
		};

		//Insert all data to the database (callback)
		general_queries.get_table_info_by_id(data, function (err, results) {

			parms.rubric_name = results[0].rubric_name;
			parms.rubric_description = results[0].rubric_description;
			parms.current_outID = results[0].outc_ID;

			let data = "STUDENT_OUTCOME";

			general_queries.get_table_info(data, function (err, results) {

				parms.outc_ID = results;

				if (err) {
					//HERE HAVE TO REDIRECT the user or send a error message
					throw err;
				}

				// let data = {
				//   "from": "STUDENT_OUTCOME",
				//   "where": "outc_ID",
				//   "id": parms.current_outID
				// };
				//
				// general_queries.get_table_info_by_id(data, function (err, results) {
				//
				//     console.log("HERE", data, results);
				//     parms.current_outName = results[0].outc_name;

					res.render('evaluations/editEvaluation', parms);
				// });
			});
		});
	}
	catch (error) {
		//TODO: send a error message to the user.
		console.log(error);
		res.render('evaluations/editEvaluation', parms);
	}
});

router.put('/:id/edit', function(req, res, next) {
	try {

		let newInfo = [req.body.rubric_name, req.body.rubric_description,
									req.body.outc_ID, req.params.id];

		//Insert all data to the database (callback)
		queries.update_evalRub(newInfo, function (err, results) {

			//TODO: redirect user to another page
			if (err) {
				//HERE HAVE TO REDIRECT the user or send a error message
				throw err;
			}

			// console.log(results);
			console.log("Rubric Updated");
			res.redirect('/evaluation');
		});
	}
	catch (error) {
		//TODO: send a error message to the user.
		console.log(error);
		res.redirect('/evaluation');
	}
});

module.exports = router;
