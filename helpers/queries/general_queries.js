var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;
/**
 * [get_table_info get all data from a table]
 * @param  {String} table_name name of the table in the database
 * @return {Promise} resolve with results of database
 */
function get_table_info(table_name){

    return new Promise(function (resolve, reject){
        let query_get = `Select * From ??`;

        conn.query(query_get, [table_name], function (err, results) {
            if (err) 
                reject(err);
            else
                resolve(results);
        });
    });   
}
/**
 * get_table_info_by_id - get a table info
 * @param  {Object} table_info keys = {"from", "where", "id"}
 * @return {Promise} resolve with results of database
 */
function get_table_info_by_id(table_info){

	let find_dep_query = `Select * From ?? where ?? = ?;`;

    let data = [table_info.from, table_info.where, table_info.id];

    return new Promise(function(resolve, reject){
        conn.query(find_dep_query, data, function (err, results) {
            if (err || results.length == 0)
                reject(err || "Error getting table information");
            else
                resolve(results);
        });    
    });
}


/**
 * get_table_info_by_id_naturalJoin - get a table info
 * @param  {Object} table_info -> key {"from", "join", "where", "id"}
 * @return {Promise} resolve with results of database
 */
function get_table_info_by_id_naturalJoin(table_info){

	let findDep = `Select * From ?? natural join ?? where ?? = ?;`;

    let data = [table_info.from, table_info.join, table_info.where, table_info.id];

    return new Promise(function(resolve, reject){

        conn.query(findDep, data, function (err, results) {

            if (err)
                reject(err || "Error getting the table information");
            else
                resolve(results);
        });
    });
}

/**
 * get_table_info_inner_join - get a table info
 * @param  {Object} table_info -> key {"from", "join", "using"}
 * @return {Promise} resolve with results of database
 */
function get_table_info_inner_join(table_info){

	let findDep = `Select * From ?? INNER JOIN ?? USING (??)`;

    let data = [table_info.from, table_info.join, table_info.using];

    return new Promise(function(resolve, reject){

        conn.query(findDep, data, function (err, results) {

            if (err)
                reject(err || "Error getting the table information");
            else
                resolve(results);
        });
    });
}

/**
 * delete_record_by_id - Delete the element by id
 * @param  {Object} table_info -> key {"from", "where", "id"}
 * @return {Promise} resolve with true or error
 */
function delete_record_by_id(table_info){

	let delete_query = `DELETE FROM ?? WHERE ?? = ?;`;

    let data = [table_info.from, table_info.where, table_info.id];

    return new Promise(function(resolve, reject){

        conn.query(delete_query, data, function (err, results) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
}


module.exports.get_table_info = get_table_info;
module.exports.get_table_info_by_id = get_table_info_by_id;
module.exports.get_table_info_by_id_naturalJoin = get_table_info_by_id_naturalJoin;
module.exports.delete_record_by_id = delete_record_by_id;
module.exports.get_table_info_inner_join = get_table_info_inner_join;


