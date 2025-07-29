const express = require("express");
const router = express.Router();
const { startGame, endGame } = require("../controllers/gameController");

router.post("/start", startGame);
router.post("/end", endGame);

module.exports = router;
