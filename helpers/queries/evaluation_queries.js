var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;



/**
 * get_evaluation_rubric_by_id -  get evaluation rubric by id
 * @param {Number} id id of the rubric
 * @return {Promise} resolve with all data
 */
function get_evaluation_rubric_by_id(id) {

    return new Promise(function (resolve, reject) {

        let get_query = `SELECT * FROM EVALUATION_RUBRIC INNER JOIN STUDENT_OUTCOME USING(outc_ID) 
        INNER JOIN EVALUATION_RUBRIC USING(rubric_ID)
        INNER JOIN PERF_CRITERIA on PERF_CRITERIA.perC_ID = PERFORMANCE_RUBRIC.perC_ID
        INNER JOIN STUDY_PROGRAM on STUDENT_OUTCOME.prog_ID = STUDY_PROGRAM.prog_ID
        WHERE EVALUATION_RUBRIC.rubric_ID = ?;`;

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

        let get_query = `SELECT * FROM EVALUATION_RUBRIC INNER JOIN STUDENT_OUTCOME using (outc_ID)
        INNER JOIN STUDY_PROGRAM 
        ON STUDENT_OUTCOME.prog_ID = STUDY_PROGRAM.prog_ID;`;

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
 * @param {Object} rubric -> keys {"name", "description", "outcome_id"} 
 * @return {Promise} resolve with true
 */
function insert_evaluation_rubric(rubric) {

    return new Promise(function (resolve, reject) {

        let insert_query = `INSERT INTO 
        EVALUATION_RUBRIC (rubric_name, rubric_description, outc_ID, date_created)
        values(?, ?, ?, ?);`;

        conn.query(insert_query, [rubric.name, rubric.description, rubric.outcome_id, new Date()], function (err, results) {
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
function update_evaluation_rubric(rubric) {

    return new Promise(function (resolve, reject) {

        let update_query = `
        UPDATE EVALUATION_RUBRIC set rubric_name = ?, rubric_description = ?, outc_ID = ?, date_modified = ?
        WHERE rubric_ID = ?`;

        data = [rubric.name, rubric.description, rubric.outcome_id, new Date(), rubric.id];

        conn.query(update_query, data, function (err, results) {
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
function insert_perfomance_Rubric(rubric_id, performances_id) {

    return new Promise(function (resolve, reject) {

        let insert_query = `INSERT INTO PERFORMANCE_RUBRIC (rubric_ID, perC_ID) values ?`;

        let values = [];
        performances_id.forEach((element) => {
            if (element != undefined && element.length != 0 && !isNaN(element)) {
                values.push([rubric_id, parseInt(element)])
            }
        });

        conn.query(insert_query, [values], function (err, results) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
}

/**
 * update_deparment ->  update department data
 * @param {Number} user_id id of the user
 * @param {Array} department_ids all id of the department
 * @return {Promise} resolve with user data
 */
function remove_performance(rubric_id, performances_id) {

    return new Promise(function (resolve, reject) {

        if (performances_id == undefined || performances_id.length == 0) {
            return reject("Cannot find any department to remove");
        }

        let to_insert = [];
        performances_id.forEach((element) => {
            to_insert.push([rubric_id, element]);
        });

        let update_query = `DELETE FROM PERFORMANCE_RUBRIC WHERE (rubric_ID, perC_ID) IN (?)`;

        //Exe query
        conn.query(update_query, [to_insert], function (err, results) {
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
module.exports.insert_perfomance_Rubric = insert_perfomance_Rubric;
module.exports.get_evaluation_rubric_by_id = get_evaluation_rubric_by_id;
module.exports.remove_performance = remove_performance;


