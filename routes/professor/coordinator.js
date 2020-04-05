var express = require('express');
var router = express.Router();
var general_queries = require('../../helpers/queries/general_queries');
var assessment_query = require("../../helpers/queries/assessment.js");
const table = require("../../helpers/DatabaseTables");
const { admin, assessmentStatus, statusOfAssessment } = require("../../helpers/profiles");

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
router.get('/professorAssessment', async function (req, res) {

    locals.title = "Professor's Assessments";
    locals.assessment_in_progress = [];
    locals.assessment_completed = [];
    locals.assessment_archive = [];
    locals.filterStatus = [];
    locals.study_programs = [];
    locals.hasAssessments = false;

    // the user id is stored in session, thats why user need to be login
    let user_id = req.session.user_id;

    // Stores assessment
    let assessment = null;

    // if the user is admin
    if (req.session.user_profile == admin) {

        // get admin assessments for coordinator
        assessment = await assessment_query.get_admin_assessments().catch((err) => {
            console.error("Error getting assessments: ", err);
        });

        // get all study programs
        locals.study_programs = await general_queries.get_table_info(table.study_program).catch((err) => {
            console.error("Errror getting study programs: ", err);
        }) || [];

    } else {

        // get professors assessments for coordinator
        assessment = await assessment_query.get_coordinator_assessments(user_id).catch((err) => {
            console.error("Error getting assessments: ", err);
        });

        locals.study_programs = req.session.study_programs_coordinator || [];
    }

    // Terms
    locals.term = await general_queries.get_table_info(table.academic_term).catch((err) => {
        console.error("Error getting the term: ", err);
    }) || [];

    // verify assessments
    if (assessment != undefined || assessment.length > 0) {
        assessment.map((each) => {
            // format status
            each.status = { class: each.status, name: assessmentStatus[each.status]["name"] };

            // format date
            each.creation_date = `${each.creation_date.getMonth() + 1}/${each.creation_date.getDate()}/${each.creation_date.getFullYear()}`;
        });

        // assessments
        locals.assessment_in_progress = assessment.filter(each => each.status.class == statusOfAssessment.in_progress);
        locals.assessment_completed = assessment.filter(each => each.status.class == statusOfAssessment.completed);
        locals.assessment_archive = assessment.filter(each => each.status.class == statusOfAssessment.archive);

        // Status
        locals.filterStatus = ["In Progress", "Completed", "Archive"];

        locals.hasAssessments = true;
    }
    res.render('professor/coordinator', locals);
});

/**
 * GET - view assessments results by department
 * GET /professor/coordinator/departmentAssessments
 */
router.get('/departmentAssessments', async function (req, res) {

    locals.title = "Department Assessment";

    locals.breadcrumb = [
        { "name": "Department Assessment", "url": "#" }
    ];

    let study_program = await general_queries.get_table_info(table.study_program).catch((err) => {
        console.error("Error getting study program: ", err);
    });

    // if cannot find department
    if (study_program == undefined || study_program.length == 0) {
        req.flash("error", "Cannot find any Study Program");
        return res.redirect(base_url);
    }

    let term = await general_queries.get_table_info(table.academic_term).catch((err) => {
        console.error("Error getting Academic Term: ", term);
    });

    if (term == undefined || term.length == 0) {
        req.flash("error", "Cannot find any Academic Term");
        return res.redirect(base_url);
    }

    locals.study_program = study_program;
    locals.term = term;
    
    res.render('professor/department_assessment', locals);
});

module.exports = router;