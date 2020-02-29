/** 
 * Author: Raul Pichardo
 * 
 * Class Description: middleware to validate the outcome
*/
var general_queries = require('../helpers/queries/general_queries');
var { db } = require("../helpers/mysqlConnection"); //pool connection
conn = db.mysql_pool;


/**
 * validate_outcome validate the outcomes
 * @return {Void}
 */
async function validate_outcome(req, res, next){
    	
	if (req.params.outc_id == undefined || isNaN(req.params.outc_id)){
		req.flash("error", "Cannot find the outcome");
		return res.redirect(base_url);
	}

	let outcome_query = {
		"from": "student_outcome".toUpperCase(),
		"join": "study_program".toUpperCase(),
		"using": "prog_ID",
		"where": "outc_ID",
		"id": req.params.outc_id 
	};
	
	let outcome = await general_queries.get_table_info_inner_join_by_id(outcome_query).catch((err) =>{
		console.log("Error finding the outcome: ", err);
	});

	if (outcome == undefined || outcome.length == 0){
		req.flash("error", "Outcome does not exits");
		return res.redirect("/outcomes");
    }

    req.body.outcome = outcome[0];
    next();
}

async function validate_performance_criteria(req, res, next){
    	
	if (req.params.perf_id == undefined || isNaN(req.params.perf_id)){
		req.flash("error", "Cannot find the Performance Criteria");
		return res.redirect(base_url);
	}

	let rubric_query = {
		"from": "perf_criteria".toUpperCase(),
		"where": "perC_ID",
		"id": req.params.perf_id 
	};
	
	let rubric = await general_queries.get_table_info_by_id(rubric_query).catch((err) =>{
		console.log("Error finding the outcome: ", err);
	});

	if (rubric == undefined || rubric.length == 0){
		req.flash("error", "Evaluation Rubric does not exits");
		return res.redirect("/outcomes");
    }

    req.body.rubric = rubric[0];
    next();
}

async function validate_evaluation_rubric(req, res, next){
    
    if (req.params.r_id == undefined || isNaN(req.params.r_id)){
		req.flash("error", "Cannot find the outcome evaluation rubric");
		return res.redirect(base_url);
    }
    
    let rubric_query = {
		"from": "evaluation_rubric".toUpperCase(),
		"where": "rubric_ID",
		"id": req.params.r_id,
	};
	
	let rubric = await general_queries.get_table_info_by_id(rubric_query).catch((err) =>{
		console.log("Error finding the outcome rubric: ", err);
	});

	if (rubric == undefined || rubric.length == 0){
        req.flash("error", "Evaluation rubric does not exits");
		return res.redirect(`/outcomes/${req.params.id}/evaluationrubric`);
    }

    // getting the name of the outcome
    req.body["rubric"] = rubric;
    
    next();
}
// Returns 
module.exports.validate_outcome = validate_outcome;
module.exports.validate_evaluation_rubric = validate_evaluation_rubric;
module.exports.validate_performance_criteria = validate_performance_criteria;


