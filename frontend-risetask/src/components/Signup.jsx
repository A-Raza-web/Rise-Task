import React, { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import AOS from "aos";
import axios from "axios";
import "aos/dist/aos.css";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); // ✅ success/error check

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", formData);
      setMessage(res.data.message); // e.g. "User created successfully"
      setIsError(false); // ✅ success → false
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
      setIsError(true); // ❌ error → true
    }
  };

  return (
    <div className="signup-wrapper container mt-5 mb-5" data-aos="fade-up">
      {/* Icon on Top */}
      <div className="text-center mb-3">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle shadow"
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#e87211ff",
          }}
        >
          <FaUserPlus size={28} color="#fff" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-center signup-title mb-4">Create Your Account</h3>

      {/* Form Card */}
      <div className="card p-4 shadow-sm signup-card">
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label fw-bold">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-bold">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-bold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit */}
          <div className="d-grid mt-4">
            <button
              type="submit"
              className="btn signup-btn w-50 mx-auto d-block mt-4"
            >
              <FaUserPlus className="me-2" />
              Sign Up
            </button>

          </div>
        </form>

        {/* Response message */}
        {message && (
          <p
            className="text-center mt-3 fw-bold"
            style={{ color: isError ? "red" : "green" }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Signup;
