var conn = require("../mysqlConnection").mysql_pool; //pool connection


function insert_into_term(data, callback){

    let insert_term_query = `insert into ACADEMIC_TERM (term_name) values(?);`;

    conn.query(insert_term_query, data, function (err, results, fields) {
        if (err) {
            return callback(err, null)
        };
        return callback(null, results);
    });
}

module.exports.insert_into_term = insert_into_term;
// module.exports.update_term = update_term;
