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
const { HttpStatusCode } = require("axios");

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
    secret: '35b8edcb895439ecaf5d228a7413241e',
    resave: false,
    saveUninitialized: true
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
app.post("/register", register);

app.get('/2fa-login', (req, res) => {
    console.log("login is successfull, validating the 2fa type")
    let twofaID = req.session.twofaID
    const { type, questionNo, answer } = req.body;

    db.get(
        "SELECT * FROM twofa WHERE id = ?",
        [twofaID],
        async (err, twofa) => {
            if (err) {
                return res.status(HttpStatusCode.InternalServerError).json({ error: "failed to fetch user data" });
            }
            if (!twofa) {
                return res.status(HttpStatusCode.InternalServerError).json({ error: "could not find the data" });
            }

            res.status(HttpStatusCode.Ok)
            if (twofa.type == "code") {
                if (answer != twofa.securityAnswer) {
                    res.status(HttpStatusCode.Unauthorized)
                    return;
                }
                res.redirect("/welcome")
            } else if (twofa.type == "pin") {
                if (answer != twofa.pin) {
                    res.status(HttpStatusCode.Unauthorized)
                    return;
                }
                res.redirect("/welcome")
            } else {
                if (answer != twofa.pattern) {
                    res.status(HttpStatusCode.Unauthorized)
                    return;
                }
                res.redirect("/welcome")
            }
        });
})

app.get('/twofaRegister', (req, res) => {
    // console.log(__dirname+'public/twoFactorAuthentication.html');
    console.log("registeration is not yet done, require 2fa, sending to UI for that data")
    console.log("logging user registration data")
    console.log(req.session.body);
    res.sendFile('public/twoFactorAuthentication.html', { root: __dirname });
})

//Handling 2fa registration

//2fa question
app.post('/2fa-register', async (req, res) => {
    console.log(req.body);
    let { type, securityQuestion, answer } = req.body;
    let { fullname, username, email, password } = req.session.body;
    const hashedPass = await bcrypt.hash(password, 10);

    // type,securityQuestion,securityAnswer,pattern,pin
    let twofaID={};
    if (type === "code") {
        await db.run(`INSERT INTO twofa(type,securityQuestion,securityAnswer,pattern,pin) VALUES(?,?,?,?,?)`,[type, securityQuestion, answer, null, null], err => {
            if (err) {
                console.log(err.stack);
                res.json({
                    "error": err,
                    "status": "failure"
                })
            } else {
                console.log("TWOFA INSERTION SUCCESS in code !");
            }
            twofaID = db.exec(`SELECT MAX(ID) FROM twofa`);
        });
    } else if (type == "pin") {
        await db.run(`INSERT INTO twofa(type,securityQuestion,securityAnswer,pattern,pin) VALUES(?,?,?,?,?)`, [type, null, null, null, answer,], err => {
            if (err) {
                console.log(err);
                res.json({
                    "error": err,
                    "status": "failure"
                })
            } else {
                console.log("TWOFA INSERTION SUCCESS pin !");
            }
        });
    } else {
        await db.run(`INSERT INTO twofa(type,securityQuestion,securityAnswer,pattern,pin) VALUES(?,?,?,?,?)`, [type, null, null, answer, null,], err => {
            if (err) {
                console.log(err);
                res.json({
                    "error": err,
                    "status": "failure"
                })
            } else {
                console.log("TWOFA INSERTION SUCCESS question !");
            }
        });
        
    }

    // await console.log("after insertion of 2faid is:", twofaID)
    await db.run(`INSERT INTO users (fullName,userName,email,password,twofaid) VALUES(?,?,?,?,?)`, [fullname, username, email, hashedPass, twofaID], err => {
        if (err) {
            console.log(err);
            res.json({
                "error": err,
                "status": "failure"
            })
        } else {
            console.log("USER INSERTION SUCCESS !")
        }
    })
    
    // await console.log("all good,",this.lastID)
    res.redirect('/welcome');
})

/* ------------------ Handling Login -------------------- */
//Handling login
app.post("/login", login);


/* ------------------------------------------------------- */
//Listening on port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

app.get('/welcome', (req, res) => {
    res.send("Welcome");
})