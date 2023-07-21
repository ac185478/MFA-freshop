const express = require("express");
const path = require("path");
const sqlite = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
//create an Express App
const app = express();

//middleware to parse the data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// defining and serving static pages
app.use(express.static(path.join(__dirname, "public")));

//defining the port
const port = process.env.PORT || 3000;

//Connect to sqliteDB
const db = new sqlite.Database("database.db", (err) => {
  if (err) {
    console.log("error connecting to db", err.message);
  } else {
    console.log("connection successful");
  }
});

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
//creating the table
db.serialize(() => {
  db.run(tableQuery, (err) => {
    console.log(err);
  });
  db.run(users,err=>{
    console.log(err);
  })
  db.close();
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  //Get the credentials
  db.get(
    "SELECT * FROM users WHERE userName = ?",
    [username],
    async (err, usr) => {
      if (err) {
        return res.status(500).json({ error: "failed to fetch user data" });
      }
      if (!usr) {
        return res.status(401).json({ error: "invalid credentials" });
      }
      //validation of credentials
      const passMatch = await bcrypt.compare(password, usr.password);
      if (!passMatch) {
        return res.status(401).json({ error: "invalid credentials" });
      }

      res.status(201).json({ message: "User loggedin successfully" });
    }
  );
});

app.post("/register", async (req, res) => {
  let { fullname, username, email, password } = req.body;
  const hashedPass = await bcrypt.hash(password, 10);
  db.run(
    `INSERT INTO users (fullName,userName,email,password) VALUES(?,?,?,?)`,
    [fullname, username, email, hashedPass],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to register user" });
      }
      res.status(201).json({ message: "User registered successfully" });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
