var express = require('express');
var router = express.Router();
var general_queries = require('../../helpers/queries/general_queries');
var queries = require('../../helpers/queries/perfTable_queries');
var middleware = require('../../middleware/validate_assessment')
var assessment_query = require("../../helpers/queries/assessment.js");
var { validate_form, get_performance_criteria_results, getNumbersOfRows } = require("../../helpers/validation");
var { insertStudentScores } = require("../../helpers/queries/roolback_queries");
const { admin, coordinator, assessmentStatus, statusOfAssessment} = require("../../helpers/profiles");

/* GLOBAL LOCALS */
const base_url = '/professor';
let locals = {
	base_url: base_url,
	title: 'ABET Assessment',
	homeURL: base_url,
	form_action: "/"
};

/**
 * GET - view professor's assessments
 * GET /professor/coordinator/
 */
router.get('/', async function (req, res) {

    locals.title = "Professor";       
	locals.assessment_in_progress = [];
	locals.assessment_completed = [];
	locals.assessment_archive = []


	// the user id is stored in session, thats why user need to be login
    let user_id = req.session.user_id;
    
    // get professors assessments
    let assessments = await assessment_query.get_professors_assessments(user_id).catch((err) => {
        console.error("Error getting assessments: ", err);
    });

    if (assessments != undefined || assessments.length > 0){
        
        assessments.map((each) => {

            // format status
            each.status = {class: each.status,  name: assessmentStatus[each.status]["name"] };

            // format date
			each.creation_date = `${each.creation_date.getMonth() + 1}/${each.creation_date.getDate()}/${each.creation_date.getFullYear()}`;
        });

		locals.assessment_in_progress = assessments.filter(each => each.status.class == statusOfAssessment.in_progress);
		locals.assessment_completed = assessments.filter(each => each.status.class == statusOfAssessment.completed);
		locals.assessment_archive = assessments.filter(each => each.status.class == statusOfAssessment.archive);
    }

    locals.assessments = assessments;
    console.log(assessments);

    //  render view
    res.render('professor/coordinator', locals);

});

module.exports = router;