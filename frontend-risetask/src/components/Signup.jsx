import React, { useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Signup.css";

const Signup = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="signup-wrapper container mt-5" data-aos="fade-up">
      {/* Icon on Top */}
      <div className="text-center mb-3">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle shadow"
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#fd7e14",
          }}
        >
          <FaUserPlus size={28} color="#fff" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-center signup-title mb-4">Create Your Account</h3>

      {/* Form Card */}
      <div className="card p-4 shadow-sm signup-card">
        <form>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label fw-bold">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="John Doe"
              required
            />
          </div>

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
              placeholder="Create a strong password"
              required
            />
          </div>

          {/* Submit */}
          <div className="d-grid mt-4">
            <button type="submit" className="btn signup-btn">
              <FaUserPlus className="me-2" />
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
