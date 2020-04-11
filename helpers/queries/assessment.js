const table = require("../DatabaseTables");
var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;

/***
 * Return perfomance criterias being evaluated for an Assessment report
 * @param {Object} assessment -> keys {"name", "course", "term", "rubric", "user_id"}
 * @returns {Promise} -> Resolves with true
*/
module.exports.create_assessment = (assessment) => {
    return new Promise(function (resolve, reject) {

        if (assessment == undefined) {
            return reject("Invalid Parameters");
        }

        console.log(assessment);

        let query = `INSERT INTO ${table.assessment} (name, course_ID, term_ID, user_ID, rubric_ID, course_section)
        VALUES (?, ?, ?, ?, ?, ?)`

        let values = [
            assessment.name,
            assessment.course,
            assessment.term,
            assessment.user_id,
            assessment.rubric,
            assessment.course_section
        ];

        // EXe query
        conn.query(query, values, function (err, results) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
}

/***
 * Return perfomance criterias being evaluated for an Assessment report
 * @param {Number} user_id -> keys {"name", "course", "term", "rubric", "user_id"}
 * @returns {Promise} -> Resolves with all assessment
*/
module.exports.get_assessment_by_user_id = (user_id) => {
    return new Promise(function (resolve, reject) {

        if (user_id == undefined || isNaN(user_id)) {
            return reject("Invalid Parameters");
        }

        let query = `SELECT ${table.assessment}.assessment_ID, ${table.assessment}.status, ${table.assessment}.name,
        ${table.assessment}.course_section, ${table.course}.course_name, ${table.academic_term}.term_name, ${table.evaluation_rubric}.rubric_name,
        ${table.assessment}.creation_date, ${table.evaluation_rubric}.outc_ID, ${table.student_outcome}.prog_ID, 
        ${table.study_program}.dep_ID, ${table.course}.course_ID, ${table.assessment}.term_ID, ${table.assessment}.rubric_ID
        FROM ${table.assessment} INNER JOIN ${table.course} USING(course_ID)
        INNER JOIN ${table.academic_term} ON ${table.assessment}.term_ID = ${table.academic_term}.term_ID
        INNER JOIN ${table.evaluation_rubric} ON ${table.assessment}.rubric_ID = ${table.evaluation_rubric}.rubric_ID
        INNER JOIN ${table.student_outcome} ON ${table.student_outcome}.outc_ID = ${table.evaluation_rubric}.outc_ID
        INNER JOIN ${table.study_program} ON ${table.study_program}.prog_ID = ${table.student_outcome}.prog_ID
        WHERE ${table.assessment}.user_ID = ?
        ORDER BY ${table.assessment}.creation_date DESC`;

        // EXe query
        conn.query(query, [user_id], function (err, results) {
            if (err)
                reject(err);
            else
                resolve(results);
        });
    });
}


/***
 * remove_assessment_by_id Remove an assessment by user id and assessmen id
 * @param {Number} user_id -> id of the user
 * @param {Number} assessment_id -> id of the the assessment
 * @returns {Promise} -> Resolves with all assessment
*/
module.exports.remove_assessment_by_id = (user_id, assessment_id) => {
    return new Promise(function (resolve, reject) {

        // verify params
        if (user_id == undefined || isNaN(user_id) || assessment_id == undefined || isNaN(assessment_id)) {
            return reject("Invalid Parameters");
        }

        // delete assessment
        let query = `DELETE FROM ${table.assessment} WHERE ${table.assessment}.assessment_ID = ? and ${table.assessment}.user_ID = ?`;

        // EXe query
        conn.query(query, [assessment_id, user_id], function (err, results) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
}

/***
 * update_assessment_by_id Update assessment by user id and asssessmentid
 * @param {Number} user_id -> id of the user
 * @param {Number} assessment_id -> id of the the assessment
 * @returns {Promise} -> Resolves with all assessment
*/
module.exports.update_assessment_by_id = (user_id, assessment_id, assessment) => {
    return new Promise(function (resolve, reject) {

        // verify params
        if (user_id == undefined || isNaN(user_id) || assessment_id == undefined || isNaN(assessment_id) || assessment == undefined) {
            return reject("Invalid Parameters");
        }

        // delete assessment
        let query = `UPDATE ${table.assessment} SET name = ?, course_ID = ?, term_ID = ?, rubric_ID = ?
        WHERE assessment_ID = ? AND  user_ID = ?`;

        let data = [assessment.name, assessment.course, assessment.term, assessment.rubric, assessment_id, user_id];
        // EXe query
        conn.query(query, data, function (err, results) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
}

/**
 * get_professors_assessments - get all professor's assessments
 * @param {Number} user_id - user id
 * @returns {Promise} resolve with all assessments results 
 */
module.exports.get_coordinator_assessments = (user_id) => {

    return new Promise(function (resolve, reject) {

        // Get all assessment from my departments
        let get_assessments = `SELECT * 
        FROM ${table.assessment}
        INNER JOIN ${table.evaluation_rubric} ON ${table.assessment}.rubric_ID = ${table.evaluation_rubric}.rubric_ID
        INNER JOIN ${table.student_outcome} ON ${table.evaluation_rubric}.outc_ID = ${table.student_outcome}.outc_ID
        INNER JOIN ${table.study_program} ON ${table.student_outcome}.prog_ID = ${table.study_program}.prog_ID
        INNER JOIN ${table.department} ON ${table.study_program}.dep_ID = ${table.department}.dep_ID
        INNER JOIN ${table.course} ON ${table.assessment}.course_ID = ${table.course}.course_ID
        INNER JOIN ${table.academic_term} ON ${table.assessment}.term_ID = ${table.academic_term}.term_ID
        INNER JOIN ${table.user} ON ${table.user}.user_ID = ${table.assessment}.user_ID
        WHERE ${table.study_program}.prog_ID IN 
        (SELECT ${table.user_study_program}.prog_ID FROM ${table.user_study_program} WHERE ${table.user_study_program}.user_ID = ?
            AND ${table.user_study_program}.is_coordinator = 1)
        ORDER BY ${table.assessment}.creation_date ASC`;

        // EXe query
        conn.query(get_assessments, [user_id], function (err, results) {
            if (err)
                reject(err);
            else
                resolve(results);
        });
    });
}

/**
 * get_professors_assessments - get all professor's assessments
 * @param {Number} user_id - user id
 * @returns {Promise} resolve with all assessments results 
 */
module.exports.get_admin_assessments = () => {

    return new Promise(function (resolve, reject) {

        // Get all assessment from my departments
        let get_assessments = `SELECT * 
        FROM ${table.assessment}
        INNER JOIN ${table.evaluation_rubric} ON ${table.assessment}.rubric_ID = ${table.evaluation_rubric}.rubric_ID
        INNER JOIN ${table.student_outcome} ON ${table.evaluation_rubric}.outc_ID = ${table.student_outcome}.outc_ID
        INNER JOIN ${table.study_program} ON ${table.student_outcome}.prog_ID = ${table.study_program}.prog_ID
        INNER JOIN ${table.department} ON ${table.study_program}.dep_ID = ${table.department}.dep_ID
        INNER JOIN ${table.course} ON ${table.assessment}.course_ID = ${table.course}.course_ID
        INNER JOIN ${table.academic_term} ON ${table.assessment}.term_ID = ${table.academic_term}.term_ID
        INNER JOIN ${table.user} ON ${table.user}.user_ID = ${table.assessment}.user_ID
        ORDER BY ${table.assessment}.creation_date ASC`;

        // EXe query
        conn.query(get_assessments, [], function (err, results) {
            if (err)
                reject(err);
            else
                resolve(results);
        });
    });
}

/**
 * get_study_program_by_user_id - get all study program by user
 * @param {Number} id - Id of the user
 * @return {Promise} Resolve with all study programs
 */
module.exports.get_study_program_by_user_id = function get_study_program_by_user_id(id) {
    return new Promise(function (resolve, reject) {

        // verify user ID
        if (id == undefined || isNaN(id)) {
            return reject("User id only can be a number");
        }

        let std_query = `SELECT ${table.study_program}.prog_ID, ${table.study_program}.prog_name
		FROM ${table.user} INNER JOIN ${table.user_study_program} USING (user_ID)
		INNER JOIN ${table.study_program} ON ${table.study_program}.prog_ID = ${table.user_study_program}.prog_ID
		WHERE ${table.user}.user_ID = ?
		ORDER BY ${table.study_program}.prog_name ASC`;

        conn.query(std_query, [id], function (err, results) {
            if (err)
                reject(err);
            else
                resolve(results);
        });
    });
}


/**
 * get_agregado_by - get agregado of assessment by outcome id and term
 * @param {Number} outcome_id 
 * @param {Number} term_id
 * @returns {Promise} - resolve with data 
 */
module.exports.get_agregado_by = function get_agregado_by(outcome_id, term_id) {
    return new Promise(function (resolve, reject) {

        // verify user ID
        if (outcome_id == undefined || isNaN(outcome_id) || term_id == undefined || isNaN(term_id)) {
            return reject("Invalid parameters");
        }

        let get_agregado = `SELECT completed.assessment_ID, completed.name, EVALUATION_ROW.row_ID, ROW_PERC.perC_ID, ROW_PERC.row_perc_score, completed.rubric_ID, eval_rubric.outc_ID, PERF_CRITERIA.perC_Desk, ACADEMIC_TERM.term_name FROM 
        (SELECT ASSESSMENT.assessment_ID, ASSESSMENT.name, ASSESSMENT.status, ASSESSMENT.rubric_ID, ASSESSMENT.term_ID FROM ASSESSMENT WHERE ASSESSMENT.status IN ("completed", "archive") ) as completed
        INNER JOIN ACADEMIC_TERM ON ACADEMIC_TERM.term_ID = completed.term_ID 
        INNER JOIN EVALUATION_ROW ON completed.assessment_ID = EVALUATION_ROW.assessment_ID 
        INNER JOIN ROW_PERC ON ROW_PERC.row_ID = EVALUATION_ROW.row_ID 
        INNER JOIN (SELECT EVALUATION_RUBRIC.rubric_ID, EVALUATION_RUBRIC.outc_ID FROM EVALUATION_RUBRIC) as eval_rubric ON eval_rubric.rubric_ID = completed.rubric_ID 
        INNER JOIN PERF_CRITERIA ON PERF_CRITERIA.perC_ID = ROW_PERC.perC_ID
        WHERE eval_rubric.outc_ID = ? AND ACADEMIC_TERM.term_ID = ?
        ORDER BY EVALUATION_ROW.row_ID ASC`;

        conn.query(get_agregado, [outcome_id, term_id], function (err, results) {
            if (err)
                reject(err);
            else
                resolve(results);
        });
    });
}





