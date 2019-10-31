var express = require('express');
var router = express.Router();
let base_url = '/courses/';
var query = require("../../helpers/queries/pInput_queries");

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('professorReport/professorInput', { title: 'ABET Assessment' });
});

//Creando un Id para seguir mandando los datos
//a la proxima ruta.

// router.get('/professorInput/:id',function(req,res,next){
//   res.render('test',{output: req.params.id});
// });
//
// router.post('/professorInput/next', function(req,res,next){
//     var id = req.body.id;
//   res.redirect('/professorInput/' + id);
// });


//Post de Prueba...

// router.post('/', function(req,res,next){
//   res.redirect('/chooseCourseTerm');
// });


//Post guardando lo que se escribe en la pagina en la base de datos.
 router.post('/', function (req, res,next) {

     // res.send(req.body);
     let data = [req.body.A, req.body.B, req.body.C, req.body.D, req.body.F,
        req.body.UW, req.body.rCourse, req.body.cReflection, req.body.cImprovement, null];

        console.log(data);

     query.insert_into_report(data, function(err, results){
   		//TODO: catch error properly
   		if (err) throw err;
   		res.redirect(base_url);
	   });
     res.redirect('/chooseCourseTerm');
 });

module.exports = router;
