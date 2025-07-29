const Game = require("../models/game-model");
const User = require("../models/user-model");

// Start a game session
exports.startGame = async (req, res) => {
  const { userId, difficulty } = req.body;

  try {
    const game = new Game({
      userId,
      difficulty,
      startTime: new Date(),
    });

    await game.save();
    res.status(201).json({ message: "Game started", gameId: game._id });
  } catch (err) {
    res.status(500).json({ error: "Could not start game", details: err });
  }
};

// End a game session and update user stats
exports.endGame = async (req, res) => {
  const { gameId, won } = req.body;

  try {
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: "Game not found" });

    game.endTime = new Date();
    game.won = won;
    await game.save();

    const durationSec = (game.endTime - game.startTime) / 1000;

    // Update user stats
    const user = await User.findById(game.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.gamesPlayed += 1;
    user.totalTimePlayed += durationSec;

    if (won) {
      // Optional high score: fastest win
      if (!user.highScore || durationSec < user.highScore) {
        user.highScore = durationSec;
      }
    }

    await user.save();

    res.json({ message: "Game ended and user updated", timeTaken: durationSec });
  } catch (err) {
    res.status(500).json({ error: "Could not end game", details: err });
  }
};
