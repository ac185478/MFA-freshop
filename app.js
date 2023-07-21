const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const {register} = require('./src/controllers/register.controller');
const {db} = require('./src/controllers/db.controller');
const { login } = require("./src/controllers/login.controller");

//create an Express App
const app = express();
//middleware to parse the data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// defining and serving static pages
app.use(express.static(path.join(__dirname, "public")));

//defining the port
const port = process.env.PORT || 3000;
let users = `CREATE TABLE IF NOT EXISTS "users" (
    "id" integer,
    "fullName" varchar DEFAULT NULL,
    "userName" varchar NOT NULL,
    "email" varchar NOT NULL,
    "password" varchar, 
    "twofaid" integer NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY (twofaid) REFERENCES twofa (id)
    );`;

let tableQuery = `CREATE TABLE IF NOT EXISTS "twofa" (
        "id" integer,
        "securityQuestion" int DEFAULT NULL,
        "securityCode" int DEFAULT NULL,
        "pattern" varchar DEFAULT NULL,
        "pin" varchar DEFAULT NULL, 
        PRIMARY KEY (id)
        );`;

//creating the tables
db.serialize(() => {
  db.run(tableQuery, (err) => {
    console.log(err);
  });
  db.run(users,err=>{
    console.log(err);
  })

});

app.post("/login",login);

app.post("/register",register);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


exports.db=db;