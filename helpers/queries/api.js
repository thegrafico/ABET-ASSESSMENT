var {db} = require("../mysqlConnection");
var conn = db.mysql_pool;


/**
 * get_user_list - get all users
 * @param {Number} rubric_id id of the rubric
 * @return {Promise} resolve with results of database
 */
async function get_performance_from_rubric(rubric_id) {
    return new Promise(function (resolve, reject) {
        if (rubric_id == undefined || isNaN(rubric_id)) return reject("Error with the rubric id parameter");

        let performance_query = `SELECT perC_Desk 
        FROM EVALUATION_RUBRIC INNER JOIN PERFORMANCE_RUBRIC USING(rubric_ID)
        INNER JOIN PERF_CRITERIA ON PERFORMANCE_RUBRIC.perC_ID = PERF_CRITERIA.perC_ID
        WHERE EVALUATION_RUBRIC.rubric_ID = ?`;

        conn.query(performance_query, [rubric_id], function (err, results, fields) {
            if (err)
                reject(err);
            else
                resolve(results);
        });
    });
}

module.exports.get_performance_from_rubric = get_performance_from_rubric;