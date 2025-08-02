import { useState } from "react";
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
    if (setting === "darkMode" && setDarkMode) {
      setDarkMode(value);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !settings.darkMode;
    handleSettingChange("darkMode", newDarkMode);
  };
  
  const orange = "#fd7e14";

  const iconStyle = (enabled) => ({
    color: enabled ? orange : "gray",
    opacity: enabled ? 1 : 0.6,
    transition: "0.3s",
  });

  const switchStyle = (enabled) => ({
    backgroundColor: enabled ? orange : "#e9ecef",
    borderColor: enabled ? orange : "#ccc"
  });

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        <FaCog className="me-2" style={iconStyle(true)} /> Settings
      </h2>
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-header text-white" style={{ backgroundColor: orange }}>
              <h5>General Settings</h5>
            </div>
            <div className="card-body p-4">
              {/* 🌙 Dark Mode */}
              <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                <div>
                  <label className="form-label mb-0">
                    {settings.darkMode ? (
                      <FaMoon className="me-2" style={iconStyle(true)} />
                    ) : (
                      <FaSun className="me-2" style={{ color: orange }} />
                    )}
                    <strong>{settings.darkMode ? "Dark Mode" : "Light Mode"}</strong>
                  </label>
                  <p className="text-muted small mb-0">
                    {settings.darkMode ? "Dark theme is enabled" : "Light theme is enabled"}
                  </p>
                </div>
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

              {/* 🔔 Notifications */}
              <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                <div>
                  <label className="form-label mb-0">
                    <FaBell className="me-2" style={iconStyle(settings.notifications)} />
                    <strong>Notifications</strong>
                  </label>
                  <p className="text-muted small mb-0">
                    Enable system notifications
                  </p>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange("notifications", e.target.checked)}
                    style={switchStyle(settings.notifications)}
                  />
                </div>
              </div>

              {/* 💾 Auto Save */}
              <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                <div>
                  <label className="form-label mb-0">
                    <FaSave className="me-2" style={iconStyle(settings.autoSave)} />
                    <strong>Auto Save</strong>
                  </label>
                  <p className="text-muted small mb-0">Automatically save your changes</p>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => handleSettingChange("autoSave", e.target.checked)}
                    style={switchStyle(settings.autoSave)}
                  />
                </div>
              </div>
              
              {/* 🌐 Language */}
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <label className="form-label mb-0">
                    <FaGlobe className="me-2" style={iconStyle(true)} />
                    <strong>Language</strong>
                  </label>
                  <p className="text-muted small mb-0">Select your preferred language</p>
                </div>
                <div>
                  <select
                    className="form-select"
                    value={settings.language}
                    onChange={(e) => handleSettingChange("language", e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="ur">Urdu</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;