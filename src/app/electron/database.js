const sqlite3 = require("sqlite3");
let db;

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database("weatherapp.db", (err) => {
      if (err) {
        console.error("Error opening database:", err);
        return reject(err);
      }
      console.log("Connected to the SQLite database.");

      // Create tables
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
              return reject(createErr);
            }
            resolve();
          },
        );
      });
    });
  });
}

function queryDatabase(sqlQuery) {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error("Database is not initialized."));
    }

    db.all(sqlQuery, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function closeDatabase() {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error("Error closing database:", err);
      } else {
        console.log("Database connection closed.");
      }
    });
  }
}

function setupDbIpcHandlers() {
  const { ipcMain } = require("electron");

  ipcMain.handle("db-query", async (event, sqlQuery) => {
    try {
      const result = await queryDatabase(sqlQuery);
      return result;
    } catch (error) {
      console.error("Error in db-query handler:", error);
      throw error;
    }
  });
}

module.exports = {
  setupDatabase: initializeDatabase,
  queryDatabase,
  closeDatabase,
  setupDbIpcHandlers,
};
