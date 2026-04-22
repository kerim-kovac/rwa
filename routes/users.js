var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.all('SELECT * FROM student', [], (err, rows) =>{
      if(err){
        res.end("GREŠKA U BAZI");
        return;
      }
      res.json(rows);
  });
});

module.exports = router;
