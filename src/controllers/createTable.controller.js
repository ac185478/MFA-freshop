export const createdb = () => {
  //     let query = `CREATE TABLE IF NOT EXISTS "twofa" (
  //         "id" integer,
  //         "securityQuestion" int DEFAULT NULL,
  //         "securityCode" int DEFAULT NULL,
  //         "pattern" varchar DEFAULT 'NULL',
  //         "pin" varchar DEFAULT 'NULL',
  //         PRIMARY KEY (id)
  //         );`
  //   db.run(query,(err)=>{
  //     console.log(err);
  //   });
  //   let users = `CREATE TABLE IF NOT EXISTS "users" (
  //     "id" integer,
  //     "fullName" varchar DEFAULT NULL,
  //     "userName" varchar NOT NULL,
  //     "email" varchar NOT NULL,
  //     "password" varchar,
  //     "twofaid" integer NOT NULL DEFAULT,
  //     PRIMARY KEY (id),
  //     FOREIGN KEY (twofaid) REFERENCES twofa(id)
  //     );`
  //     db.run(users,err=>{
  //         console.log(err);
  //     })
  let tableQuery = `CREATE TABLE IF NOT EXISTS "twofa" (
          "id" integer,
          "securityQuestion" int DEFAULT NULL,
          "securityCode" int DEFAULT NULL,
          "pattern" varchar DEFAULT 'NULL',
          "pin" varchar DEFAULT 'NULL', 
          PRIMARY KEY (id)
          );
          
          
          CREATE TABLE IF NOT EXISTS "users" (
              "id" integer,
              "fullName" varchar DEFAULT NULL,
              "userName" varchar NOT NULL,
              "email" varchar NOT NULL,
              "password" varchar, 
              "twofaid" integer NOT NULL DEFAULT,
              PRIMARY KEY (id),
              FOREIGN KEY (twofaid) REFERENCES twofa(id)
              );`;
  db.run(tableQuery, (err) => {
    console.log(err);
  });
};

// module.exports = { createdb };
