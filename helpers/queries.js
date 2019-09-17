var conn = require("./mysqlConnection").mysql_pool; //pool connection


function get_user_list(callback){
    `Getting the user's information from the database`

    console.log("Getting user data")

    let userList = `Select *
                    From USER natural join USER_PROFILES natural join PROFILE`;

    conn.query(userList, function (err, results, fields) {
        if (err){
           return callback(err, null)
        };
        // console.log(results)
       return callback(null, results);
    });
}


module.exports.get_user_list = get_user_list;