var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;


/**
 * insert_into_study_program - Create a new study program
 * @param {Object} data -> keys {"name", "department_id"} 
 * @return {Promise} resolve with true
 */
function insert_into_study_program(data) {

    return new Promise(function (resolve, reject) {

        let insert_query = `INSERT INTO STUDY_PROGRAM (prog_name, dep_ID) values(?, ?);`;
        conn.query(insert_query, [data.name, data.department_id], function (err, results, fields) {
            if (err) reject(err);
            else resolve(true);
        });
    });
}


/**
 * update_study_program - update a study program by id
 * @param {Object} data -> keys {"name", "department_id", "program_id"} 
 * @return {Promise} resolve with true
 */
function update_study_program(data) {

    return new Promise(function (resolve, reject) {

        let update_query = `UPDATE STUDY_PROGRAM set prog_name = ?, dep_ID = ? where prog_ID = ?`;
        //Exe query
        conn.query(update_query, [data.name, data.department_id, data.program_id], function (err, results) {
            if (err) reject(err);
            else resolve(true);
        });
    });
}

module.exports.insert_into_study_program = insert_into_study_program;
module.exports.update_study_program = update_study_program;
