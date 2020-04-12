var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;

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

// module.exports.insert_perC = insert_perC;
// module.exports.findOrder = findOrder;
module.exports.create_performance = create_performance;
module.exports.update_performance = update_performance;
