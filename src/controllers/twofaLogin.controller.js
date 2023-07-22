const bcrypt = require('bcrypt');
const { db } = require('./db.controller');

const twoFaLogin = (req, res) => {
    let twofaid = req.session.twofaid;
    console.log("received 2fa-login request")
    let { type, securityQuestion, answer } = req.body;
    //Get the credentials
    db.get(
        "SELECT * FROM twofa WHERE id = ?",
        [twofaid],
        async (err, twofa) => {
            if (err) {
                return res.status(500).json({ error: "failed to fetch user data" });
            }
            if (!twofa) {
                return res.status(401).json({ error: "invalid credentials" });
            }
        }
    );
    req.session.twofaid = twofaid;
    res.redirect('/2faLogin');
};

exports.twoFaLogin = twoFaLogin;