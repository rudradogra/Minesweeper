const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  highScore: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  totalTimePlayed: { type: Number, default: 0 }, // in seconds
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
