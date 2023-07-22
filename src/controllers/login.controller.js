const bcrypt = require('bcrypt');
const { db } = require('./db.controller');
const { HttpStatusCode } = require('axios');

const login = (req, res) => {
  console.log("received login request")
  const { userName, password } = req.body;
  //Get the credentials
  let twofaID
  db.get(
    "SELECT * FROM users WHERE userName = ?",
    [userName],
    async (err, usr) => {
      if (err) {
        return res.status(HttpStatusCode.InternalServerError).json({ error: "failed to fetch user data" });
      }
      if (!usr) {
        return res.status(HttpStatusCode.Unauthorized).json({ error: "invalid credentials" });
      }
      //validation of credentials
      twofaID = usr.twofaid
      const passMatch = await bcrypt.compare(password, usr.password);
      if (!passMatch) {
        return res.status(HttpStatusCode.Unauthorized);
      }
    }
  );

  console.log("login is successfull, sending 2fa type to the UI")
  req.session.twofaID=twofaID;
  db.get(
    "SELECT * FROM twofa WHERE id = ?",
    [twofaID],
    async (err, twofa) => {
      if (err) {
        return res.status(500).json({ error: "failed to fetch user data" });
      }
      if (!twofa) {
        return res.status(500).json({ error: "could not find the data" });
      }

      res.status(HttpStatusCode.Ok)
      if (twofa.type == "code") {
        res.json({
          type: "code",
          securityQuestion: twofa.securityQuestion
        })
      } else if (twofa.type == "pin") {
        res.json({
          type: "pin"
        })
      } else {
        res.json({
          type: "pattern"
        })
      }
    });
};

exports.login = login;