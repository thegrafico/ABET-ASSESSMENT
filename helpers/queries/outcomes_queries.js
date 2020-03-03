var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;


/**
 * insert_outcome -  Create a new outcome
 * @param {Object} data -> keys: {"outcome_name", "outcome_description", "program_id"} 
 * @return {Promise} resolve with all profiles
 */
function insert_outcome(data) {
    
    return new Promise(function(resolve, reject){
        
        let insert_query = `INSERT INTO STUDENT_OUTCOME (outc_name, outc_description, prog_ID) values(?, ?, ?);`;

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

    return new Promise(function(resolve, reject){

        let update_query = `UPDATE STUDENT_OUTCOME set outc_name = ?, 
        outc_description = ?, prog_ID = ? where outc_ID = ?; `;

        conn.query(update_query, [data.outc_name, data.outc_description, data.prog_ID, data.outc_ID],
            function (err, results) {
            if (err) reject(err);
            else resolve(results);
        });
    });
}


/**
 * get_outcome_by_study_program -  get outcomes by study program
 * @param {Number} program_id study program id
 * @return {Promise} resolve with all study programs
 */
function get_outcome_by_study_program(program_id) {
    
    return new Promise(function(resolve, reject){
        
        let get_query = `SELECT * FROM student_outcome WHERE student_outcome.prog_ID = ?`;

        conn.query(get_query, [program_id],function (err, results) {
            if (err)
               reject(err);
            else
                resolve(results);
        });
    });
}
module.exports.insert_outcome = insert_outcome;
module.exports.update_outcome = update_outcome;
module.exports.get_outcome_by_study_program = get_outcome_by_study_program;
