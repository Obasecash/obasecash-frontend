// -------- Dependencies --------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// -------- Middleware --------
app.use(express.json());
app.use(
  cors({
    origin: "*", // Allow all for now; can restrict to Netlify later
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// -------- MongoDB Connection --------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -------- Simple Logs & Proxy Setup (Render) --------
app.set("trust proxy", 1);
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// -------- Root & Health Routes --------
app.get("/", (_req, res) => {
  res.status(200).send("🌍 ObaseCash API is running successfully ✅");
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    time: new Date().toISOString(),
  });
});

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
