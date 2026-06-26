import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./news.db", (err) => {
  if (err) {
    console.error("Database Error:", err.message);
  } else {
    console.log("SQLite Connected");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      seoTitle TEXT,
      article TEXT,
      sourceLink TEXT,
      image TEXT,
      publishDate TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

export default db;
