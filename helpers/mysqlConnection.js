var mysql = require('mysql');
// <<<<<<< HEAD
try {
  const credentials = require('./raul_credentials');
} catch (error) {
  // print("Dont exits raul file");
}
// =======
// const credentials = require('./raul_credentials');

// >>>>>>> 02e32c1e4d1f0c9d3f7cfeff1a9278bb7ba39927
// const database = require('./database');
var config;


//forma estandar de conectarse a mysql utilizando nodejs
//se cambia el database, user y password, dependiendo de las necesidades

//FOR REMOTE CONNECTION
config = {
      mysql_pool : mysql.createPool({

      //establece limite de personas conectadas a la base de datos
      connectionLimit : 15,

// <<<<<<< HEAD
//     //establece el route basico donde se ouede accessar
//     host     : '192.168.1.200',          //THIS IS THE SAME FOR YOUR
//     user     : 'root',               //THIS IS THE SAME FOR YOUR
//     password : 'robolab',         //HERE GO YOUR PASSWORD TO ENTER IN YOUR DB
//     database : 'ABET'   //HERE GO THE DATABASE THAT WE ARE GONNA USED
// =======
      //establece basico el route donde se ouede accessar
      host     : '70.45.219.43',  //THIS IS THE SAME FOR YOUR
      user     : 'root',      //THIS IS THE SAME FOR YOUR
      password : 'abetserver',        //HERE GO YOUR PASSWORD TO ENTER IN YOUR DB
      database : 'ABET'   //HERE GO THE DATABASE THAT WE ARE GONNA USED
// >>>>>>> 02e32c1e4d1f0c9d3f7cfeff1a9278bb7ba39927
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
