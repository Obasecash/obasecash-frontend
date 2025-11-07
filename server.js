// server.js
// ObaseCash API – production-ready minimal server

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// -------- CORS (Netlify + local dev) --------
const allowedOrigins = [
  "https://charming-gingersnap-181fb5.netlify.app", // your Netlify site
  "http://localhost:5500",                           // VSCode Live Server (optional)
  "http://127.0.0.1:5500",                           // VSCode Live Server (optional)
  "http://localhost:3000",                           // local SPA (optional)
  "http://localhost:5000"                            // local API tests
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow mobile apps / curl (no origin) and our whitelist
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS blocked: " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: false
  })
);

// Handle OPTIONS preflight quickly
app.options("*", cors());

// -------- Body parsers --------
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// -------- Trust proxy (Render) --------
app.set("trust proxy", 1);

// -------- Simple request log (helps debugging on Render) --------
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// -------- Health & root routes (keep Render awake) --------
app.get("/", (_req, res) => {
  res.status(200).send("ObaseCash API is running ✅");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, time: new Date().toISOString() });
});

// -------- Mount your existing routers --------
// Make sure these files exist in /routes
try {
  const usersRouter = require("./routes/users");           // /api/users
  const accountsRouter = require("./routes/accounts");     // /api/accounts
  const transactionsRouter = require("./routes/transactions"); // /api/transactions (if you have it)

  app.use("/api/users", usersRouter);
  app.use("/api/accounts", accountsRouter);
  if (transactionsRouter) app.use("/api/transactions", transactionsRouter);
} catch (err) {
  console.warn("Router load warning:", err.message);
  console.warn("Ensure ./routes/users.js, ./routes/accounts.js, ./routes/transactions.js exist.");
}

// -------- Static (for local testing only) --------
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// -------- 404 fallback for API --------
app.use("/api", (_req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// -------- Global error handler --------
app.use((err, _req, res, _next) => {
  console.error("API error:", err);
  res.status(500).json({ message: "Server error", detail: err.message || err });
});

// -------- Start server --------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ObaseCash server running on http://localhost:${PORT}`);
});
