var {db} = require("../mysqlConnection");
var conn = db.mysql_pool;


/**
 * get_user_list - get all users
 * @param {Number} rubric_id id of the rubric
 * @return {Promise} resolve with results of database
 */
async function get_performance_from_rubric(rubric_id) {
    return new Promise(function (resolve, reject) {
        if (rubric_id == undefined || isNaN(rubric_id)) return reject("Error with the rubric id parameter");

        let performance_query = `SELECT perC_Desk 
        FROM EVALUATION_RUBRIC INNER JOIN PERFORMANCE_RUBRIC USING(rubric_ID)
        INNER JOIN PERF_CRITERIA ON PERFORMANCE_RUBRIC.perC_ID = PERF_CRITERIA.perC_ID
        WHERE EVALUATION_RUBRIC.rubric_ID = ?`;

        conn.query(performance_query, [rubric_id], function (err, results, fields) {
            if (err)
                reject(err);
            else
                resolve(results);
        });
    });
}
/**
 * get_courses_by_study_program_id - Get all courses by Study Program
 * @param {Number} std_id id of the study program
 * @return {Promise} resolve with all courses
 */
function get_courses_by_study_program_id(std_id){
    return new Promise(function(resolve, reject){
        if (std_id == undefined || isNaN(std_id)){
            return reject("Invalid study program id");
        }

        let courses_query = `SELECT course_ID, course_name
        FROM COURSE NATURAL JOIN PROG_COURSE
        INNER JOIN STUDY_PROGRAM ON PROG_COURSE.prog_ID = STUDY_PROGRAM.prog_ID
        WHERE STUDY_PROGRAM.prog_ID = ?
        ORDER BY course_name ASC`;

        conn.query(courses_query, [std_id], function (err, results, fields) {
            if (err)
                reject(err);
            else
                resolve(results);
        });

    });
}

/**
 * get_rubrics_by_outcome_id - Get all rubrics by Study Program
 * @param {Number} std_id id of the study program
 * @return {Promise} resolve with all courses
 */
function get_rubrics_by_outcome_id(std_id){
    return new Promise(function(resolve, reject){
        if (std_id == undefined || isNaN(std_id)){
            return reject("Invalid study program id");
        }

        let courses_query = `SELECT course_ID, course_name
        FROM COURSE NATURAL JOIN PROG_COURSE
        INNER JOIN STUDY_PROGRAM ON PROG_COURSE.prog_ID = STUDY_PROGRAM.prog_ID
        WHERE STUDY_PROGRAM.prog_ID = ?
        ORDER BY course_name ASC`;

        conn.query(courses_query, [std_id], function (err, results, fields) {
            if (err)
                reject(err);
            else
                resolve(results);
        });

    });
}

module.exports.get_performance_from_rubric = get_performance_from_rubric;
module.exports.get_courses_by_study_program_id = get_courses_by_study_program_id;
module.exports.get_rubrics_by_outcome_id = get_rubrics_by_outcome_id;

