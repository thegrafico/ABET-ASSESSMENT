var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;


function insert_into_deparment(data, callback){
    `Insert values into the table department`

    let insert_query = `insert into DEPARTMENT (dep_name, dep_description) values(?, ?);`;

    conn.query(insert_query, data, function (err, results, fields) {
        if (err) {
            return callback(err, null)
        };
        // console.log(results)
        return callback(null, results);
    });
}

function update_deparment(data, callback){
    `Insert values into the table department`

    let update_query = `update DEPARTMENT set dep_name= ?, dep_description= ? where dep_ID= ?`;

    //Exe query
    conn.query(update_query, data, function (err, results, fields) {
        if (err) {
            return callback(err, null)
        };
        // console.log(results)
        return callback(null, results);
    });
}
module.exports.insert_into_deparment = insert_into_deparment;
module.exports.update_deparment = update_deparment;
