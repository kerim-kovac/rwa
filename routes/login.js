var express = require('express');
var router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/', async function(req,res,next){
    const username = req.body.ime;
    const sifra = req.body.sifra;
    db.get("SELECT * FROM student WHERE ime=? AND blokiran=1;", [username], async (err,data)=>{
        if(err){
          res.end("greska sa bazom");
          return;
        }
        if(!data){
          res.end("<h1>KORISNIK NE POSTOJI ILI JE BLOKIRAN</h1>");
          return;
        }
        const match = await bcrypt.compare(sifra, data.password);
        if(match){
          req.session.ulogovan = true;
          req.session.korisnik = data.ime;
          req.session.email = data.email;
          res.redirect('/dashboard');

        }else{
          res.end("<h1>POGRESNA SIFRA</h1>");
        }
    })

})

module.exports = router;
