var mysql = require('mysql');
// const credentials = require('./raul_credentials');

// const database = require('./database');
var config;


//forma estandar de conectarse a mysql utilizando nodejs
//se cambia el database, user y password, dependiendo de las necesidades

//FOR REMOTE CONNECTION
config = {
    mysql_pool : mysql.createPool({

      //establece limite de personas conectadas a la base de datos
      connectionLimit : 15,

      //establece el route basico donde se ouede accessar
      host     : '70.45.220.247',  //THIS IS THE SAME FOR YOUR
      user     : 'root',      //THIS IS THE SAME FOR YOUR
      password : 'abetserver',        //HERE GO YOUR PASSWORD TO ENTER IN YOUR DB
      database : 'ABET'   //HERE GO THE DATABASE THAT WE ARE GONNA USED
  })
};


// // FOR LOCAL CONNECTION
// config = {
//   mysql_pool : mysql.createPool({
//     //establece limite de personas conectadas a la base de datos
//     connectionLimit : 15,
//
//     //establece el route basico donde se ouede accessar
//     host     : 'localhost',          //THIS IS THE SAME FOR YOUR
//     user     : 'root',               //THIS IS THE SAME FOR YOUR
//     password : credentials.password,         //HERE GO YOUR PASSWORD TO ENTER IN YOUR DB
//     database : credentials.db_name   //HERE GO THE DATABASE THAT WE ARE GONNA USED
//   })
// };

//parte de node js que deja que esta funcion
//se pueda utilizar en otro codigo
module.exports = config;


// GRANT ALL ON Assesment.* TO raul@'192.168.42.226' IDENTIFIED BY 'Lana022107RN';
