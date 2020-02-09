var mysql = require('mysql');
var config;

try{
  var credentials = require("./raul_credentials");
}catch (err){
  console.log("Credentials file for mysqlConnections dont exits");
  throw err;
}


//forma estandar de conectarse a mysql utilizando nodejs
//se cambia el database, user y password, dependiendo de las necesidades

//FOR REMOTE CONNECTION
// config = {
//       mysql_pool : mysql.createPool({

//       //establece limite de personas conectadas a la base de datos
//       connectionLimit : 15,

// // <<<<<<< HEAD
// //     //establece el route basico donde se ouede accessar
// //     host     : '192.168.1.200',          //THIS IS THE SAME FOR YOUR
// //     user     : 'root',               //THIS IS THE SAME FOR YOUR
// //     password : 'robolab',         //HERE GO YOUR PASSWORD TO ENTER IN YOUR DB
// //     database : 'ABET'   //HERE GO THE DATABASE THAT WE ARE GONNA USED
// // =======
//       //establece basico el route donde se ouede accessar
//       host     : '70.45.219.43',  //THIS IS THE SAME FOR YOUR
//       user     : 'root',      //THIS IS THE SAME FOR YOUR
//       password : 'abetserver',        //HERE GO YOUR PASSWORD TO ENTER IN YOUR DB
//       database : 'ABET'   //HERE GO THE DATABASE THAT WE ARE GONNA USED
// // >>>>>>> 02e32c1e4d1f0c9d3f7cfeff1a9278bb7ba39927
//   })
// };


var options = {
  host     : credentials.host,          //THIS IS THE SAME FOR YOUR
  user     : credentials.user,               //THIS IS THE SAME FOR YOUR
  password : credentials.password,         //HERE GO YOUR PASSWORD TO ENTER IN YOUR DB
  database : "ABET",   //HERE GO THE DATABASE THAT WE ARE GONNA USED
  connectionLimit : 15,
  clearExpired: true,
  checkExpirationInterval: 900000, // 15 minutes
  expiration: 8640000, // 2 hours
  schema: {
      tableName: 'custom_sessions_table_name',
      columnNames: {
          session_id: 'custom_session_id',
          expires: 'custom_expires_column_name',
          data: 'custom_data_column_name'
      }
  }
};

// FOR LOCAL CONNECTION
config = {
  mysql_pool : mysql.createPool(options)
};

//parte de node js que deja que esta funcion
//se pueda utilizar en otro codigo
// module.exports.options = options;
module.exports.db = config;
module.exports.options = options;