var conn = require("../mysqlConnection").mysql_pool; //pool connection


function insert_evalRub(data, callback) {
    `Insert values into the table department`
    // outc_ID, outc_name, outc_description, date_created, prog_ID

    let insert_query = `insert into EVALUATION_RUBRIC (rubric_name, rubric_description, outc_ID) values(?, ?, ?);`;

    conn.query(insert_query, data, function (err, results, fields) {
        if (err) {
            return callback(err, null)
        };
        // console.log(results)
        return callback(null, results);
    });
}

module.exports.insert_evalRub = insert_evalRub;
