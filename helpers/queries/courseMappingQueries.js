var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;


/**
 * insert_course_mapping ->  creates new course with outcome relation
 * @param {Number} course -> course ID
 * @param {Number} outcome -> outcome ID
 * @return {Promise} resolve with true
 */
function insert_course_mapping(course, outcome) {
    return new Promise(function (resolve, reject) {

        if (course == undefined || outcome == undefined) return reject("Empty parameters");

        // variable that defines the query
        let insert_query = `INSERT INTO OUTCOME_COURSE values(?, ?);`;

        // query to insert new a Performance Criteria
        conn.query(insert_query, [course, outcome], function (err, results, fields) {
            if (err) return reject(err);

            resolve(true);
        });
    });
}

/**
 * insert_mapping ->  Inserting mapping course
 * @param {Number} course_id id of the course
 * @param {Array} mapping -> course ID
 * @return {Promise} resolve with true
 */
function insert_mapping(course_id, mapping) {
    return new Promise(function (resolve, reject) {

        if (mapping == undefined) return reject("Empty parameters");

        // variable that defines the query
        let insert_query = `INSERT INTO OUTCOME_COURSE (course_ID, outc_ID) values ?`;

        let data = [];
        mapping.forEach(element => {
            data.push([course_id, element]);
        });

        // query to insert new a Performance Criteria
        conn.query(insert_query, [data], function (err, results, fields) {
            if (err) return reject(err);

            resolve(true);
        });
    });
}

/**
 * insert_mapping ->  Remove mapping
 * @param {Number} course_id id of the course
 * @param {Array} mapping -> course ID
 * @return {Promise} resolve with true
 */
function remove_mapping(course_id, mapping) {
    return new Promise(function (resolve, reject) {

        if (mapping == undefined) return reject("Empty parameters");

        // variable that defines the query
        let delete_query = `DELETE FROM outcome_course WHERE (course_ID, outc_ID) IN (?)`;

        let data = [];
        mapping.forEach(element => {
            data.push([course_id, element]);
        });

        // query to insert new a Performance Criteria
        conn.query(delete_query, [data], function (err, results, fields) {
            if (err) return reject(err);

            resolve(true);
        });
    });
}



/**
 * get_course_outcomes ->  retrieves all Courses with their respective Outcomes
 * @return {Object} -> returns object containing all Courses ID with their respective Outcome ID
 */
function get_course_outcomes() {
    return new Promise(function (resolve, reject) {
        let query = `SELECT *
                     FROM OUTCOME_COURSE;`;

        conn.query(query, function (err, results) {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

function get_mapping() {
    return new Promise(function (resolve, reject) {
        let query = `SELECT prog_course.course_ID, prog_course.prog_ID, course.course_name, 
        study_program.prog_name, student_outcome.outc_name, student_outcome.outc_ID, study_program.dep_ID
        FROM prog_course
        INNER JOIN course ON prog_course.course_ID = course.course_ID
        INNER JOIN study_program ON prog_course.prog_ID = study_program.prog_ID
        INNER JOIN student_outcome ON study_program.prog_ID = student_outcome.prog_ID`;

        conn.query(query, function (err, results) {
            if (err) return reject(err);

            resolve(results);
        });

    });
}

function get_mapping_by_study_program(program_id) {
    return new Promise(function (resolve, reject) {
        let query = `SELECT prog_course.course_ID, prog_course.prog_ID, course.course_name, 
        study_program.prog_name, student_outcome.outc_name, student_outcome.outc_ID, study_program.dep_ID
        FROM prog_course
        INNER JOIN course ON prog_course.course_ID = course.course_ID
        INNER JOIN study_program ON prog_course.prog_ID = study_program.prog_ID
        INNER JOIN student_outcome ON study_program.prog_ID = student_outcome.prog_ID
        WHERE study_program.prog_ID = ?`;

        conn.query(query, [program_id], function (err, results) {
            if (err) return reject(err);

            resolve(results);
        });

    });
}

/**
 * get_outcome_with_study_programs ->  retrieves all Outcomes with their respective Study Program IDs
 * @return {Object} -> returns object containing all Outcomes with their respective Study Program IDs
 */
function get_outcome_with_study_programs() {
    return new Promise(function (resolve, reject) {
        let query = `SELECT outc_ID, outc_name, STUDY_PROGRAM.prog_ID
                     FROM STUDENT_OUTCOME, STUDY_PROGRAM
                     WHERE STUDENT_OUTCOME.prog_ID = STUDY_PROGRAM.prog_ID;`;

        conn.query(query, function (err, results) {
            if (err) return reject(err);

            resolve(results);
        });
    });
}

/**
 * get_outcome_with_study_programs ->  retrieves all Outcomes with their respective Study Program IDs
 * @return {Object} -> returns object containing all Outcomes with their respective Study Program IDs
 */
function get_outcome_with_study_programs() {
    return new Promise(function (resolve, reject) {
        let query = `SELECT outc_ID, outc_name, STUDY_PROGRAM.prog_ID
                     FROM STUDENT_OUTCOME, STUDY_PROGRAM
                     WHERE STUDENT_OUTCOME.prog_ID = STUDY_PROGRAM.prog_ID;`;

        conn.query(query, function (err, results) {
            if (err) return reject(err);

            resolve(results);
        });
    });
}

/**
 * get_outcome_with_study_programs ->  retrieves all Outcomes with their respective Study Program IDs
 * @return {Object} -> returns object containing all Outcomes with their respective Study Program IDs
 */
function get_course_mapping(program_id) {
    return new Promise(function (resolve, reject) {

        if (program_id == undefined || isNaN(program_id)) {
            return reject("Error with the Program ID");
        }

        let query = `SELECT course_ID, outcome_course.outc_ID FROM
        outcome_course INNER JOIN student_outcome On outcome_course.outc_ID = student_outcome.outc_ID
        INNER JOIN study_program on student_outcome.prog_ID = study_program.prog_ID
        WHERE study_program.prog_ID = ?`;

        conn.query(query, [program_id], function (err, results) {
            if (err) return reject(err);

            resolve(results);
        });
    });
}



module.exports.insert_course_mapping = insert_course_mapping;
module.exports.get_course_outcomes = get_course_outcomes;
module.exports.get_outcome_with_study_programs = get_outcome_with_study_programs;
module.exports.get_mapping = get_mapping;
module.exports.get_mapping_by_study_program = get_mapping_by_study_program;
module.exports.insert_mapping = insert_mapping;
module.exports.get_course_mapping = get_course_mapping;
module.exports.remove_mapping = remove_mapping;


