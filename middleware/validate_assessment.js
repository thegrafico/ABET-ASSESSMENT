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
module.exports.validate_assessment = async function validate_assessment(req, res, next) {

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

    req.body.assessment = assessment[0];
    next();
}


