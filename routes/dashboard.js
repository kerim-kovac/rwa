var express = require('express');
var router = express.Router();
const  db = require('../db');
const bcrypt = require('bcrypt');

function logovan(req,res,next) {
  if(req.session.ulogovan){
    next();
  }else{
    res.redirect('/login');
  }
}

/* GET home page. */
router.get('/',logovan, function(req, res, next) {
  res.render('dashboard', { username: req.session.korisnik });
});

router.post('/', function(req,res,next) {
      if(req.body.akcija == "logout"){
      req.session.destroy();
      res.redirect('/login');
      }else if(req.body.akcija == "informacije"){
          res.redirect('/dashboard/informacije');
      }else if(req.body.akcija == "promjenasifre"){
        res.redirect('/dashboard/password-change');
      }
});

router.get('/informacije',logovan, function(req, res, next) {
    db.get('SELECT * FROM student WHERE ime=? AND email=?',[req.session.korisnik, req.session.email], (err, data)=>{
          if(err){
            console.log("greska na bazi");
            return;
          }
          res.render('dashboard-informacije', {korisnik: data});
    });
});
router.get('/password-change', logovan, function(req, res, next) {
    res.render('dashboard-password-change');
});
router.post('/password-change',logovan, async function(req, res, next) {
    db.get('SELECT * FROM student WHERE ime=? AND email=?',[req.session.korisnik, req.session.email], async (err, data)=>{
          if(err){
            console.log("greska na bazi");
            return;
          }
          const staraSifra = req.body.sifra;
          const novaSifra = req.body.novasifra;
          const match = await bcrypt.compare(staraSifra, data.password);

          if(match){
              const hashed = await bcrypt.hash(novaSifra, 10);
              db.run('UPDATE student SET password=? WHERE ime=? AND email=?', [hashed,req.session.korisnik, req.session.email], (err, data) =>{
                if(err){
                  console.log("greska na bazi");
                  return;
                }
                req.session.destroy();
                res.redirect('/login');
              });
          }else{
                res.redirect('/dashboard');
          }
    });    
  
});
module.exports = router;
