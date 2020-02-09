var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;

function insert_into_term(data, callback){

    let insert_term_query = `insert into ACADEMIC_TERM (term_name) values(?);`;

    conn.query(insert_term_query, data, function (err, results, fields) {
        if (err) {
            return callback(err, null)
        };
        return callback(null, results);
    });
}

function update_term(data, callback){
    let update_query = `update ACADEMIC_TERM set term_name= ? where term_ID = ?`;
    //Exe query
    conn.query(update_query, data, function (err, results, fields) {
        if (err) {
            return callback(err, null)
        };
        // console.log(results)
        return callback(null, results);
    });
}



module.exports.insert_into_term = insert_into_term;
module.exports.update_term = update_term;
