const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require('express-session');
const bcrypt = require('bcrypt');
const { register } = require("./src/controllers/register.controller");
const { db } = require("./src/controllers/db.controller");
const { login } = require("./src/controllers/login.controller");
const { users } = require("./src/queries");
const { twofa } = require("./src/queries");
const {map} = require("./src/utils/internalMap");

const {INSERT_TWOFA,
    INSERT_USERS} = require("./src/queries");
//create an Express App
const app = express();

//middleware to parse the data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// defining and serving static pages
app.use(express.static(path.join(__dirname, "public")));

//defining the port
const port = process.env.PORT || 3000;

/* ------------------ Session -------------------- */
//setting up session 35b8edcb895439ecaf5d228a7413241e
app.use(session({
    secret:'35b8edcb895439ecaf5d228a7413241e',
    resave:false,
    saveUninitialized:true
}))

/* ------------------ Creating tables -------------------- */
//creating the tables
db.serialize(() => {
  db.run(twofa, (err) => {
    console.log(err);
  });
  db.run(users, (err) => {
    console.log(err);
  });
});

/* ------------------ Handling Registration -------------------- */
//RouteRegister
app.post("/register",register);  

app.get('/twofaRegister',(req,res)=>{
    // console.log(__dirname+'public/twoFactorAuthentication.html');
    console.log(req.session.body);
    res.sendFile('public/twoFactorAuthentication.html',{root:__dirname});
})

//Handling 2fa registration

//2fa question
app.post('/2far/question',async (req,res)=>{
    let {securityQuestion,answer} = req.body;
    let {fullName,userName,email,password} = req.session.body;
    let type = 1;
    const hashedPass = await bcrypt.hash(password, 10);
    db.run(INSERT_TWOFA,[type,securityQuestion,answer,null,null,],err=>{
        if(err){
            console.log(err);
        }else{
            console.log("TWOFA INSERTION SUCCESS !");
        }
    });
    db.run(INSERT_USERS,[fullName,userName,email,hashedPass,null],err=>{
        if(err){
            console.log(err);
        }else{
            console.log("USER INSERTION SUCCESS !")
        }
    })
    res.redirect('/welcome');
})

//2fa pattern
app.post('/2far/pattern',async (req,res)=>{
    let type = 2;
    let {token} = req.body;
    // let {fullName,userName,email,password} = req.session.body;
    // const hashedPass = await bcrypt.hash(password, 10);
    // db.run(INSERT_TWOFA,[,,,pattern,],err=>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         console.log("TWOFA SUCCESS !");
    //     }
    // });
    // db.run(INSERT_USERS,[fullName,userName,email,hashedPass],err=>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         console.log("USER INSERTION SUCCESS !");
    //     }
    // })
    console.log(" we are here");
    console.log(token);
})
//2fa pin
app.post('/2far/pin',async (req,res)=>{
    let type=3;
    const {name} = req.body;
    let {fullName,userName,email,password} = req.session.body;
    const hashedPass = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO twofa(type,securityQuestion,securityCode,pattern,pin) VALUES(?,?,?,?,?)`,[,,,,pin],err=>{
        if(err){
            console.log(err);
        }else{
            console.log("TWOFA SUCCESS !");
        }
    });
    db.run(INSERT_USERS,[fullName,userName,email,hashedPass],err=>{
        if(err){
            console.log(err);
        }else{
            console.log("USER INSERTION SUCCESS !");
        }
    })
})
/* ------------------ Handling Login -------------------- */
//Handling login
app.post("/login", login);

//handling 2fa login
app.get('/2faLogin',(req,res)=>{
    let type = db.run()
    if(type === 1){
        
    }
    else if (type === 2){

    }
    else if(type === 3){

    }
    res.sendFile('public/loginTwoFactor.html',{root:__dirname});
})

//handling 2fa question
app.post("/2fal/question",(req,res)=>{

})
//handling 2fa pattern
app.post("/2fal/pattern",(req,res)=>{

})
//handling 2fa pin
app.post("/2fal/pin",(req,res)=>{

})

/* ------------------------------------------------------- */
//Listening on port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get('/welcome',(req,res)=>{
    res.send("Welcome");
})