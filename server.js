
// Stripe webhook requires raw body
app.use(
  "/webhook",
  express.raw({ type: "application/json" })
);
app.use(express.json());



// ===== ObaseCash Bank Server =====
require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser")
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt =require("bcryptjs");


const app = express();
const PORT = process.env.PORT || 5000;

// when creating a user
const hashed = await bcrypt.hash(password, 10);

// when logging in
const ok = await bcrypt.compare(password, user.password_hash);
if (!ok) return res.status(401).json({ message: "Invalid credentials" });



// ================== CONFIG ==================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

const dbPath = path.join(__dirname, "obasecash.db");


// ================== DATABASE SETUP ==================
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("❌ Database error:", err.message);
  else console.log("✅ Connected to SQLite database.");
});

// Create tables if not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT,
    email TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    account_number TEXT UNIQUE,
    balance REAL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_account TEXT,
    to_account TEXT,
    amount REAL,
    date TEXT
  )`);
});

// ================== ROUTES ==================

// Default route
app.get("/", (req, res) => {
  res.send(`
    <h1>🌍 ObaseCash International Online Bank API</h1>
    <p>✅ Running on SQLite database</p>
    <p>Available routes:</p>
    <ul>
      <li>POST /api/register</li>
      <li>POST /api/login</li>
      <li>POST /api/deposit</li>
      <li>POST /api/transfer</li>
      <li>GET /api/balance/:account_number</li>
    </ul>
  `);
});


// ==== GET USER BALANCE ====
app.get("/api/balance/:email", (req, res) => {
  const email = req.params.email;
  const db = require("./models/db"); // adjust path if needed

  db.get(`SELECT balance FROM users WHERE email = ?`, [email], (err, row) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (!row) return res.status(404).json({ balance: 0 });
    res.json({ balance: row.balance });
  });
});





// ===== REGISTER USER =====
app.post("/api/register", async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password)
    return res.status(400).json({ message: "All fields are required." });

  try {
    // Check if email already exists
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
      if (err) return res.status(500).json({ message: "Database error." });
      if (row) return res.status(400).json({ message: "Email already registered." });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate account number
      const accountNumber = "ACC-" + Math.floor(1000 + Math.random() * 9000);

      // Insert user
      db.run(
        "INSERT INTO users (fullname, email, password, account_number, balance) VALUES (?, ?, ?, ?, ?)",
        [fullname, email, hashedPassword, accountNumber, 0],
        (err) => {
          if (err) return res.status(500).json({ message: "Database insert failed." });
          res.json({
            message: "Registration successful!",
            accountNumber,
          });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});


// ===== LOGIN USER =====
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Please fill all fields." });

  try {
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
      if (err) return res.status(500).json({ message: "Database error." });
      if (!user) return res.status(404).json({ message: "User not found." });

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid password." });

      // Success
      res.json({
        message: "Login successful",
        user: {
          fullname: user.fullname,
          email: user.email,
          account_number: user.account_number,
          balance: user.balance,
        },
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});


// ================== TRANSFER ==================
app.post("/api/transfer", (req, res) => {
  const { from_account, to_account, amount } = req.body;

  if (!from_account || !to_account || !amount)
    return res.status(400).json({ message: "Missing transfer data." });

  if (from_account === to_account)
    return res.status(400).json({ message: "Cannot transfer to the same account." });

  db.serialize(() => {
    // 1️⃣ Check sender balance
    db.get(`SELECT balance FROM accounts WHERE account_number = ?`, [from_account], (err, sender) => {
      if (err) return res.status(500).json({ message: "Database error." });
      if (!sender) return res.status(404).json({ message: "Sender account not found." });
      if (sender.balance < amount)
        return res.status(400).json({ message: "Insufficient balance." });

      // 2️⃣ Deduct from sender
      db.run(
        `UPDATE accounts SET balance = balance - ? WHERE account_number = ?`,
        [amount, from_account],
        function (err2) {
          if (err2) return res.status(500).json({ message: "Error updating sender balance." });

          // 3️⃣ Credit recipient
          db.run(
            `UPDATE accounts SET balance = balance + ? WHERE account_number = ?`,
            [amount, to_account],
            function (err3) {
              if (err3) return res.status(500).json({ message: "Error updating recipient balance." });

              // 4️⃣ Record transaction
              db.run(
                `INSERT INTO transactions (from_account, to_account, amount, date)
                 VALUES (?, ?, ?, datetime('now'))`,
                [from_account, to_account, amount],
                function (err4) {
                  if (err4) return res.status(500).json({ message: "Error saving transaction." });

                  res.json({ message: "✅ Transfer completed successfully!" });
                }
              );
            }
          );
        }
      );
    });
  });
});


// Get balance
app.get("/api/balance/:account_number", (req, res) => {
  const { account_number } = req.params;
  db.get(`SELECT balance FROM accounts WHERE account_number = ?`, [account_number], (err, row) => {
    if (err) return res.status(500).json({ message: "Database error." });
    if (!row) return res.status(404).json({ message: "Account not found." });
    res.json({ account_number, balance: row.balance });
  });
});


// Get transaction history for one account
app.get("/api/transactions/:account_number", (req, res) => {
  const { account_number } = req.params;
  db.all(
    `SELECT * FROM transactions WHERE from_account = ? OR to_account = ? ORDER BY id DESC`,
    [account_number, account_number],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json(rows);
    }
  );
});



// ================== START SERVER ==================
app.listen(PORT, () => {
  console.log(`🚀 ObaseCash server running on http://localhost:${PORT}`);
});
