const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { register } = require("./src/controllers/register.controller");
const { db } = require("./src/controllers/db.controller");
const { login } = require("./src/controllers/login.controller");
const { users } = require("./src/queries");
const { twofa } = require("./src/queries");
//create an Express App
const app = express();

//middleware to parse the data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// defining and serving static pages
app.use(express.static(path.join(__dirname, "public")));

//defining the port
const port = process.env.PORT || 3000;

//creating the tables
db.serialize(() => {
  db.run(twofa, (err) => {
    console.log(err);
  });
  db.run(users, (err) => {
    console.log(err);
  });
});

//Handling login
app.post("/login", login);

//RouteRegister
app.post("/register",register);  

app.get('/twofaRegister',(req,res)=>{
    // console.log(__dirname+'public/twoFactorAuthentication.html');
    res.sendFile('public/twoFactorAuthentication.html',{root:__dirname});
})

//Listening on port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

