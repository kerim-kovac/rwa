var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
const db = require('../db');
const generator = require('generate-password');
const bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
  res.render('password-reset', { title: 'Express' });
});

router.post('/', async function(req,res,next){
    const username = req.body.ime;
    const email = req.body.mail;
    db.get('SELECT * FROM student WHERE ime=? AND email=?',[username,email], async (err, data)=>{
          if(err){
            res.end("<h1>GREŠKA NA BAZI PODATAKA!</h1>");
            return;
          }
          if(data){
          const password = generator.generate({
	            length: 10,
	            numbers: true
            });

          const hashed = await bcrypt.hash(password,10);

          const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
              user: 'i56526455@gmail.com',
              pass: 'samckahttxozyhoy'
              }
              });
              const mailOptions = {
              from: 'i56526455@gmail.com',
              to: email,
              subject: 'Reset lozinke',
              html: `<h1>Tvoja nova lozinka je: ${password}</h1>`
              };
              db.run('UPDATE student SET password=? WHERE email=? AND ime=?;', [hashed,email,username], (err, data)=>{
                  if(err){
                    res.end("<h1>GRESKA SA BAZOM</h1>");
                    return;
                  }    
              transporter.sendMail(mailOptions, (err, info) => {
              if(err){
              console.log(err);
              } else {
              res.end("<h1>MAIL POSLAN, PROVJERITE INBOX!</h1>")
              }
              });
              });

          }else{
            res.redirect('/password-reset');
          }
    })

});

module.exports = router;
