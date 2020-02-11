var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;
/**
 * [get_table_info get all data from a table]
 * @param  {String} table_name name of the table in the database
 * @return {Promise} resolve with results of database
 */
function get_table_info(table_name){
    `Getting data from any table`
    
    return new Promise(function (resolve, reject){
        let get_table_info = `Select * From ??`;

        conn.query(get_table_info, [table_name], function (err, results, fields) {
            if (err) 
                reject(err);
            else
                resolve(results);
        });
    });
    
}

/**
 * get_table_info_by_id - get a table info
 * @param  {Object} table_info name of the table in the database
 * @return {Promise} resolve with results of database
 */
function get_table_info_by_id(table_info){

	let find_dep_query = `Select * From ?? where ?? = ?;`;

    let data = [table_info.from, table_info.where, table_info.id];

    return new Promise(function(resolve, reject){
        conn.query(find_dep_query, data, function (err, results) {

            if (err)
                reject(err || "Error getting table information");
            else
                resolve(results);
        });    
    });
}

function get_table_info_by_id_naturalJoin(table_info, callback){

    `Getting data from any table by id`

	let findDep = `Select *
                From ?? natural join ??
                where ?? = ?;`;

    let data = [table_info.from, table_info.from2, table_info.where, table_info.id];

    console.log("GETTING THE INFO OF THE TABLE: ", data);
    try {
        conn.query(findDep, data, function (err, results, fields) {

            if (err) {
                return callback(err, null)
            };
            return callback(null, results);
        });
    } catch (error) {
        // console.log("ERROR IN get_table_info_id");
        return callback(error, null);
    }

}

function delete_record_by_id(table_info, callback){
    `Remove a record by id`

	let delete_query = `DELETE
                  FROM ??
                  WHERE ?? = ?;`;

    let data = [table_info.from, table_info.where, table_info.id];

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
module.exports.get_table_info_by_id_naturalJoin = get_table_info_by_id_naturalJoin;
module.exports.delete_record_by_id = delete_record_by_id;
