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

let twofa = `CREATE TABLE IF NOT EXISTS "twofa" (
        "id" integer,
        "securityQuestion" int DEFAULT NULL,
        "securityCode" int DEFAULT NULL,
        "pattern" varchar DEFAULT NULL,
        "pin" varchar DEFAULT NULL, 
        PRIMARY KEY (id)
        );`;

//EXPORTS
exports.users=users;
exports.twofa=twofa;