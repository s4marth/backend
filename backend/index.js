const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const salt =10;

//const { check, validationResult } = require('express-validator');


const app = express();
app.use(cors({
    // origin: ["http://localhost:3000"],
    origin: ["https://registerpage321.netlify.app"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
    host: "db4free.net",
    user: "mytesting_db321",
    password: "mytesting_db@321",
    database: "mytesting_db",
})

db.connect((err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Connected to database");
    }
  });



app.post('/signup', (req, res)=>{
    const sql = "INSERT INTO login (`name`, `email`, `password`, `number`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), salt, (err,hash)=>{
        if(err) return res.json({Error: "Error for hashing"});

        const values=[
            req.body.name,
            req.body.email,
            hash,
            req.body.number,
        ]
        db.query(sql,[values], (err,result)=>{
            if(err){
                return  res.json(err);
            }
            return res.json({Status: "Success"});
        })
    })
})

app.post('/login', (req, res)=>{
    const sql = "SELECT * FROM login WHERE `email` = ?";
    db.query(sql,[req.body.email], (err,data)=>{
        if(err){
            return  res.json({Error: "Error in login server" });
        }
        if(data.length > 0)
        {
            
            bcrypt.compare(req.body.password, data[0].password, (err,response)=>{
                if(err) return  res.json({Error: "hash pass error" });
               
                if(response){
                    const name = data[0].name;
                    console.log(name);
                 
                    return  res.json({Status: "Success", name: data[0].name, email: req.body.email});
                }else{
                    return  res.json({Error: "password not match" });
                }
            })
        }else{
            return  res.json({Error: "no email" });
        }
    });
})



app.listen(8081, ()=>{
    console.log("listening");
})
