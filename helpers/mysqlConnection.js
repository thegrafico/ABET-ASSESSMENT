var mysql = require('mysql');

var config;


 /*In case you dont have this file, just delete this code and put your credentials in the options object*/
// try{
//   var credentials = require("./raul_credentials");
// }catch (err){
//   console.log("ERROR IN /helpers/mysqlconnection. Credentials are missing");
// }

try{
  var credentials = require("./noah_credentials");
}catch (err){
  console.log("ERROR IN /helpers/mysqlconnection. Credentials are missing");
}
/* For local database connection */ 
var options = {
  host     : credentials.host,              //THIS IS THE SAME FOR YOUR
  user     : credentials.user,             //THIS IS THE SAME FOR YOUR
  password : credentials.password,         //HERE GO YOUR PASSWORD TO ENTER IN YOUR DB
  database : "ABET",                       //HERE GO THE DATABASE THAT WE ARE GONNA USED
  port: 3306,
  connectionLimit : 15,
  clearExpired: true,
  checkExpirationInterval: 1900000, 
  expiration: 3600000, 
  schema: {
      tableName: 'custom_sessions_table_name',
      columnNames: {
          session_id: 'custom_session_id',
          expires: 'custom_expires_column_name',
          data: 'custom_data_column_name'
      },
  }
};


/* For online database connection */ 
// var options = {
//   host     : '70.45.219.43',
//   user     : 'root',
//   password : 'abetserver',
//   database : 'ABET', 
//   connectionLimit : 15,
//   clearExpired: true,
//   checkExpirationInterval: 1900000, // 15 minutes
//   expiration: 3600000, // 1 hours
//   schema: {
//       tableName: 'custom_sessions_table_name',
//       columnNames: {
//           session_id: 'custom_session_id',
//           expires: 'custom_expires_column_name',
//           data: 'custom_data_column_name'
//       }
//   }
// };

// FOR Database Connection
config = {
  mysql_pool : mysql.createPool(options)
};


// exports the config
module.exports.db = config;
module.exports.options = options;