import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/testimonials")
      .then(res => setTestimonials(res.data))
      .catch(err => console.error("Error fetching testimonials:", err));
  }, []);

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-5" data-aos="fade-up">
          What Our Users Say
        </h2>
        <div className="row">
          {testimonials.map((t, index) => (
            <div
              className="col-md-4 mb-4"
              key={index}
              data-aos="zoom-in"
              data-aos-delay={(index + 1) * 100}
            >
              <div className="card h-100 border-0 card-hover">
                <div className="card-body text-center p-4">
                  <div className="mb-4">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="rounded-circle"
                      style={{ width: "80px", height: "80px" }}
                    />
                  </div>
                  <div className="mb-2" style={{ color: "#fbbf24" }}>
                    {Array(t.rating).fill().map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <p className="card-text mb-4">
                    <FaQuoteLeft className="me-2 text-muted" />
                    {t.message}
                  </p>
                  <footer className="blockquote-footer">
                    <strong>{t.name}</strong>
                    <br />
                    <small className="text-muted">{t.role}</small>
                  </footer>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
