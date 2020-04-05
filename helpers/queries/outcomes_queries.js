var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;
const table = require("../DatabaseTables");


/**
 * insert_outcome -  Create a new outcome
 * @param {Object} data -> keys: {"outcome_name", "outcome_description", "program_id"} 
 * @return {Promise} resolve with all profiles
 */
function insert_outcome(data) {

    return new Promise(function (resolve, reject) {

        let insert_query = `INSERT INTO ${table.student_outcome} (outc_name, outc_description, prog_ID) values(?, ?, ?);`;

        conn.query(insert_query, [data.outcome_name, data.outcome_description, data.program_id],
            function (err, results) {
                if (err)
                    reject(err);
                else
                    resolve(true);
            });
    });
}

/**
 * get_all_profiles get all profiles from database
 * @param {Object} data -> keys {"outc_name", "outc_description", "prog_ID", "outc_ID"} 
 * @return {Promise} resolve with all profiles
 */
function update_outcome(data) {

    return new Promise(function (resolve, reject) {

        let update_query = `UPDATE ${table.student_outcome} set outc_name = ?, 
        outc_description = ?, prog_ID = ? where outc_ID = ?; `;

        conn.query(update_query, [data.outc_name, data.outc_description, data.prog_ID, data.outc_ID],
            function (err, results) {
                if (err) reject(err);
                else resolve(results);
            });
    });
}

/**
 * get_outcomes_by_department - get all outoces by department
 * @param {Number} dept_id - id of the department 
 */
function get_outcomes_by_department(dept_id) {
    
    return new Promise(function (resolve, reject) {

        let outcomes_by_dept = `SELECT * FROM ${table.student_outcome} WHERE ${table.student_outcome}.prog_ID IN 
        (SELECT ${table.study_program}.prog_ID FROM ${table.study_program} INNER JOIN ${table.department} ON 
        ${table.study_program}.dep_ID = ${table.department}.dep_ID WHERE ${table.department}.dep_ID = ?)`;

        conn.query(outcomes_by_dept, [dept_id], function (err, results) {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

// insert outcomes
module.exports.insert_outcome = insert_outcome;

// update outcomes
module.exports.update_outcome = update_outcome;

// get outcomes by department
module.exports.get_outcomes_by_department = get_outcomes_by_department;