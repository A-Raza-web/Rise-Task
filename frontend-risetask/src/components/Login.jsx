import React, { useEffect, useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 👈 Redirect ke liye
import "./Login.css";

const API_URL = "http://localhost:5000/api/auth/login";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error
  const navigate = useNavigate(); // 👈 React Router Hook

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(API_URL, { email, password });

      // Success
      setMessage(res.data.message || "Login successful!");
      setMessageType("success");

      // Save JWT Token
      localStorage.setItem("token", res.data.token);

      // Redirect after short delay
      setTimeout(() => {
        navigate("/dashboard"); // 👈 Redirect to dashboard
      }, 1500);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Server error. Please try again."
      );
      setMessageType("error");
    }
  };

  return (
    <div className="login-wrapper container mt-5" data-aos="fade-up">
      {/* Top Icon */}
      <div className="text-center mb-3">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle shadow"
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#fd7e14",
          }}
        >
          <FaSignInAlt size={28} color="#fff" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-center login-title mb-4">Welcome Back</h3>

      {/* Login Form Card */}
      <div className="card p-4 shadow-sm login-card">
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-bold">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-bold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <div className="d-flex justify-content-center mt-4">
            <button type="submit" className="btn login-btn w-50">
              <FaSignInAlt className="me-2" />
              Sign In
            </button>
          </div>
        </form>

        {/* Message */}
        {message && (
          <p
            className={`mt-3 text-center fw-bold ${
              messageType === "success" ? "text-success" : "text-danger"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
