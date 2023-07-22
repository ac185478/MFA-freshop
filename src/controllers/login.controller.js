const bcrypt = require('bcrypt');
const {db}=require('./db.controller');

const login = (req, res) => {
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

    //   res.status(201).json({ message: "User login successfully" });
    }
  );
  res.redirect('/welcome');
};

exports.login = login;