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

        let query = `INSERT INTO ASSESSMENT (name, course_ID, term_ID, user_ID, rubric_ID)
        VALUES (?, ?, ?, ?, ?)`

        let values = [
            assessment.name,
            assessment.course,
            assessment.term,
            assessment.user_id,
            assessment.rubric,
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

        let query = `SELECT ASSESSMENT.assessment_ID,ASSESSMENT.name, COURSE.course_name, ACADEMIC_TERM.term_name, 
        EVALUATION_RUBRIC.rubric_name, ASSESSMENT.creation_date, EVALUATION_RUBRIC.outc_ID,
        STUDENT_OUTCOME.prog_ID, STUDY_PROGRAM.dep_ID, COURSE.course_ID, ASSESSMENT.term_ID, ASSESSMENT.rubric_ID
        FROM ASSESSMENT INNER JOIN COURSE USING(course_ID)
        INNER JOIN ACADEMIC_TERM ON ASSESSMENT.term_ID = ACADEMIC_TERM.term_ID
        INNER JOIN EVALUATION_RUBRIC ON ASSESSMENT.rubric_ID = EVALUATION_RUBRIC.rubric_ID
        INNER JOIN STUDENT_OUTCOME ON STUDENT_OUTCOME.outc_ID = EVALUATION_RUBRIC.outc_ID
        INNER JOIN STUDY_PROGRAM ON STUDY_PROGRAM.prog_ID = STUDENT_OUTCOME.prog_ID
        WHERE ASSESSMENT.user_ID = ?
        ORDER BY ASSESSMENT.creation_date DESC`;

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
        let query = `DELETE FROM ASSESSMENT WHERE ASSESSMENT.assessment_ID = ? and ASSESSMENT.user_ID = ?`;

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
        let query = `UPDATE ASSESSMENT SET name = ?, course_ID = ?, term_ID = ?, rubric_ID = ?
        WHERE assessment_ID = ? AND  user_ID = ?`;

        let data =  [assessment.name, assessment.course, assessment.term, assessment.rubric, assessment_id, user_id];
        // EXe query
        conn.query(query,data, function (err, results) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
}



