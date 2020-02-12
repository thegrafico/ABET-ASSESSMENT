var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;

/**
 * insert_into_deparment -> Create new department
 * @param {Array} data -> [dep_name, dep_description] 
 * @return {Promise} resolve with user data
 */
function insert_into_deparment(data){

    return new Promise(function(resolve, reject){
        // query for department insert
        let insert_query = `insert into DEPARTMENT (dep_name, dep_description) values(?, ?);`;

        conn.query(insert_query, data, function (err, results) {
            if (err) {
                reject(err || "Error inserting department");
            }else
                resolve(true);
        });
    });
}

/**
 * update_deparment ->  update department data
 * @param {Array} data -> [dep_name, dep_description, dep_ID] 
 * @return {Promise} resolve with user data
 */
function update_deparment(data){
    
    return new Promise(function(resolve, reject){

        let update_query = `update DEPARTMENT set dep_name= ?, dep_description= ? where dep_ID= ?`;

        //Exe query
        conn.query(update_query, data, function (err, results) {
            if (err)
                reject(err || "Error updating department");
            else            
                resolve(true);
        });
    });

}
module.exports.insert_into_deparment = insert_into_deparment;
module.exports.update_deparment = update_deparment;
