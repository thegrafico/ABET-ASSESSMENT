var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;


/**
 * insert_outcome -  Create a new outcome
 * @param {Object} data -> keys: {"outcome_name", "outcome_description", "program_id"} 
 * @return {Promise} resolve with all profiles
 */
function insert_outcome(data) {
    
    return new Promise(function(resolve, reject){
        
        let insert_query = `insert into STUDENT_OUTCOME (outc_name, outc_description, prog_ID) values(?, ?, ?);`;

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

        let update_query = `update STUDENT_OUTCOME set outc_name = ?, 
        outc_description = ?, prog_ID = ? where outc_ID = ?; `;

        conn.query(update_query, [data.outc_name, data.outc_description, data.prog_ID, data.outc_ID],
            function (err, results) {
            if (err) reject(err);
            else resolve(results);
        });
    });
}
module.exports.insert_outcome = insert_outcome;
module.exports.update_outcome = update_outcome;