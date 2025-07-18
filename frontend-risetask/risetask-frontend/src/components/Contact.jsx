// src/components/Contact.jsx
import React, { useState } from "react";
import { FaEnvelope, FaUser, FaPaperPlane } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Message sent (not really, this is a demo!)");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header" style={{ backgroundColor: "#fd7e14", color: "white" }}>
          <h3 className="mb-0">
            <FaEnvelope className="me-2" /> Contact Us
          </h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
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

            <div className="mb-3">
              <label className="form-label">
                <FaEnvelope className="me-2 text-warning" /> Email address
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

            <button type="submit" className="btn text-white" style={{ backgroundColor: "#fd7e14" }}>
              <FaPaperPlane className="me-2" /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
