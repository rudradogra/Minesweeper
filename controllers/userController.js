const User = require("../models/User");

exports.getUserStats = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select("-__v");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user", details: err });
  }
};
