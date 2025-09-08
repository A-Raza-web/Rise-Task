import User from "../models/User.js";

// ✅ Get user settings
export const getSettings = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update user settings
export const updateSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { settings } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { settings },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
