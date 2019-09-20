var conn = require("../mysqlConnection").mysql_pool; //pool connection

function insert_into_study_program(data, callback){
    `Insert values into the table department`
    // prog_ID int PRIMARY KEY auto_increment,
    // prog_name varchar(255) NOT NULL,
    // date_created datetime default CURRENT_TIMESTAMP,
    // dep_ID int, --

    let insert_query = `insert into STUDY_PROGRAM (prog_name, dep_ID) values(?, ?);`;

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
module.exports.insert_into_study_program = insert_into_study_program;
module.exports.update_deparment = update_deparment;
