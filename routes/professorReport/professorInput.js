var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('professorReport/professorInput', { title: 'ABET Assessment' });
});

// router.get('/professorInput/:id',function(req,res,next){
//   res.render('test',{output: req.params.id});
// });
//
// router.post('/professorInput/next', function(req,res,next){
//     var id = req.body.id;
//   res.redirect('/professorInput/' + id);
// });

//
// router.post('/', function(req,res,next){
//
//   res.redirect('/chooseOutcomes');
// });


 //router.use(express.urlencoded({extended: false }));
 //router.use(express.static(path.join(__dirname, 'public')));
 // 
 // router.post('/', function (req, res) {
 //     console.log(req.body);
 //     res.send(req.body);
 //     res.redirect('/chooseOutcomes');
 // });

module.exports = router;
