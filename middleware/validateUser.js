/** 
 * Author: Raul Pichardo
 * 
 * Class Description: middleware to validate the user seccion and roles
*/
var conn = require("../helpers/mysqlConnection").mysql_pool; //pool connection
var authHelper = require('../helpers/auth');



async function get_user_role(req, res, next){
    `Redirect the user depending the role`

    // if (req.session.user != null) {return next()}
    console.log("Midleware for user role");
    try{
        const accessToken = await authHelper.getAccessToken(req.cookies, res);
        res.locals.currentUser = req.cookies.graph_user_name;
        req.session.userEmail = req.cookies.graph_user_email;
        req.session.x = "dasdasdasd"


        console.log("Seccion of the user: ", req.session.user);

        //Look for the email in the DB,if there is one, get the profile data 
        let query = `SELECT * FROM (SELECT * FROM USER NATURAL JOIN USER_PROFILES WHERE USER.email = ?) as NT,
        PROFILE WHERE NT.profile_ID = PROFILE.profile_ID;`;

        conn.query(query, [req.session.userEmail.toLowerCase()], function(err, results){
            if (err) {
                console.log(err);
                res.rediret("courses");
            }
            console.log("ROLE OF THE USER: ", results);
            
            return next()
        });

    }catch(err){
        //Flash message should be here
        res.send(`ERROR IN GET USER ROLE ${err}`)
        res.rediret("courses");
    }
}

module.exports.get_user_role = get_user_role;