var { db } = require("../mysqlConnection");
var conn = db.mysql_pool;

/**
 * insert_into_term create new academic term
 * @param {Object} data -> id of the user 
 * @return {Promise} resolve with true
 */
function insert_into_term(data){

    return new Promise(function (resolve, reject){

        let insert_term_query = `insert into ACADEMIC_TERM (term_name) values(?);`;

        conn.query(insert_term_query, data.name, function (err, results) {
            if (err)
                reject(err);
            else
                resolve(results);
        });
    });
}

/**
 * update_term Update a term by id
 * @param {Object} data ->key {"name", "id"} 
 * @return {Promise} resolve with true
 */
function update_term(data){
    return new Promise(function(resolve, reject){

        let update_query = `update ACADEMIC_TERM set term_name= ? where term_ID = ?`;
        //Exe query
        conn.query(update_query, [data.name, data.id], function (err, results) {
            if (err)
                reject(err);
            else
                resolve(results);
        });
    });
}

module.exports.insert_into_term = insert_into_term;
module.exports.update_term = update_term;
