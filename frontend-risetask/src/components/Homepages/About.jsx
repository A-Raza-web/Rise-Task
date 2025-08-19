import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaUsers, FaRobot } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function About() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/about")
      .then((res) => res.json())
      .then((data) => setAbout(data))
      .catch((err) => console.error(err));
  }, []);

  if (!about) return <p>Loading...</p>;

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row align-items-center">
          {/* Image Column */}
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src={about.image}
              alt="About RiseTask"
              className="img-fluid rounded shadow-sm"
            />
          </div>

          {/* Text Column */}
          <div className="col-md-6">
            <h2 className="mb-4" style={{ color: "#ff5c00" }}>
              {about.heading}
            </h2>
            <p className="text-muted mb-3" style={{ fontSize: "1.1rem" }}>
              {about.description}
            </p>

            <ul className="list-unstyled">
              {about.points.map((point, idx) => (
                <li key={idx} className="mb-3 d-flex align-items-start">
                  {/* dynamic icon mapping */}
                  {point.icon === "FaCheckCircle" && (
                    <FaCheckCircle
                      className="me-2"
                      style={{
                        color: "#ff5c00",
                        fontSize: "1.2rem",
                        marginTop: "4px",
                      }}
                    />
                  )}
                  {point.icon === "FaUsers" && (
                    <FaUsers
                      className="me-2"
                      style={{
                        color: "#ff5c00",
                        fontSize: "1.2rem",
                        marginTop: "4px",
                      }}
                    />
                  )}
                  {point.icon === "FaRobot" && (
                    <FaRobot
                      className="me-2"
                      style={{
                        color: "#ff5c00",
                        fontSize: "1.2rem",
                        marginTop: "4px",
                      }}
                    />
                  )}
                  <div>
                    <strong>{point.title}:</strong> {point.description}
                  </div>
                </li>
              ))}
            </ul>

            <Link to={about.button.link}>
              <button className="btn btn-orange-filled mt-3">
                {about.button.text}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
