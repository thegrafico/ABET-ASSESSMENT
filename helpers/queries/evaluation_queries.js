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

function update_evalRub(data, callback) {
    // `Insert values into the table department`
    // outc_ID, outc_name, outc_description, date_created, prog_ID
    console.log(data);
    let update_query = `update EVALUATION_RUBRIC
                        set rubric_name = ?, rubric_description = ?, outc_ID = ?
                        where rubric_ID = ?`;

    conn.query(update_query, data, function (err, results, fields) {
        if (err) {
            return callback(err, null)
        };
        // console.log(results)
        return callback(null, results);
    });
}

function insert_evalRubPerfCrit(data, callback) {
    // `Insert values into the Evaluation Rubric relation with Performance Criteria`
    let insert_query = `insert into PERFORMANCE_RUBRIC (rubric_ID, perC_ID) values(?, ?);`;

    conn.query(insert_query, data, function (err, results, fields) {
        if (err) {
            return callback(err, null)
        };
        // console.log(results)
        return callback(null, results);
    });
}

module.exports.insert_evaluation_rubric = insert_evaluation_rubric;
module.exports.insert_evalRubPerfCrit = insert_evalRubPerfCrit;
module.exports.update_evalRub = update_evalRub;
