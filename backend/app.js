require("dotenv").config();

const express = require("express");
const connectDB = require("./config/mongoose-connection");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

connectDB(); 

const gameRoutes = require("./routes/game-routes");
const userRoutes = require("./routes/user-routes");

app.use("/api/games", gameRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});