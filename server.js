const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

/* Connect DB */
// connectDB();

/* Middleware */
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is working without database!");
});


/* Routes */
app.use("/api/auth", authRoutes);

/* Start server */
app.listen(5000, () => console.log("Server running on port 5000"));
