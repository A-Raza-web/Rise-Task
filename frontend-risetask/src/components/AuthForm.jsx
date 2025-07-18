// src/components/AuthForm.jsx
import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaSignInAlt, FaUserPlus } from "react-icons/fa";

const AuthForm = ({ mode = "login", onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const isLogin = mode === "login";

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div
          className="card-header text-white text-center"
          style={{ backgroundColor: "#fd7e14" }}
        >
          <h3>
            {isLogin ? (
              <>
                <FaSignInAlt className="me-2" /> Login
              </>
            ) : (
              <>
                <FaUserPlus className="me-2" /> Sign Up
              </>
            )}
          </h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-3">
                <label className="form-label">
                  <FaUser className="me-2 text-warning" />
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">
                <FaEnvelope className="me-2 text-warning" />
                Email
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                <FaLock className="me-2 text-warning" />
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn text-white" style={{ backgroundColor: "#fd7e14" }}>
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
