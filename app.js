const express = require("express");
const mongoose = require("./db");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const gameRoutes = require("./routes/gameRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/games", gameRoutes);
app.use("/api/users", userRoutes);

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
