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
 * @param {Array} mapping -> course ID
 * @return {Promise} resolve with true
 */
function insert_mapping(mapping) {
    return new Promise(function (resolve, reject) {

        if (mapping == undefined || mapping.length == 0) return reject("Empty parameters");

        // variable that defines the query
        let insert_query = `INSERT INTO OUTCOME_COURSE (course_ID, outc_ID) values ?`;

        // query to insert new a Performance Criteria
        conn.query(insert_query, [mapping], function (err, results, fields) {
            if (err) return reject(err);

            resolve(true);
        });
    });
}

/**
 * insert_mapping ->  Remove mapping
 * @param {Array} mapping -> course ID
 * @return {Promise} resolve with true
 */
function remove_mapping(mapping) {
    return new Promise(function (resolve, reject) {

        if (mapping == undefined || mapping.length == 0) return reject("Empty parameters");

        // variable that defines the query
        let delete_query = `DELETE FROM OUTCOME_COURSE WHERE (course_ID, outc_ID) IN (?)`;

        // query to insert new a Performance Criteria
        conn.query(delete_query, [mapping], function (err, results, fields) {
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
        let query = `SELECT PROG_COURSE.course_ID, PROG_COURSE.prog_ID, COURSE.course_name, 
        STUDY_PROGRAM.prog_name, STUDENT_OUTCOME.outc_name, STUDENT_OUTCOME.outc_ID, STUDY_PROGRAM.dep_ID
        FROM PROG_COURSE
        INNER JOIN COURSE ON PROG_COURSE.course_ID = COURSE.course_ID
        INNER JOIN STUDY_PROGRAM ON PROG_COURSE.prog_ID = STUDY_PROGRAM.prog_ID
        INNER JOIN STUDENT_OUTCOME ON STUDY_PROGRAM.prog_ID = STUDENT_OUTCOME.prog_ID`;

        conn.query(query, function (err, results) {
            if (err) return reject(err);

            resolve(results);
        });

    });
}

function get_mapping_by_study_program(program_id) {
    return new Promise(function (resolve, reject) {
        let query = `SELECT PROG_COURSE.course_ID, PROG_COURSE.prog_ID, COURSE.course_name, 
        STUDY_PROGRAM.prog_name, STUDENT_OUTCOME.outc_name, STUDENT_OUTCOME.outc_ID, STUDY_PROGRAM.dep_ID
        FROM PROG_COURSE
        INNER JOIN COURSE ON PROG_COURSE.course_ID = COURSE.course_ID
        INNER JOIN STUDY_PROGRAM ON PROG_COURSE.prog_ID = STUDY_PROGRAM.prog_ID
        INNER JOIN STUDENT_OUTCOME ON STUDY_PROGRAM.prog_ID = STUDENT_OUTCOME.prog_ID
        WHERE STUDY_PROGRAM.prog_ID = ?`;

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

        let query = `SELECT course_ID, OUTCOME_COURSE.outc_ID FROM
        OUTCOME_COURSE INNER JOIN STUDENT_OUTCOME On OUTCOME_COURSE.outc_ID = STUDENT_OUTCOME.outc_ID
        INNER JOIN STUDY_PROGRAM on STUDENT_OUTCOME.prog_ID = STUDY_PROGRAM.prog_ID
        WHERE STUDY_PROGRAM.prog_ID = ?`;

        conn.query(query, [program_id], function (err, results) {
            if (err) return reject(err);

            resolve(results);
        });
    });
}

/**
 * get_outcome_with_study_programs ->  retrieves all Outcomes with their respective Study Program IDs
 * @param {Array} mapping combination between courseid and outcomeid
 * @return {Object} -> returns object containing all Outcomes with their respective Study Program IDs
 */
function get_mapping_name(mapping) {
    return new Promise(function (resolve, reject) {

        if (mapping == undefined || mapping.length == 0) {
            return reject("Error with the Program ID");
        }

        let query = `SELECT COURSE.course_name, STUDENT_OUTCOME.outc_name
        FROM OUTCOME_COURSE
        INNER JOIN COURSE ON OUTCOME_COURSE.course_ID = COURSE.course_ID
        INNER JOIN STUDENT_OUTCOME ON OUTCOME_COURSE.outc_ID = STUDENT_OUTCOME.outc_ID
        WHERE (OUTCOME_COURSE.course_ID, OUTCOME_COURSE.outc_ID) IN ?`;

        conn.query(query, [mapping], function (err, results) {
            if (err) return reject(err);

            resolve(results);
        });
    });
}


module.exports.get_mapping_name = get_mapping_name;
module.exports.insert_course_mapping = insert_course_mapping;
module.exports.get_course_outcomes = get_course_outcomes;
module.exports.get_outcome_with_study_programs = get_outcome_with_study_programs;
module.exports.get_mapping = get_mapping;
module.exports.get_mapping_by_study_program = get_mapping_by_study_program;
module.exports.insert_mapping = insert_mapping;
module.exports.get_course_mapping = get_course_mapping;
module.exports.remove_mapping = remove_mapping;



