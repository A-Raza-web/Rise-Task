// src/components/Contact.jsx
import React, { useState, useEffect } from "react";
import { FaEnvelope, FaUser, FaPaperPlane } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    setShowSuccess(true); // Show popup
    setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds

    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        overflow: "hidden",
      }}
    >
      <div className="w-100" style={{ maxWidth: "600px" }} data-aos="fade-up">
        {/* Success Message */}
        {showSuccess && (
          <div className="alert alert-success text-center" role="alert">
             Message sent successfully!
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#fd7e14",
            }}
          >
            <FaEnvelope style={{ color: "#fff", fontSize: "1.8rem" }} />
          </div>
          <h3 className="fw-bold" style={{ color: "#fd7e14" }}>
            Contact Us
          </h3>
          <p className="text-muted">We'd love to hear from you!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
          {/* Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <FaUser className="me-2 text-warning" /> Your Name
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

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <FaEnvelope className="me-2 text-warning" /> Email Address
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

          {/* Message */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <FaPaperPlane className="me-2 text-warning" /> Your Message
            </label>
            <textarea
              name="message"
              className="form-control"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Submit */}
          <div className="d-flex justify-content-center mt-3">
            <button
              type="submit"
              className="btn text-white px-4 py-2"
              style={{ backgroundColor: "#fd7e14" }}
            >
              <FaPaperPlane className="me-2" /> Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
