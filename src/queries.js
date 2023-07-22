let users = `CREATE TABLE IF NOT EXISTS "users" (
    "id" integer,
    "fullName" varchar DEFAULT NULL,
    "userName" varchar NOT NULL,
    "email" varchar NOT NULL,
    "password" varchar, 
    "twofaid" integer NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (twofaid) REFERENCES twofa (id)
    );`;

let twofa = `CREATE TABLE IF NOT EXISTS "twofa" (
        "id" integer,
        "type" varchar DEFAULT NULL,
        "securityQuestion" varchar DEFAULT NULL,
        "securityAnswer" varchar DEFAULT NULL,
        "pattern" varchar DEFAULT NULL,
        "pin" varchar DEFAULT NULL, 
        PRIMARY KEY (id)
        );`;

let INSERT_TWOFA = `INSERT INTO twofa(type,securityQuestion,securityAnswer,pattern,pin) VALUES(?,?,?,?,?)`
let INSERT_USERS = `INSERT INTO users (fullName,userName,email,password,twofaid) VALUES(?,?,?,?,?)`

// EXPORTS
exports.users = users;
exports.twofa = twofa;
exports = {
    INSERT_TWOFA,
    INSERT_USERS
}