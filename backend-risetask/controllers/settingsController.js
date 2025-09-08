import Settings from "../models/settingsModel.js";

// ✅ GET user settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ user: req.user._id });

    if (!settings) {
      settings = await Settings.create({ user: req.user._id });
    }

    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching settings" });
  }
};

// ✅ UPDATE user settings
export const updateSettings = async (req, res) => {
  try {
    const { notifications, darkMode, autoSave, language, timezone } = req.body;

    let settings = await Settings.findOne({ user: req.user._id });

    if (!settings) {
      settings = new Settings({ user: req.user._id });
    }

    settings.notifications = notifications ?? settings.notifications;
    settings.darkMode = darkMode ?? settings.darkMode;
    settings.autoSave = autoSave ?? settings.autoSave;
    settings.language = language ?? settings.language;
    settings.timezone = timezone ?? settings.timezone;

    const updated = await settings.save();
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating settings" });
  }
};
