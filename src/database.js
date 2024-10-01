const sqlite3 = require("sqlite3").verbose();
let db;

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database("weatherapp.db", (err) => {
      if (err) {
        console.error("Error opening database:", err);
        reject(err);
      } else {
        console.log("Connected to the SQLite database.");
        db.serialize(() => {
          db.run(
            `CREATE TABLE IF NOT EXISTS weather_app_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            oauth_key TEXT NOT NULL,
            weather_key TEXT NOT NULL
          )`,
            (createErr) => {
              if (createErr) {
                console.error("Error creating table:", createErr);
                reject(createErr);
              } else {
                resolve();
              }
            },
          );
        });
      }
    });
  });
}

function queryDatabase(sqlQuery) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database is not initialized."));
      return;
    }

    db.all(sqlQuery, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = { initializeDatabase, queryDatabase };
