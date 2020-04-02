var express = require('express');
var router = express.Router();
var general_queries = require('../../helpers/queries/general_queries');
var assessment_query = require("../../helpers/queries/assessment.js");
const table = require("../../helpers/DatabaseTables");
const { admin, assessmentStatus, statusOfAssessment} = require("../../helpers/profiles");

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
    locals.assessment_archive = [];
    locals.filterStatus = [];

	// the user id is stored in session, thats why user need to be login
    let user_id = req.session.user_id;

    let assessment = null;

    // if the user is admin
    if (req.session.user_profile == admin){
        
        // get admin assessments for coordinator
        assessments = await assessment_query.get_admin_assessments().catch((err) => {
            console.error("Error getting assessments: ", err);
        });

    }else{
        // get professors assessments for coordinator
        assessments = await assessment_query.get_coordinator_assessments(user_id).catch((err) => {
            console.error("Error getting assessments: ", err);
        });
    }

    locals.term = await general_queries.get_table_info(table.academic_term).catch((err) => {
        console.error("Error getting the term: ", err);
    }) || [];

    locals.study_programs = [];
    
    if (assessments != undefined || assessments.length > 0){

        // get study programs
        let study_programs = assessments.map(each => each.prog_name);
        
        locals.study_programs = study_programs.filter(function (item, pos) {
            return study_programs.indexOf(item) == pos;
        });

        assessments.map((each) => {

            // format status
            each.status = {class: each.status,  name: assessmentStatus[each.status]["name"] };

            // format date
			each.creation_date = `${each.creation_date.getMonth() + 1}/${each.creation_date.getDate()}/${each.creation_date.getFullYear()}`;
        });

		locals.assessment_in_progress = assessments.filter(each => each.status.class == statusOfAssessment.in_progress);
		locals.assessment_completed = assessments.filter(each => each.status.class == statusOfAssessment.completed);
        locals.assessment_archive = assessments.filter(each => each.status.class == statusOfAssessment.archive);
        
        locals.filterStatus = ["In Progress", "Completed", "Archive"];
    }

    locals.assessments = assessments;
    // console.log(assessments);

    //  render view
    res.render('professor/coordinator', locals);

});

module.exports = router;