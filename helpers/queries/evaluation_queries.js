var conn = require("../mysqlConnection").mysql_pool; //pool connection


function insert_evalRub(data, callback) {
    // `Insert values into the table department`
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

module.exports.insert_evalRub = insert_evalRub;
module.exports.update_evalRub = update_evalRub;
