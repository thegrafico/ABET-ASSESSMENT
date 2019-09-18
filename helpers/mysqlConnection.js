var mysql = require('mysql');
// const credentials = require('./raul_credentials');
<<<<<<< HEAD
=======

>>>>>>> ed5e428681685db88f3612a93d0df4e2fb963c21
// const database = require('./database');
var config;


//forma estandar de conectarse a mysql utilizando nodejs
//se cambia el database, user y password, dependiendo de las necesidades

//FOR REMOTE CONNECTION
config = {
    mysql_pool : mysql.createPool({

      //establece limite de personas conectadas a la base de datos
      connectionLimit : 15,

<<<<<<< HEAD
    //establece el route basico donde se ouede accessar
    host     : '192.168.42.226',          //THIS IS THE SAME FOR YOUR
    user     : 'root',               //THIS IS THE SAME FOR YOUR
    password : 'Lana02210712RN',         //HERE GO YOUR PASSWORD TO ENTER IN YOUR DB
    database : 'Assessment'   //HERE GO THE DATABASE THAT WE ARE GONNA USED
=======
      //establece el route basico donde se ouede accessar
      host     : '70.45.220.247',  //THIS IS THE SAME FOR YOUR
      user     : 'root',      //THIS IS THE SAME FOR YOUR
      password : 'abetserver',        //HERE GO YOUR PASSWORD TO ENTER IN YOUR DB
      database : 'ABET'   //HERE GO THE DATABASE THAT WE ARE GONNA USED
>>>>>>> ed5e428681685db88f3612a93d0df4e2fb963c21
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
