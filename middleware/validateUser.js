/** 
 * Author: Raul Pichardo
 * 
 * Class Description: middleware to validate the user seccion and roles
*/
var { db } = require("../helpers/mysqlConnection"); //pool connection
conn = db.mysql_pool;


/**
 * [get_user_role description]
 * @param  {String} email email of the user
 * @return {Promise} resolve with results of database
 */
async function get_user_role(email){
    `Redirect the user depending the role`
    console.log("Getting user role [ValidateUser route]");

    return new Promise(function(resolve, reject){

        if (email == undefined)
            reject("invalid email");
    
        //Look for the email in the DB,if there is one, get the profile data 
        let query = `SELECT * FROM (SELECT * FROM USER NATURAL JOIN USER_PROFILES WHERE USER.email = ?) as NT,
        PROFILE WHERE NT.profile_ID = PROFILE.profile_ID;`;

        conn.query(query, [email.toLowerCase()], function(err, results){
            if (err)
                reject(err);
            else{
                if (results.length > 0){
                    resolve(results[0]);
                }else{
                    reject("Not user found");
                }
            }
        });
    });
}

function user_is_login(req, res, next){
    
    let sess = req.session;

    if (sess != undefined && sess.userEmail){
        next();
    }else{
        // TODO: redirect to login
        // res.redirect("/login");
        res.status(200).send("NEED TO LOGIN");
    }
}

// Returns 
module.exports.get_user_role = get_user_role;
module.exports.user_is_login  = user_is_login;