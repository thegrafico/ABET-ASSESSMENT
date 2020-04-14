var { options } = require("../mysqlConnection");
var mysql = require("mysql");
const table = require("../DatabaseTables");
var connection = mysql.createConnection(options);
connection.connect();


/**
 * create_user get Create new user
 * @param {Object} user -> {id, name, lastname, email, phoneNumber}
 * @param {Number} profile_id id of the profile
 * @param {Array} departments_id ids of departments 
 * @return {Promise} resolve with all profiles
 */
module.exports.create_user = function create_user(user, profile_id, std) {

    // add user promise
    return new Promise(function (resolve, reject) {

        connection.beginTransaction(function (err) {
            if (err) { return reject(err) }

            // query
            let queryAddUser = `INSERT INTO ${table.user} (inter_ID, first_name, last_name, email, phone_number)
             values( ?, ?, ?, ?, ?);`;

            connection.query(queryAddUser, [user.id, user.name, user.lastname, user.email.toLowerCase(), user.phoneNumber], function (error, results) {

                if (error) return connection.rollback(function () { reject(error); });

                let user_id = results.insertId;
                let querySetProfile = `INSERT INTO ${table.user_profiles} values(?, ?)`;

                connection.query(querySetProfile, [user_id, profile_id], function (error, results) {
                    if (error) return connection.rollback(function () { reject(error); });

                    let data = get_data_user_sdt_program(user_id, std);

                    if (data.length == 0) { return connection.rollback(function () { reject("Not study Program found"); }); }

                    let inser_user_std = `INSERT INTO ${table.user_study_program} (user_ID, prog_ID, is_coordinator) values ?;`;

                    connection.query(inser_user_std, [data], function (error, results) {

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
 * create_user get Create new user
 * @param {Object} user -> {id, name, lastname, email, phoneNumber}
 * @param {Number} profile_id id of the profile
 * @param {Array} departments_id ids of departments 
 * @return {Promise} resolve with all profiles
 */
module.exports.update_user = function update_user(user_id, user_data) {

    // add user promise
    return new Promise(function (resolve, reject) {

        if (user_data == undefined || user.length == 0) {
            return reject("Invalid Parameter");
        }

        let data = [
            user_data.interID,
            user_data.username,
            user_data.lastname,
            user_data.email,
            user_data.phoneNumber,
            user_id
        ];

        connection.beginTransaction(function (err) {
            if (err) { return reject(err) }

            // query
            let update_query = `UPDATE ${table.user} SET inter_ID = ?, first_name =? , last_name = ?, email = ? , phone_number = ?
                WHERE ${table.user}.user_ID = ?;`;

            // update user basic information
            connection.query(update_query, data, function (error, results) {
                if (error) return connection.rollback(function () { reject(error); });

                let query_update_profile = `UPDATE ${table.user_profiles} SET profile_ID = ? WHERE ${table.user_profiles}.user_ID = ?`;

                // update user profile
                connection.query(query_update_profile, [user_data.profile_id, user_id], function (error, results) {
                    if (error) return connection.rollback(function () { reject(error); });

                    let delete_std_programs = `DELETE FROM ${table.user_study_program} WHERE ${table.user_study_program}.user_ID = ?`

                    // REMOVE ALL STUDY PROGRMS FROM USER
                    connection.query(delete_std_programs, [user_id], function (error, results) {
                        if (error) return connection.rollback(function () { reject(error); });

                        // data structured with all study program for user
                        let data = get_data_user_sdt_program(user_id, user_data.std);

                        if (data.length == 0) { return connection.rollback(function () { reject("Not study Program found"); }); }

                        let inser_user_std = `INSERT INTO ${table.user_study_program} (user_ID, prog_ID, is_coordinator) values ?;`;

                        connection.query(inser_user_std, [data], function (error, results) {
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
    });
}

/**
 * 
 * @param {Number} user_id - id of the user 
 * @param {Object} std - all study programs for user
 */
function get_data_user_sdt_program(user_id, std) {
    let data = [];
    for (key in std) {
        if (Array.isArray(std[key])) {
            if (std[key][1] == 'on') {
                data.push([user_id, std[key][0], true]);
            } else {
                data.push([user_id, std[key][0], false]);
            }
        } else {
            data.push([user_id, std[key], false]);
        }
    }

    return data;
}

/**
 * create_course create a course record
 * @param {Object} user -> {number, name, description}
 * @param {Array} study_program_ids id of study programs
 * @return {Promise} resolve with all profiles
 */
module.exports.create_course = function create_course(course) {

    // add user promise
    return new Promise(function (resolve, reject) {
        connection.beginTransaction(function (err) {
            if (err) { return reject(err) }

            let insert_query = `INSERT INTO ${table.course} 
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

                let insert_prog_course = `INSERT INTO ${table.prog_course} (course_ID, prog_ID) values ?`;

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
 * @param {Boolean} isFinal -> rubric can be edited later or not
 * @return {Promise} resolve with true
 */
module.exports.create_evaluation_rubric = function create_evaluation_rubric(rubric, isFinal) {
    return new Promise(function (resolve, reject) {

        connection.beginTransaction(function (err) {
            if (err) { return reject(err) }

            // insert rubric
            let insert_query = `INSERT INTO ${table.evaluation_rubric}
            (rubric_name, rubric_description, outc_ID, isFinal) 
            VALUES(?, ?, ?, ?);`;

            connection.query(insert_query, [rubric.name, rubric.description, rubric.outcome_id, isFinal], function (error, results) {

                if (error) return connection.rollback(function () { reject(error); });

                let rubric_id = results.insertId;

                let values = [];
                rubric["performance"].forEach((element) => {
                    if (element != undefined && element.length != 0 && !isNaN(element)) {
                        values.push([rubric_id, parseInt(element)])
                    }
                });

                let query_performance_rubric = `INSERT INTO ${table.performance_rubric} (rubric_ID, perC_ID) VALUES ?`;

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
module.exports.insertStudentScores = function insertStudentScores(rows, performances, assessmentID) {

    return new Promise((resolve, reject) => {

        connection.beginTransaction(function (err) {
            if (err) { return reject(err) }

            // query
            let deletePrevEntry = `DELETE FROM ${table.evaluation_row} WHERE ${table.evaluation_row}.assessment_ID = ?`;

            // delete previus entries
            connection.query(deletePrevEntry, [assessmentID], function (error, results) {
                if (error) return connection.rollback(function () { return reject(error); });

                // query
                let insert_evaluation_row = `INSERT INTO ${table.evaluation_row} (assessment_ID) VALUES ?`;

                // insert new entries
                connection.query(insert_evaluation_row, [rows], function (error, results) {
                    // dont save the data
                    if (error) return connection.rollback(function () { return reject(error); });

                    // get all row id in order
                    let get_row_query = `SELECT row_ID FROM ${table.evaluation_row} WHERE assessment_ID = ? ORDER BY row_ID ASC`;

                    connection.query(get_row_query, [assessmentID], async function (error, results) {
                        if (error) return connection.rollback(function () { return reject(error); });

                        // get an array of all row_ids
                        let row_ids = results.map(record => record["row_ID"]);

                        // combine row_ids with its respective performances evaluation
                        let row_perf = await transformInRowPerf(row_ids, performances);

                        // query
                        let insert_row_performance = `INSERT INTO ${table.row_perc} (row_ID, perc_ID, row_perc_score) VALUES ?`;

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
            if (performances[i]["scores"][j] == -1)
                performances[i]["scores"][j] = null;

            row_perf.push([row_ids[i], performances[i]["perfC"][j], performances[i]["scores"][j]]);
        }
    }
    console.log("Entry Data: ", row_perf);
    return row_perf;
}
