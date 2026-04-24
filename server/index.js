require("dotenv").config();

const startServer = async () => {
  // Connect to DB and create tables before accepting any traffic
  const { initialize } = require("./db");
  await initialize();

  const express = require("express");
  const cors = require("cors");
  const rateLimit = require("express-rate-limit");
  const { verifyToken } = require("./middleware/auth");
  const errorHandler = require("./middleware/errorHandler");

  const app = express();
  const PORT = process.env.PORT || 5000;

  app.disable("x-powered-by");

  const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:3000";
  app.use(cors({
    origin: allowedOrigin === "*" ? true : allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));

  app.use(express.json({ limit: "10kb" }));

  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later" },
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many login attempts, please try again later" },
  });

  app.use(generalLimiter);

  const authRoutes = require("./routes/auth");
  const publicRoutes = require("./routes/public");
  const appointmentsAdminRoutes = require("./routes/appointments");
  const servicesAdminRoutes = require("./routes/services");

  app.get("/", (req, res) => res.json({ status: "OK" }));
  app.use("/auth", authLimiter, authRoutes);
  app.use("/", publicRoutes);
  app.use("/admin/appointments", verifyToken, appointmentsAdminRoutes);
  app.use("/admin/services", verifyToken, servicesAdminRoutes);

  app.use((req, res) => res.status(404).json({ error: "Not found" }));
  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
