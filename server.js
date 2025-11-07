// -------- Dependencies --------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// -------- CORS Configuration (Netlify + Render Fix) --------
app.use(cors({
  origin: ["https://charming-gingersnap-181bf5.netlify.app"], // your live frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Handle preflight CORS requests
app.options("*", cors({
  origin: ["https://charming-gingersnap-181bf5.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// -------- Middleware --------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------- Simple Logs (for debugging on Render) --------
app.set("trust proxy", 1);
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// -------- Health & Root Routes --------
app.get("/", (_req, res) => {
  res.status(200).send("✅ ObaseCash API is running successfully on Render!");
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    time: new Date().toISOString(),
  });
});

// -------- MongoDB Connection --------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// -------- Import & Mount Routes --------
try {
  const usersRouter = require("./routes/users");
  const accountsRouter = require("./routes/accounts");
  const transactionsRouter = require("./routes/transactions");

  app.use("/api/users", usersRouter);
  app.use("/api/accounts", accountsRouter);
  app.use("/api/transactions", transactionsRouter);
} catch (err) {
  console.error("⚠️ Route import error:", err.message);
}

// -------- Start Server --------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
