const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database("database.db", (err) => {
    if (err) {
      console.log("error connecting to db", err.message);
    } else {
      console.log("connection successful");
    }
  });

exports.db=db;