var express = require('express');
var router = express.Router();
var db = require("../../helpers/mysqlConnection").mysql_pool;


/* GET home page. */
router.get('/', function(req, res, next) {
  var parms = { title: 'ABET Assessment' };

  res.render('departments/createDepartment', parms);
});

router.post ('/', function (req, res){
  var parms = { title: 'ABET Assessment' };

  var depName = req.body.depName;
  var depDesc = req.body.depDesc;

  db.getConnection (function (err, connection){

    let addDep = `insert into DEPARTMENT (dep_name, dep_description)
    values( '${depName}', '${depDesc}');`

    connection.query (addDep,function (err,results,fields){
    res.render('departments/createDepartment', parms);
    });
    connection.release();
  });
});
module.exports = router;
