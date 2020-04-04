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
 async function validate_assessment(req, res, next) {

    // Validate ID
    if (req.params.assessmentID == undefined || isNaN(req.params.assessmentID)) {
        req.flash("error", "Invalid Assessment");
        return res.redirect("/professor");
    }

    let assessment_query = { "from": "ASSESSMENT", "where": "assessment_ID", "id": req.params.assessmentID };
    let assessment = await general_queries.get_table_info_by_id(assessment_query).catch((err) => {
        console.error("ERROR GETTING ASSESSMENT: ", err);
    });

    // verify is assessment exits
    if (assessment == undefined || assessment.length == 0) {
        req.flash("error", "Cannot find the assessment you're looking for");
        return res.redirect("/professor");
    }
    
    // get the assessment
    assessment = assessment[0];

    // the assessment don't belong to the user
    req.body.belong_to_user = false;

    // if the assessment was created by the user login
    if (assessment["user_ID"] == req.session.user_id){
        req.body.belong_to_user = true; 
    }

    req.body.assessment = assessment;
    next();
}

function isOwnerAssessment(req, res, next){
    
    // if exits and belong to user
    if (req.body.belong_to_user != undefined && req.body.belong_to_user){
        next();
    }else{
        req.flash("error", "This assessments belong to other user");
        res.redirect("/professor");
    }
}


// validate if assessment exits and belong to the user
module.exports.validate_assessment = validate_assessment; 
module.exports.isOwnerAssessment = isOwnerAssessment; 

