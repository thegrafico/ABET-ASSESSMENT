var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;


/**
 * insert_evaluation_rubric -  Create new evaluation rubric
 * @param {Object} data -> keys {"name", "description", "outcome_id"} 
 * @return {Promise} resolve with true
 */
function insert_evaluation_rubric(data) {

    return new Promise(function (resolve, reject){

        let insert_query = `insert into EVALUATION_RUBRIC (rubric_name, rubric_description, outc_ID) values(?, ?, ?);`;

        conn.query(insert_query, [data.name, data.description, data.outcome_id], function (err, results) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
}
/**
 * update_evaluation_rubric -  update the evaluation rubric
 * @param {Object} data -> keys {"name", "description", "rubric_id"} 
 * @return {Promise} resolve with true
 */
function update_evaluation_rubric(data) {

    return new Promise(function (resolve, reject){

        let update_query = `
        update EVALUATION_RUBRIC set rubric_name = ?, rubric_description = ?
        where rubric_ID = ?`;
        
        data = [data.name, data.description, data.rubric_id];

        conn.query(update_query, data, function (err, results, fields) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
}

/**
 * insert_evaluation_rubric_INTO_Perfomance_Rubric - Update relational db
 * @param {Object} data -> keys {"rubric_id", "perfomance_id"} 
 * @return {Promise} resolve with true
 */
function insert_evaluation_rubric_INTO_Perfomance_Rubric(data) {
    
    return new Promise(function(resolve, reject){

        let insert_query = `insert into PERFORMANCE_RUBRIC (rubric_ID, perC_ID) values(?, ?);`;

        conn.query(insert_query, [data.rubric_id, data.perfomance_id], function (err, results, fields) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
}

module.exports.insert_evaluation_rubric = insert_evaluation_rubric;
module.exports.update_evaluation_rubric = update_evaluation_rubric;
module.exports.insert_evaluation_rubric_INTO_Perfomance_Rubric = insert_evaluation_rubric_INTO_Perfomance_Rubric;
