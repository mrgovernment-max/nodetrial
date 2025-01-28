const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL Connection (XAMPP's default settings)
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Default MySQL user in XAMPP
  password: "", // Leave empty if no password set in XAMPP
  database: "messages_bd",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to database.");
});

// Routes
app.get("/messages", (req, res) => {
  db.query(
    "SELECT * FROM messages ORDER BY created_at DESC",
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    }
  );
});

app.post("/messages", (req, res) => {
  const { message } = req.body;
  db.query(
    "INSERT INTO messages (message) VALUES (?)",
    [message],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send("Message added successfully!");
      }
    }
  );
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
