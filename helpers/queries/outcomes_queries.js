var conn = require("../mysqlConnection").mysql_pool; //pool connection


function insert_outcome(data, callback) {
    `Insert values into the table department`
    // outc_ID, outc_name, outc_description, date_created, prog_ID

    let insert_query = `insert into STUDENT_OUTCOME (outc_name, outc_description, prog_ID) values(?, ?, ?);`;

    conn.query(insert_query, data, function (err, results, fields) {
        if (err) {
            return callback(err, null)
        };
        // console.log(results)
        return callback(null, results);
    });
}

function update_outcome(data, callback) {
    `Insert values into the table department`

    // outc_ID, outc_name, outc_description, date_created, prog_ID

    let update_query = `update STUDENT_OUTCOME set outc_name = ?, outc_description = ?, prog_ID = ? where outc_ID = ?; `;

    //Exe query
    conn.query(update_query, data, function (err, results, fields) {
        if (err) {
            return callback(err, null)
        };
        // console.log(results)
        return callback(null, results);
    });
}
module.exports.insert_outcome = insert_outcome;
module.exports.update_outcome = update_outcome;
