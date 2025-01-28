const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "messages_bd",
});

db.connect((err) => {
  if (err) {
    console.error("unable to connest: ", err.stack);
  }
  console.log("connection to database was succesful");
});

app.get("/messageboard", (req, res) => {
  db.query(
    "SELECT * FROM messages ORDER BY created_at DESC",
    (err, results) => {
      if (err) {
        res.status(500).send("Unable for run query");
      }
      res.json(results);
    }
  );
});

app.post("/messageboard", (req, res) => {
  const { message } = req.body;
  db.query(
    "INSERT INTO messages (message) VALUES (?)",
    [message],
    (err, results) => {
      if (err) {
        console.error("error ", err);
      }
      res.status(201).send("Message added successfully!");
    }
  );
});

app.listen(port, () => {
  console.log(`Express runnin on port ${port}`);
});
