// src/components/MyNavbar.jsx
import React from "react"; 
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaTasks,
  FaInfoCircle,
  FaChartBar,
  FaCogs,
  FaEnvelope,
  FaSignInAlt,
  FaUserPlus
} from "react-icons/fa";
import riseLogo from "../assets/rise-icon.jpg"; // ✅ Replace with your RT logo image
import './MyNavbar.css';

const MyNavbar = () => {
  return (
    <Navbar bg="light" variant="light" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <img
            src={riseLogo}
            alt="RT Logo"
            style={{ width: "32px", height: "32px", borderRadius: "50%" }}
          />
          <span>
            <span style={{ color: "#fd7e14", fontWeight: "bold" }}>Rise</span>
            <span style={{ color: "#000", fontWeight: "bold" }}>T</span>ask
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              <FaHome className="me-1" style={{ color: "#fd7e14" }} /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/tasks">
              <FaTasks className="me-1" style={{ color: "#fd7e14" }} /> Tasks
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              <FaInfoCircle className="me-1" style={{ color: "#fd7e14" }} /> About
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard">
              <FaChartBar className="me-1" style={{ color: "#fd7e14" }} /> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/settings">
              <FaCogs className="me-1" style={{ color: "#fd7e14" }} /> Settings
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              <FaEnvelope className="me-1" style={{ color: "#fd7e14" }} /> Contact
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/login">
              <FaSignInAlt className="me-1" style={{ color: "#fd7e14" }} /> Sign In
            </Nav.Link>
            <Nav.Link as={Link} to="/signup">
              <FaUserPlus className="me-1" style={{ color: "#fd7e14" }} /> Sign Up
            </Nav.Link>
          </Nav>


        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
