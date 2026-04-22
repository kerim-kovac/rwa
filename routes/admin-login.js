var express = require('express');
var router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
  res.render('admin-login', { title: 'Express' });
});

router.post('/', function(req,res,next){
  db.get('SELECT * FROM admini WHERE username=? AND password=?',[req.body.ime, req.body.sifra], (err,data)=>{
        if(err){
          res.end("greska sa bazom");
        }
        if(data){
          req.session.admin = true;
          req.session.ime = req.body.ime;
          res.redirect('/admin-dashboard');
        }else{
          res.redirect('/admin-login');
        }
  });
})

module.exports = router;
