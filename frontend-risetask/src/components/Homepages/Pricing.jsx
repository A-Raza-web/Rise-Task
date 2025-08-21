import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function Pricing() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/pricing")
      .then(res => setPlans(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="bg-light py-5">
      <div className="container">
        <h2 className="text-center mb-5" data-aos="fade-up" style={{ color: "#fd7e14" }}>
          Choose Your Plan
        </h2>
        <div className="row">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="col-md-4 mb-4"
              data-aos={index === 0 ? "flip-left" : index === 1 ? "flip-up" : "flip-right"}
              data-aos-delay={100 * (index + 1)}
            >
              <div
                className={`card h-100 shadow-sm ${plan.popular ? "border" : "border-0"}`}
                style={plan.popular ? { borderColor: "#fd7e14" } : {}}
              >
                {plan.popular && (
                  <div className="position-absolute top-0 end-0 mt-2 me-2">
                    <span className="badge" style={{ backgroundColor: "#fd7e14" }}>Popular</span>
                  </div>
                )}
                <div className="card-body text-center py-4 px-3">
                  <h5 className="card-title mb-3">{plan.title}</h5>
                  <h2 style={{ color: "#fd7e14" }}>
                    ${plan.price}
                    <small className="text-muted">{plan.duration}</small>
                  </h2>
                  <ul className="list-unstyled mt-4 mb-4 text-start px-4">
                    {plan.features.map((feature, i) => (
                      <li key={i}>
                        <FaCheckCircle className="me-2 text-success" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={`btn ${plan.popular ? "pricing-button-solid" : "pricing-button"}`}>
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
