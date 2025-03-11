require("dotenv").config();
const express = require("express");
const sql = require("mssql"); // Using `mssql` instead of `mysql2`
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Azure SQL Database Configuration
const dbConfig = {
  user: "Emman", // Your Azure SQL admin username
  password: "zun2uUiVhTZX@R6", // Your Azure SQL password
  server: "mssgserver.database.windows.net", // Azure SQL Server
  database: "msg_bd", // Your database name
  options: {
    encrypt: true, // Required for Azure SQL
    trustServerCertificate: false,
  },
};

// Connect to Azure SQL Database
sql
  .connect(dbConfig)
  .then((pool) => {
    console.log("✅ Connected to Azure SQL Database");

    // Define API Routes
    app.get("/messageboard", async (req, res) => {
      try {
        const result = await pool
          .request()
          .query("SELECT * FROM messages ORDER BY created_at DESC");
        res.json(result.recordset);
      } catch (err) {
        res.status(500).send("Unable to run query: " + err);
      }
    });

    app.post("/messageboard", async (req, res) => {
      const { message } = req.body;
      try {
        await pool
          .request()
          .input("message_text", sql.NVarChar, message)
          .query("INSERT INTO messages (message_text) VALUES (@message_text)");
        res.status(201).send("Message added successfully!");
      } catch (err) {
        console.error("Error inserting message:", err);
        res.status(500).send("Failed to insert message");
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`🚀 Express running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to database:", err);
  });
