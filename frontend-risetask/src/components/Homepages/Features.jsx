import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Icons from "react-icons/fa";
import axios from "axios";

export default function Features() {
  const [features, setFeatures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/home") // 👈 backend API
      .then((res) => setFeatures(res.data.features))
      .catch((err) => console.error("Error fetching features:", err));
  }, []);

  return (
    <section id="features" className="py-5">
      <div className="container">
        <h2 className="text-center mb-5">Why Choose RiseTask?</h2>
        <div className="row">
          {features.map((feature, index) => {
            const Icon = Icons[feature.icon];
            return (
              <div
                key={index}
                className="col-md-3 mb-4"
                onClick={() => navigate(feature.route)}
                style={{ cursor: "pointer" }}
              >
                <div className="card h-100 text-center border-0 card-hover">
                  <div className="card-body p-4">
                    <div
                      className="mb-3"
                      style={{ fontSize: "3rem", color: "#ff5c00" }}
                    >
                      {Icon && <Icon />}
                    </div>
                    <h5 className="card-title" style={{ color: "#ff5c00" }}>
                      {feature.title}
                    </h5>
                    <p className="card-text text-muted">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
