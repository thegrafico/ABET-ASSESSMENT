var conn = require("../mysqlConnection").mysql_pool; //pool connection


function get_table_info(table_name, callback){
  
    `Getting data from any table`

    let get_table_info = `Select * From ??`;

    conn.query(get_table_info, [table_name], function (err, results, fields) {
        if (err) {
            return callback(err, null)
        };
        // console.log(results)
        return callback(null, results);
    });
}

function get_table_info_by_id(table_info, callback){
  
    `Getting data from any table by id`

	let findDep = `Select *
                From ??
                where ?? = ?;`;

    let data = [table_info.table_name, table_info.atribute, table_info.id];
    conn.query(findDep, data, function (err, results, fields) {
        if (err) {
            return callback(err, null)
        };
        // console.log(results)
        return callback(null, results);
    });

}

function delete_record_by_id(table_info, callback){
    `Remove a record by id`

	let delete_query = `DELETE
                  FROM ??
                  WHERE ?? = ?;`

    let data = [table_info.table_name, table_info.atribute, table_info.id];
    
    conn.query(delete_query, data, function (err, results, fields) {
        if (err) {
            return callback(err, null)
        };
        // console.log(results)
        return callback(null, results);
    });

}

module.exports.get_table_info = get_table_info;
module.exports.get_table_info_by_id = get_table_info_by_id;
module.exports.delete_record_by_id = delete_record_by_id;
