var express = require('express');
var router = express.Router();
const  db = require('../db');
const bcrypt = require('bcrypt');
const multer = require('multer');
const generator = require('generate-password');
const nodemailer = require('nodemailer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

function logovan(req,res,next) {
  if(req.session.ulogovan){
    next();
  }else{
    res.redirect('/login');
  }
}

router.get('/', logovan, function(req, res, next) {
    db.all(`SELECT chat.id,chat.likes, chat.poruka, chat.datum,chat.korisnik_id, student.ime 
            FROM chat 
            JOIN student ON chat.korisnik_id = student.id`, [], (err, poruke) => {

        db.get('SELECT * FROM student WHERE ime=?', [req.session.korisnik], (err, korisnik) => {
            res.render('dashboard', { korisnik: korisnik, poruke: poruke });
        });
    });
});
///dashboard/change-email
router.post('/', function(req,res,next) {
      if(req.body.akcija == "logout"){
      req.session.destroy();
      res.redirect('/login');
      }else if(req.body.akcija == "informacije"){
          res.redirect('/dashboard/informacije');
      }else if(req.body.akcija == "promjenasifre"){
        res.redirect('/dashboard/password-change');
      }else if(req.body.akcija == "promjenausera"){
        res.redirect('/dashboard/change-username')
      }else if(req.body.akcija == "promjenamaila"){
        res.redirect('/dashboard/email-change')
      }else if(req.body.akcija == "razgovor"){
        res.redirect('/dashboard/chat');
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
router.post('/informacije', logovan, upload.single('photo'), function(req,res,next) {
  db.run('UPDATE student set slika=? WHERE ime=? AND email=?',[req.file.filename, req.session.korisnik, req.session.email], (err, data)=>{
      if(err){
        res.end("greska sa bazom");
        return;
      }
      
      res.redirect('/dashboard');
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
//change-username
router.get('/change-username', logovan, function(req,res,next){
  res.render('dashboard-username-change');
})
router.post('/change-username', logovan, function(req,res,next){
  db.run('UPDATE student SET ime=? WHERE ime=? AND email=?', [req.body.noviuser, req.session.korisnik, req.session.email], (err,data)=>{
    if(err){
      res.end("GRESKA SA BAZOM");
      return;
    }
    req.session.destroy();
    res.redirect('/login');
  })
});

router.post('/chat', logovan, function(req,res,next){

      db.run('INSERT INTO chat (korisnik_id,poruka,likes) VALUES(?,?,0)',[req.session.idKorisnika, req.body.poruka], (err,data)=>{
        if(err){
          res.end("baza greska");
          return;
        }  
        res.redirect('/dashboard');      
      })
});

router.post('/obrisi-chat', logovan, function(req,res,next){

db.run('DELETE FROM chat WHERE id=?',[req.body.id], (err,data)=>{
    if(err){
      console.log("baaza");
      return;
    }
    res.redirect('/dashboard');
  });
})
router.post('/like', logovan, function(req,res,next){

db.run('UPDATE chat SET likes= likes+1 WHERE id=?',[req.body.id], (err,data)=>{
    if(err){
      console.log("baaza");
      return;
    }
    res.redirect('/dashboard');
  });
})
module.exports = router;
