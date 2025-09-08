import { useState, useEffect } from "react";
import axios from "axios";
import { FaMoon, FaBell, FaSave, FaGlobe, FaCog, FaSun } from "react-icons/fa";

const API_URL = "http://localhost:5000/api/settings"; // Backend ka route

const Settings = ({ setDarkMode, token }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoSave: true,
    language: "en",
    timezone: "UTC",
  });

  const [loading, setLoading] = useState(true);

  // ✅ 1. Load settings from backend when component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSettings(res.data.settings); // jo backend se mila usay state me daal do
      } catch (err) {
        console.error("Error fetching settings:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [token]);

  // ✅ 2. Update state & backend
  const handleSettingChange = async (setting, value) => {
    const updatedSettings = { ...settings, [setting]: value };
    setSettings(updatedSettings);

    if (setting === "darkMode" && setDarkMode) {
      setDarkMode(value);
    }

    try {
      await axios.put(API_URL, updatedSettings, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Error updating settings:", err.response?.data || err.message);
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
    borderColor: enabled ? orange : "#ccc",
  });

  if (loading) return <p>Loading settings...</p>;

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
                  <p className="text-muted small mb-0">Enable system notifications</p>
                </div>
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
                    onChange={(e) =>
                      handleSettingChange("autoSave", e.target.checked)
                    }
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
                    onChange={(e) =>
                      handleSettingChange("language", e.target.value)
                    }
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
