// src/components/About.jsx
import React from "react";
import { FaReact, FaBootstrap, FaTasks, FaMoon, FaBars, FaHeart } from "react-icons/fa";

const About = () => {
  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div
          className="card-header"
          style={{ backgroundColor: "#fd7e14", color: "white" }}
        >
          <h3 className="mb-0">
            <FaTasks className="me-2" /> About This App
          </h3>
        </div>
        <div className="card-body">
          <p>
            Welcome to our <strong>Task Manager App</strong>! This application is built using:
          </p>
          <ul className="list-unstyled">
            <li className="mb-2">
              <FaReact className="me-2 text-primary" />
              <strong>React</strong> for building fast and interactive UIs.
            </li>
            <li className="mb-2">
              <FaBootstrap className="me-2 text-purple" />
              <strong>Bootstrap 5</strong> for responsive design and layout.
            </li>
          </ul>

          <p>
            <strong>Key Features:</strong>
          </p>
          <ul className="list-unstyled">
            <li className="mb-1">
              <FaTasks className="me-2 text-success" />
              Add, update, and delete tasks with ease.
            </li>
            <li className="mb-1">
              <FaMoon className="me-2 text-dark" />
              Switch between Light and Dark modes.
            </li>
            <li className="mb-1">
              <FaBars className="me-2 text-warning" />
              Simple navigation using the top navbar.
            </li>
          </ul>

          <hr />
          <p className="mb-0 text-muted">
            Developed by <strong>Your Name</strong> — with{" "}
            <FaHeart className="text-danger" /> using open-source tools.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
