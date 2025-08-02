// src/components/About.jsx
import { FaReact, FaBootstrap, FaTasks, FaMoon, FaBars, FaHeart } from "react-icons/fa";
import aboutImage from '../assets/aboutpage.png';
import "../components/About.css"

const About = () => {
  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-lg border-0 fade-in-top">
        <div
          className="card-header text-white"
          style={{ backgroundColor: "#fd7e14" }}
        >
          <h3 className="mb-0 fade-in-left" style={{ animationDelay: '0.5s' }}>
            <FaTasks className="me-2" /> About RiseTask
          </h3>
        </div>

        <div className="card-body">
          <img
            src={aboutImage}
            className="about-image fade-in-right"
            alt="Motivational team working on RiseTask"
            style={{ animationDelay: '0.7s' }}
          />

          <p className="fade-in-left" style={{ animationDelay: '0.9s' }}>
            Welcome to our <strong>RiseTask</strong> app! This powerful task management tool is built using the latest web technologies to provide a fast and efficient experience.
          </p>

          <h5 className="mt-4 mb-3 text-secondary fade-in-left" style={{ animationDelay: '1.1s' }}>
            <FaReact className="me-2" style={{ color: "#fd7e14" }} /> Technologies Used
          </h5>
          <ul className="list-unstyled">
            <li className="mb-2 fade-in-left" style={{ animationDelay: '1.3s' }}>
              <FaReact className="me-2" style={{ color: "#fd7e14" }} />
              <strong>React</strong> for building fast and interactive UIs.
            </li>
            <li className="mb-2 fade-in-left" style={{ animationDelay: '1.5s' }}>
              <FaBootstrap className="me-2" style={{ color: "#fd7e14" }} />
              <strong>Bootstrap 5</strong> for responsive design and a modern layout.
            </li>
          </ul>

          <h5 className="mt-4 mb-3 text-secondary fade-in-left" style={{ animationDelay: '1.7s' }}>
            <FaTasks className="me-2" style={{ color: "#fd7e14" }} /> Key Features
          </h5>
          <ul className="list-unstyled">
            <li className="mb-1 fade-in-left" style={{ animationDelay: '1.9s' }}>
              <FaTasks className="me-2" style={{ color: "#fd7e14" }} />
              Add, update, and delete tasks with ease.
            </li>
            <li className="mb-1 fade-in-left" style={{ animationDelay: '2.1s' }}>
              <FaMoon className="me-2" style={{ color: "#fd7e14" }} />
              Switch between Light and Dark modes for comfortable viewing.
            </li>
            <li className="mb-1 fade-in-left" style={{ animationDelay: '2.3s' }}>
              <FaBars className="me-2" style={{ color: "#fd7e14" }} />
              Simple and intuitive navigation using the top navbar.
            </li>
          </ul>

          <hr className="my-4" />
          <p className="mb-0 text-muted fade-in-left" style={{ animationDelay: '2.5s' }}>
            Developed with <FaHeart className="text-danger mx-1" /> using open-source tools.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;