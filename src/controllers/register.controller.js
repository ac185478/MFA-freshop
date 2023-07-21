import pkg from 'bcrypt';
const {bcrypt} = pkg;
export const register = async (req, res) => {
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
    );}

