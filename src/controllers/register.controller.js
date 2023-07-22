
const {db}=require('./db.controller');

const register = async (req, res) => {
  let { fullname, username, email, password } = req.body;
  // db.run(
  //   `INSERT INTO users (fullName,userName,email,password) VALUES(?,?,?,?)`,
  //   [fullname, username, email, hashedPass],
  //   (err) => {
  //     if (err) {
  //       return res.status(500).json({ error: "Failed to register user" });
  //     }
  //   //   res.status(201).json({ message: "User registered successfully" });
  //   req.session.username = username;
  //     res.redirect('/twofaRegister');
  //   }
  // );
    req.session.body=req.body;
    res.redirect('/twofaRegister');
};


exports.register = register;
