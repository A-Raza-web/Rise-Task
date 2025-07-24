import React, { useEffect } from "react";
import { FaSignInAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Login.css";

const Login = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

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
        <form>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-bold">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
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
              required
            />
          </div>

          {/* Submit */}
          <div className="d-grid mt-4">
            <button type="submit" className="btn login-btn">
              <FaSignInAlt className="me-2" />
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
