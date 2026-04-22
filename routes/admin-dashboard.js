var express = require('express');
var router = express.Router();
const db = require('../db');

function login(req,res,next){
  if(req.session.admin){
    next();
  }else{
    res.redirect('/admin-login');
  }
}

router.get('/',login, function(req, res, next) {
  res.render('admin-dashboard', { ime: req.session.ime });
});

router.post('/', function(req,res,next){
    if(req.body.akcija == "logout"){
      req.session.destroy();
      res.redirect('/admin-login');
    }else if(req.body.akcija == "useri"){
      res.redirect('/admin-dashboard/useri');
    }else if(req.body.akcija =='brisi'){
      db.get('DELETE FROM student WHERE id=?',[req.body.id], (err,data)=>{
          if(err){
            res.end("greska na bazi");
            return;
          }
            res.redirect('/admin-dashboard/useri');
          
      })
    }else if(req.body.akcija =="blokiraj"){
          
      db.run('UPDATE student SET blokiran=?, razlog_blokiranja=? WHERE id=?;',[req.body.aktivnost,req.body.razlog, req.body.id], (err,data)=>{
            if(err){
              res.end("GRESKA NA BAZI");
              return;
            }
            res.redirect('/admin-dashboard/blocked');
      });
          
    
    }
});
router.get('/useri', login, (req,res,next) => {
  db.all('SELECT * FROM student WHERE ime LIKE ? OR email LIKE ?', [req.query.pretrazi,req.query.pretrazi], (err, data) =>{
          if(err){
            res.end("greska na bazi");
            return;
          }
          
            res.render('admin-dashboard-users', {korisnici: data});
    });      
});
router.get('/blocked', login, (req,res,next) => {
    db.all('SELECT * FROM student;', [], (err, data) =>{
          if(err){
            res.end("greska na bazi");
            return;
          }
          if(data){
            res.render('admin-dashboard-blocked', {korisnici: data});
          }
    });      
});



module.exports = router;
