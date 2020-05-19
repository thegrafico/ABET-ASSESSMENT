var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;
const table = require("../DatabaseTables");


/**
 * insert_into_study_program - Create a new study program
 * @param {Object} data -> keys {"name", "department_id"} 
 * @return {Promise} resolve with true
 */
function insert_into_study_program(data) {

    return new Promise(function (resolve, reject) {

        let insert_query = `INSERT INTO ${table.study_program} (prog_name, dep_ID, target_score) values(?, ?, ?);`;
        conn.query(insert_query, [data.name, data.department_id, data.target_score], function (err, results, fields) {
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

        let update_query = `UPDATE ${table.study_program} set prog_name = ?, dep_ID = ?, target_score = ? where prog_ID = ?`;
        //Exe query
        conn.query(update_query, [data.name, data.department_id, data.target_score, data.program_id,], function (err, results) {
            if (err) reject(err);
            else resolve(true);
        });
    });
}

module.exports.insert_into_study_program = insert_into_study_program;
module.exports.update_study_program = update_study_program;
