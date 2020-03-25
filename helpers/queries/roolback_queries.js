var { options } = require("../mysqlConnection");
var mysql = require("mysql");
var connection = mysql.createConnection(options);
connection.connect();


/**
 * create_user get Create new user
 * @param {Object} user -> {id, name, lastname, email, phoneNumber}
 * @param {Number} profile_id id of the profile
 * @param {Array} departments_id ids of departments 
 * @return {Promise} resolve with all profiles
 */
async function create_user(user, profile_id, departments_id) {


    // add user promise
    return new Promise(function (resolve, reject) {

        connection.beginTransaction(function (err) {
            if (err) { return reject(err) }

            // query
            let queryAddUser = `INSERT INTO USER (inter_ID, first_name, last_name, email, phone_number)
             values( ?, ?, ?, ?, ?);`;

            connection.query(queryAddUser, [user.id, user.name, user.lastname, user.email.toLowerCase(), user.phoneNumber], function (error, results) {

                if (error) return connection.rollback(function () { reject(error); });

                let user_id = results.insertId;
                let querySetProfile = `INSERT INTO USER_PROFILES values(?, ?)`;

                connection.query(querySetProfile, [user_id, profile_id], function (error, results) {
                    if (error) return connection.rollback(function () { reject(error); });

                    let values = [];
                    departments_id.forEach((dept_id) => {
                        if (dept_id != undefined && dept_id.length != 0 && !isNaN(dept_id)) {
                            values.push([user_id, parseInt(dept_id)])
                        }
                    });

                    if (values.length == 0) { return connection.rollback(function () { reject("Not department found"); }); }

                    let set_dept_query = `INSERT INTO USER_DEP (user_ID, dep_ID) values ?;`;

                    connection.query(set_dept_query, [values], function (error, results) {

                        if (error) return connection.rollback(function () { reject(error); });

                        connection.commit(function (err) {
                            if (err) {
                                return connection.rollback(function () {
                                    reject(err);
                                });
                            }
                            resolve(true);
                        });
                    });
                });
            });
        });
    });
}

/**
 * create_course create a course record
 * @param {Object} user -> {number, name, description}
 * @param {Array} study_program_ids id of study programs
 * @return {Promise} resolve with all profiles
 */
async function create_course(course) {

    // add user promise
    return new Promise(function (resolve, reject) {
        connection.beginTransaction(function (err) {
            if (err) { return reject(err) }

            let insert_query = `INSERT INTO COURSE 
            (course_number, course_name, course_description) 
            values(?, ?, ?);`;

            connection.query(insert_query, [course.number, course.name, course.description], function (error, results) {

                if (error) return connection.rollback(function () { reject(error); });

                let course_id = results.insertId;

                let values = [];
                course.study_programs.forEach((id) => {
                    if (id != undefined && id.length != 0 && !isNaN(id)) {
                        values.push([course_id, parseInt(id)])
                    }
                });

                if (values.length == 0) return reject("Cannot add any study program");

                let insert_prog_course = `INSERT INTO PROG_COURSE (course_ID, prog_ID) values ?`;

                connection.query(insert_prog_course, [values], function (error, results) {
                    if (error) return connection.rollback(function () { reject(error); });

                    connection.commit(function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                reject(err);
                            });
                        }
                        resolve(true);
                    });
                });
            });
        });
    });
}


/**
 * create_evaluation_rubric create a new evaluation rubric
 * @param {Object} rubric -> {name, description, outcome_id, performance}
 * @return {Promise} resolve with true
 */
async function create_evaluation_rubric(rubric) {
    return new Promise(function (resolve, reject) {

        connection.beginTransaction(function (err) {
            if (err) { return reject(err) }

            // insert rubric
            let insert_query = `INSERT INTO EVALUATION_RUBRIC 
            (rubric_name, rubric_description, outc_ID) 
            VALUES(?, ?, ?);`;

            connection.query(insert_query, [rubric.name, rubric.description, rubric.outcome_id, new Date()], function (error, results) {

                if (error) return connection.rollback(function () { reject(error); });

                let rubric_id = results.insertId;

                let values = [];
                rubric["performance"].forEach((element) => {
                    if (element != undefined && element.length != 0 && !isNaN(element)) {
                        values.push([rubric_id, parseInt(element)])
                    }
                });

                let query_performance_rubric = `INSERT INTO PERFORMANCE_RUBRIC (rubric_ID, perC_ID) VALUES ?`;

                connection.query(query_performance_rubric, [values], function (error, results) {
                    if (error) return connection.rollback(function () { reject(error); });

                    connection.commit(function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                reject(err);
                            });
                        }
                        resolve(true);
                    });
                });
            });
        });
    });
}

/**
 * insertStudentScores() -> function that executes query which inserts student scores to database.
 * @param {Array} rows -> [...Assessment id]
 * @param {Array} performances -> [null, Assessment id]
 * @returns {Boolean} -> returns true if successful.
*/
function insertStudentScores(rows, performances, assessmentID) {

    return new Promise((resolve, reject) => {

        connection.beginTransaction(function (err) {
            if (err) { return reject(err) }

            // query
            let deletePrevEntry = `DELETE FROM EVALUATION_ROW WHERE EVALUATION_ROW.assessment_ID = ?`;

            // delete previus entries
            connection.query(deletePrevEntry, [assessmentID], function (error, results) {
                if (error) return connection.rollback(function () {return reject(error);});

                // query
                let insert_evaluation_row = 'INSERT INTO EVALUATION_ROW(assessment_ID) VALUES ?';

                // insert new entries
                connection.query(insert_evaluation_row, [rows], function (error, results) {
                    // dont save the data
                    if (error) return connection.rollback(function () { return reject(error); });

                    // get all row id in order
                    let get_row_query = 'SELECT row_ID FROM EVALUATION_ROW WHERE assessment_ID = ? ORDER BY row_ID ASC';

                    connection.query(get_row_query, [assessmentID], async function (error, results) {
                        if (error) return connection.rollback(function () { return reject(error); });

                        // get an array of all row_ids
                        let row_ids = results.map(record => record["row_ID"]);

                        // combine row_ids with its respective performances evaluation
                        let row_perf = await transformInRowPerf(row_ids, performances);

                        // query
                        let insert_row_performance = `INSERT INTO ROW_PERC(row_ID, perc_ID, row_perc_score) VALUES ?`;

                        // insert student data
                        connection.query(insert_row_performance, [row_perf], function (error, results) {
                            if (error) return connection.rollback(function () { return reject(error); });

                            // save the changes
                            connection.commit(function (err) {
                                if (err) return connection.rollback(function () { reject(err); });
                                
                                // Success
                                resolve(true);
                            });
                        });
                    });
                });
            });
        });
    });
}
/**
 * transformInRowPerf - combine the row_ids with the performances
 * @param {Array} row_ids - Array with the row id number
 * @param {Array} performances - Array with the row id number
 * @returns {Array[Array]} - return array of array
 */
function transformInRowPerf(row_ids, performances) {
    let row_perf = [];
    // iter all row ids
    for (let i = 0; i < row_ids.length; i++) {
        // iter all perfC and scores
        for (let j = 0; j < performances[i]["perfC"].length; j++) {
            row_perf.push([row_ids[i], performances[i]["perfC"][j], performances[i]["scores"][j]]);
        }
    }

    return row_perf;
}

module.exports.insertStudentScores = insertStudentScores;
module.exports.create_user = create_user;
module.exports.create_course = create_course;
module.exports.create_evaluation_rubric = create_evaluation_rubric;
