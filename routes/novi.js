var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nova ruta' });
});

router.get('/:broj', function(req, res, next) {
  let number = Number(req.params.broj);
  
  if(number==1337){
    res.render('index', { title: "ADMIN PANEL" });
  }
});

module.exports = router;
