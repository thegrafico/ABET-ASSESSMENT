var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;



/**
 * get_evaluation_rubric_by_id -  get evaluation rubric by id
 * @param {Number} id id of the rubric
 * @return {Promise} resolve with all data
 */
function get_evaluation_rubric_by_id(id) {

    return new Promise(function (resolve, reject) {

        let get_query = `SELECT * FROM evaluation_rubric INNER JOIN student_outcome USING(outc_ID) 
        INNER JOIN performance_rubric USING(rubric_ID)
        INNER JOIN perf_criteria on perf_criteria.perC_ID = performance_rubric.perC_ID
        INNER JOIN study_program on student_outcome.prog_ID = study_program.prog_ID
        WHERE evaluation_rubric.rubric_ID = ?;`;

        conn.query(get_query, [id], function (err, results) {
            if (err) return reject(err);
            if (results.length == 0) return resolve(results);

            let criteria = [];

            results.forEach((each_rubric) => {
                criteria.push(each_rubric["perC_ID"].toString());
            });
            results[0]["perC_ID"] = criteria;
            resolve(results[0]);
        });
    });
}


/**
 * get_all_evaluations_rubric -  get all evaluations rubric
 * @return {Promise} resolve with all data
 */
function get_all_evaluations_rubric() {

    return new Promise(function (resolve, reject) {

        let get_query = `SELECT * FROM evaluation_rubric INNER JOIN student_outcome using (outc_ID)
        INNER JOIN study_program 
        ON student_outcome.prog_ID = study_program.prog_ID;`;

        conn.query(get_query, function (err, results) {
            if (err)
                reject(err);
            else
                resolve(results);
        });
    });
}


/**
 * insert_evaluation_rubric -  Create new evaluation rubric
 * @param {Object} data -> keys {"name", "description", "outcome_id"} 
 * @return {Promise} resolve with true
 */
function insert_evaluation_rubric(data) {

    return new Promise(function (resolve, reject) {

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

    return new Promise(function (resolve, reject) {

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

    return new Promise(function (resolve, reject) {

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
module.exports.get_all_evaluations_rubric = get_all_evaluations_rubric;
module.exports.insert_evaluation_rubric_INTO_Perfomance_Rubric = insert_evaluation_rubric_INTO_Perfomance_Rubric;
module.exports.get_evaluation_rubric_by_id = get_evaluation_rubric_by_id;
