import React, { useState } from "react";
import { FaMoon, FaBell, FaSave, FaGlobe, FaCog, FaSun } from "react-icons/fa";

const Settings = ({ setDarkMode }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoSave: true,
    language: "en",
    timezone: "UTC",
  });

  const handleSettingChange = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
    if (setting === "darkMode") {
      setDarkMode(value);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !settings.darkMode;
    handleSettingChange("darkMode", newDarkMode);
  };

  const iconStyle = (enabled, iconName) => {
    if (iconName === "moon") {
      return {
        color: enabled ? "gray" : "gray",
        opacity: 1,
        transition: "0.3s"
      };
    }
    if (iconName === "sun" && !settings.darkMode) {
      return { color: "#fd7e14", opacity: 1, transition: "0.3s" };
    }
    const baseColor = "#fd7e14";
    return {
      color: enabled ? baseColor : "gray",
      opacity: enabled ? 1 : 0.5,
      transition: "0.3s",
    };
  };

  const switchStyle = (enabled) => ({
    backgroundColor: enabled ? "#fd7e14" : "#fff",
    borderColor: enabled ? "#fd7e14" : "#ccc"
  });

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        <FaCog className="me-2" style={iconStyle(true)} /> Settings
      </h2>
      <div className="row">
        <div className="col-md-8"> 
          <div className="card">
            <div className="card-header">
              <h5>General Settings</h5>
            </div>
            <div className="card-body">
              {/* 🌙 Dark Mode */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">
                    {settings.darkMode ? (
                      <FaMoon className="me-2" style={iconStyle(settings.darkMode, "moon")} />
                    ) : (
                      <FaSun className="me-2" style={iconStyle(true, "sun")} />
                    )}
                    {settings.darkMode ? "Dark Mode" : "Light Mode"}
                  </label>
                  <p className="text-muted small">
                    {settings.darkMode
                      ? "Dark theme is enabled"
                      : "Light theme is enabled"}
                  </p>
                </div>
                <div className="col-md-6">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={toggleDarkMode}
                      style={switchStyle(settings.darkMode)}
                    />
                  </div>
                </div>
              </div>

              {/* 🔔 Notifications */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">
                    <FaBell className="me-2" style={iconStyle(settings.notifications)} /> Notifications
                  </label>
                  <p className="text-muted small">
                    Enable system notifications
                  </p>
                </div>
                <div className="col-md-6">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) =>
                        handleSettingChange("notifications", e.target.checked)
                      }
                      style={switchStyle(settings.notifications)}
                    />
                  </div>
                </div>
              </div>

              {/* 💾 Auto Save */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">
                    <FaSave className="me-2" style={iconStyle(settings.autoSave)} /> Auto Save
                  </label>
                  <p className="text-muted small">Automatically save changes</p>
                </div>
                <div className="col-md-6">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={settings.autoSave}
                      onChange={(e) =>
                        handleSettingChange("autoSave", e.target.checked)
                      }
                      style={switchStyle(settings.autoSave)}
                    />
                  </div>
                </div>
              </div>

              {/* 🌐 Language */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">
                    <FaGlobe className="me-2" style={iconStyle(true)} /> Language
                  </label>
                  <p className="text-muted small">Choose your language</p>
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={settings.language}
                    onChange={(e) =>
                      handleSettingChange("language", e.target.value)
                    }
                  >
                    <option value="en">English</option>
                    <option value="ur">Urdu</option>
                  </select>
                </div>
              </div>

              {/* ⏰ Timezone (Future idea) */}
              {/* You can add timezone select later if needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
