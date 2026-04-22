var express = require('express');
var router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'TEST' });
});

router.post('/', async function(req,res,next){
    const username = req.body.ime;
    const password = req.body.sifra;
    const email = req.body.mail;
    const hashed = await bcrypt.hash(password, 10);
    const role = 'User';
    
    db.get('SELECT * FROM student WHERE email=?',[email],async (err, data)=>{
          if(err){
            res.end("GREŠKA");
            return;
          }
          if(data){
            res.end("<h1>POSTOJI NEKO SA REGISTROVANIM MAILOM</h1>");
            return;
          }else{
            db.run('INSERT INTO student (ime, password, email, blokiran, role) VALUES(?,?,?,1,?);', [username, hashed, email,role], async (err, data)=>{
          if(err){
            console.log("GRESKA");
            return;
          }
          res.end("USPJESAN REGISTER");
         });
          }
          
    });
    
});

module.exports = router;
