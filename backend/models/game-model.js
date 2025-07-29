const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  won: Boolean,
  difficulty: { type: String, enum: ["easy", "medium", "hard"] }
}, { timestamps: true });

module.exports = mongoose.model("Game", GameSchema);
