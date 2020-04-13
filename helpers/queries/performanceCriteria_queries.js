var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;
const table = require("../DatabaseTables");

/**
 * create_performance ->  Create a new record of performance Criteria
 * @param {Object} rubric keys {"description", "order", "outcome_id"}
 * @return {Promise} resolve with true
 */
function create_performance(rubric) {

	return new Promise(function (resolve, reject) {

		if (rubric == undefined) return reject("Empty parameters");

		// variable that defines the query
		let insert_query = `INSERT INTO PERF_CRITERIA (perC_Desk, perC_order, outc_ID) values(?, ?, ?);`;

		// query to insert new a Performance Criteria
		conn.query(insert_query, [rubric.description, rubric.order, rubric.outcome_id], function (err, results, fields) {
			if (err) return reject(err);

			resolve(true);
		});
	});
}

/**
 * update_performance ->  Update one record of performance rubric
 * @param {Object} rubric keys {"description", "order", "id"}
 * @return {Promise} resolve with true
 */
function update_performance(rubric) {
	return new Promise(function (resolve, reject) {

		if (rubric == undefined) return reject("Error in the parameter");

		let update_query = `UPDATE PERF_CRITERIA set perC_Desk = ?, perC_order = ? where perC_ID = ?`;

		conn.query(update_query, [rubric.description, rubric.order, rubric.id], function (err, results, fields) {
			if (err) return reject(err);
			resolve(true);
		});
	});
}

/**
 * get performance criteria by outcome id
 * @param {Number} outcome_id - id of the outcome
 * @returns {Promise} - resolve with results
 */
function get_performance_by_outcome_id(outcome_id) {

	return new Promise(function (resolve, reject) {

		let find_dep_query = `SELECT * FROM ${table.performance_criteria} WHERE outc_ID = ? 
		ORDER BY ${table.performance_criteria}.	perC_order ASC;`;

		conn.query(find_dep_query, [outcome_id], function (err, results) {
			if (err)
				reject(err);
			else
				resolve(results);
		});
	});
}

// module.exports.insert_perC = insert_perC;
// module.exports.findOrder = findOrder;
module.exports.create_performance = create_performance;
module.exports.update_performance = update_performance;
module.exports.get_performance_by_outcome_id = get_performance_by_outcome_id;

