const sqlite3 = require("sqlite3");
const { ipcMain } = require("electron");
let db;

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database("weatherapp.db", (err) => {
      if (err) {
        console.error("Error opening database:", err);
        return reject(err);
      }
      console.log("Connected to the SQLite database.");
      // There must be a better way to handle this
      db.serialize(() => {
        db.run(
          `CREATE TABLE IF NOT EXISTS weather_app_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            oauth_key TEXT NOT NULL,
            weather_key TEXT NOT NULL
          )`,
          (createErr) => {
            if (createErr) {
              console.error(
                "Error creating weather_app_data table:",
                createErr,
              );
              return reject(createErr);
            }

            db.run(
              `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE
              )`,
              (createErr) => {
                if (createErr) {
                  console.error("Error creating users table:", createErr);
                  return reject(createErr);
                }
                resolve();
              },
            );
          },
        );
      });
    });
  });
};

const queryDatabase = (sqlQuery) => {
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
};

const closeDatabase = () => {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error("Error closing database:", err);
      } else {
        console.log("Database connection closed.");
      }
    });
  }
};

function setupDbIpcHandlers() {
  ipcMain.handle("db-query", async (event, sqlQuery) => {
    try {
      const result = await queryDatabase(sqlQuery);
      return result;
    } catch (error) {
      console.error("Error in db-query handler:", error);
      throw error;
    }
  });

  ipcMain.handle("db-update", (event, query, params) => {
    return new Promise((resolve, reject) => {
      db.run(query, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  });
}

module.exports = {
  setupDatabase: initializeDatabase,
  queryDatabase,
  closeDatabase,
  setupDbIpcHandlers,
};
