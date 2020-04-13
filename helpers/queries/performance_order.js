
var { options } = require("../mysqlConnection");
var mysql = require("mysql");
const table = require("../DatabaseTables");
options.multipleStatements = true;
var connection = mysql.createConnection(options);
connection.connect();


/**
 * @param {Array[Object]} data - Array of object - keys [performance_id, order]
 * @returns {Promise} - resolve with true
 */
module.exports.update_performances_order = function update_performances_order(data) {
    return new Promise(function (resolve, reject) {

        connection.beginTransaction(function (err) {
            if (err) { return reject(err) }

            let setNUll = `UPDATE PERF_CRITERIA SET PERF_CRITERIA.perC_order = NULL WHERE perC_ID IN ?`;

            let performance_id = data.map(each => each["performance_id"]);

            console.log(performance_id);

            connection.query(setNUll, [[performance_id]], async function (error, results) {

                if (error) return connection.rollback(function () { reject(error); });

                let queries = '';

                data.forEach(function (item) {
                    queries += mysql.format("UPDATE PERF_CRITERIA SET PERF_CRITERIA.perC_order = ? WHERE perC_ID = ?; ", [item.order, item.performance_id]);
                });

                connection.query(queries, function (error, results) {

                    if (error) return connection.rollback(function () { reject(error); });

                    connection.commit(function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                reject(err);
                            });
                        }
                        resolve(true);
                    });
                });
            });
        });
    });
}
