const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./baza_podataka.db', (err) =>{
    if(err){
        console.log("Neuspjesna konecija!");
    }
    console.log("Uspjesna konecija");
});

module.exports = db;