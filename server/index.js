require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const { verifyToken } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

const authRoutes = require("./routes/auth");
const servicesRoutes = require("./routes/services");
const appointmentsRoutes = require("./routes/appointments");

app.use("/auth", authRoutes);
app.use("/services", servicesRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/admin/appointments", verifyToken, appointmentsRoutes);
app.use("/admin/services", verifyToken, servicesRoutes);

app.get("/", (req, res) => {
  res.json({ status: "API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
