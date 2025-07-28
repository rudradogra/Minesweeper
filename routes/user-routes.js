const express = require("express");
const router = express.Router();
const { getUserStats } = require("../controllers/userController");

router.get("/:id", getUserStats);

module.exports = router;
