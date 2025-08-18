
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
// import heroBg from "../../public/images/hero-bg.jpg"; 
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import aboutImg from "../../public/images/about.jpg";
import { FaBullseye, FaBolt, FaUsers } from "react-icons/fa";
// import { FaRegEdit, FaCalendarAlt, FaRobot } from "react-icons/fa";
import * as Icons from "react-icons/fa";
import { FaCheckCircle, FaStar, FaQuoteLeft, FaTimesCircle } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";
import "./Home.css"



const Home = () => {
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/home")
      .then((res) => setHomeData(res.data))
      .catch((err) => console.error(err));
  }, []);
 
  const navigate = useNavigate();
  if (!homeData) return <p>Loading...</p>;




  return (
    <div>
      {/* Hero Section */}
    <div>
      {/* Hero Section with Background Image */}
      <section
      className="text-center py-5"
      style={{
        backgroundImage: `url(${homeData.heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div
        className="container text-white"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          padding: "2rem",
          borderRadius: "12px",
        }}
      >
        {/* Heading */}
        <h1 className="display-4 mb-4">{homeData.heading}</h1>

        {/* Subtext */}
        <p className="lead mb-5">{homeData.subtext}</p>

        {/* Stats */}
        <div className="row mt-4">
          <div className="col-md-4">
            <h3>
              <FaBullseye className="me-2" style={{ color: '#ff5c00' }} />
              {homeData.stats.tasksCompleted}+
            </h3>
            <p>Tasks Completed</p>
          </div>
          <div className="col-md-4">
            <h3>
              <FaBolt className="me-2" style={{ color: '#ff5c00' }} />
              {homeData.stats.productivityBoost}%
            </h3>
            <p>Productivity Boost</p>
          </div>
          <div className="col-md-4">
            <h3>
              <FaUsers className="me-2" style={{ color: '#ff5c00' }} />
              {homeData.stats.happyUsers}+
            </h3>
            <p>Happy Users</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 d-flex justify-content-center gap-3">
          {homeData.buttons.map((btn, idx) => (
            <a
              key={idx}
              href={btn.link}
              className={`btn btn-lg ${
                btn.type === "filled" ? "btn-orange-filled" : "btn-orange-transition"
              }`}
            >
              {btn.text}
            </a>
          ))}
        </div>
      </div>
    </section>
  </div>



      {/* Features Section */}
         <section id="features" className="py-5">
      <div className="container">
        <h2 className="text-center mb-5">Why Choose RiseTask?</h2>
        <div className="row">
          {homeData.features.map((feature, index) => {
            const Icon = Icons[feature.icon]; // 👈 dynamic icon
            return (
              <div
                key={index}
                className="col-md-3 mb-4"
                onClick={() => navigate(feature.route)}
                style={{ cursor: "pointer" }}
              >
                <div className="card h-100 text-center border-0 card-hover">
                  <div className="card-body p-4">
                    <div className="mb-3" style={{ fontSize: "3rem", color: "#ff5c00" }}>
                      {Icon && <Icon />}
                    </div>
                    <h5 className="card-title" style={{ color: "#ff5c00" }}>
                      {feature.title}
                    </h5>
                    <p className="card-text text-muted">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>

      {/* About Section */}
      <section className="py-5 bg-light">
          <div className="container">
            <div className="row align-items-center">
              
              {/* Image Column */}
              <div className="col-md-6 mb-4 mb-md-0">
                <img
                  src={aboutImg }
                  alt="About RiseTask"
                  className="img-fluid rounded shadow-sm"
                />
              </div>

              {/* Text Column */}
              <div className="col-md-6">
                <h2 className="mb-4" style={{ color: "#ff5c00" }}>
                  About RiseTask
                </h2>
                <p className="text-muted mb-3" style={{ fontSize: "1.1rem" }}>
                  RiseTask is your intelligent task management assistant – built with
                  productivity, AI integration, and collaboration in mind.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-3 d-flex align-items-start">
                    <FaCheckCircle className="me-2" style={{ color: "#ff5c00", fontSize: "1.2rem", marginTop: "4px" }} />
                    <div>
                      <strong>Smart Scheduling:</strong> Organize tasks with priority & AI.
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <FaRobot className="me-2" style={{ color: "#ff5c00", fontSize: "1.2rem", marginTop: "4px" }} />
                    <div>
                      <strong>AI Insights:</strong> Get suggestions to improve your workflow.
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <FaUsers className="me-2" style={{ color: "#ff5c00", fontSize: "1.2rem", marginTop: "4px" }} />
                    <div>
                      <strong>Team Collaboration:</strong> Stay synced with real-time workspaces.
                    </div>
                  </li>
                </ul>

               <Link to="/about">
                <button className="btn btn-orange-filled mt-3">
                  Learn More
                </button>
              </Link>
              </div>

            </div>
          </div>
        </section>



      {/* Testimonials Section */}
      <section className="py-5">
          <div className="container">
            <h2 className="text-center mb-5" data-aos="fade-up">What Our Users Say</h2>
            <div className="row">

              {/* Testimonial 1 */}
              <div className="col-md-4 mb-4" data-aos="zoom-in" data-aos-delay="100">
                <div className="card h-100 border-0 card-hover">
                  <div className="card-body text-center p-4">
                    <div className="mb-4">
                      <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face&auto=format"
                        alt="Sarah Johnson"
                        className="rounded-circle"
                        style={{ width: '80px', height: '80px' }}
                      />
                    </div>
                    <div className="mb-2" style={{ color: '#fbbf24' }}>
                      {Array(5).fill().map((_, i) => <FaStar key={i} />)}
                    </div>
                    <p className="card-text mb-4">
                      <FaQuoteLeft className="me-2 text-muted" />
                      "RiseTask has revolutionized how I manage my daily tasks. The AI suggestions are incredibly helpful!"
                    </p>
                    <footer className="blockquote-footer">
                      <strong>Sarah Johnson</strong><br />
                      <small className="text-muted">Product Manager</small>
                    </footer>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="col-md-4 mb-4" data-aos="zoom-in" data-aos-delay="200">
                <div className="card h-100 border-0 card-hover">
                  <div className="card-body text-center p-4">
                    <div className="mb-4">
                      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format"
                        alt="Mike Chen"
                        className="rounded-circle"
                        style={{ width: '80px', height: '80px' }}
                      />
                    </div>
                    <div className="mb-2" style={{ color: '#fbbf24' }}>
                      {Array(5).fill().map((_, i) => <FaStar key={i} />)}
                    </div>
                    <p className="card-text mb-4">
                      <FaQuoteLeft className="me-2 text-muted" />
                      "Our team productivity increased by 40% after switching to RiseTask. Highly recommended!"
                    </p>
                    <footer className="blockquote-footer">
                      <strong>Mike Chen</strong><br />
                      <small className="text-muted">Team Lead</small>
                    </footer>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="col-md-4 mb-4" data-aos="zoom-in" data-aos-delay="300">
                <div className="card h-100 border-0 card-hover">
                  <div className="card-body text-center p-4">
                    <div className="mb-4">
                      <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&auto=format"
                        alt="Emily Davis"
                        className="rounded-circle"
                        style={{ width: '80px', height: '80px' }}
                      />
                    </div>
                    <div className="mb-2" style={{ color: '#fbbf24' }}>
                      {Array(5).fill().map((_, i) => <FaStar key={i} />)}
                    </div>
                    <p className="card-text mb-4">
                      <FaQuoteLeft className="me-2 text-muted" />
                      "Simple, elegant, and powerful. RiseTask keeps me organized without the complexity."
                    </p>
                    <footer className="blockquote-footer">
                      <strong>Emily Davis</strong><br />
                      <small className="text-muted">Freelancer</small>
                    </footer>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      {/* Pricing Section */}
    <section className="bg-light py-5">
      <div className="container">
        <h2 className="text-center mb-5" data-aos="fade-up" style={{ color: '#fd7e14' }}>
          Choose Your Plan
        </h2>
        <div className="row">

          {/* Free Plan */}
          <div className="col-md-4 mb-4" data-aos="flip-left" data-aos-delay="100">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center py-4 px-3">
                <h5 className="card-title mb-3">Free</h5>
                <h2 style={{ color: '#fd7e14' }}>$0<small className="text-muted">/month</small></h2>
                <ul className="list-unstyled mt-4 mb-4 text-start px-4">
                  <li><FaCheckCircle className="me-2 text-success" /> Up to 10 tasks</li>
                  <li><FaCheckCircle className="me-2 text-success" /> Basic features</li>
                  <li><FaCheckCircle className="me-2 text-success" /> Email support</li>
                  <li><FaTimesCircle className="me-2 text-danger" /> AI suggestions</li>
                </ul>
                <button className="btn pricing-button">Get Started</button>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="col-md-4 mb-4" data-aos="flip-up" data-aos-delay="200">
            <div className="card h-100 shadow border" style={{ borderColor: '#fd7e14' }}>
              <div className="position-absolute top-0 end-0 mt-2 me-2">
                <span className="badge" style={{ backgroundColor: '#fd7e14' }}>Popular</span>
              </div>
              <div className="card-body text-center py-4 px-3">
                <h5 className="card-title mb-3">Pro</h5>
                <h2 style={{ color: '#fd7e14' }}>$9<small className="text-muted">/month</small></h2>
                <ul className="list-unstyled mt-4 mb-4 text-start px-4">
                  <li><FaCheckCircle className="me-2 text-success" /> Unlimited tasks</li>
                  <li><FaCheckCircle className="me-2 text-success" /> AI-powered suggestions</li>
                  <li><FaCheckCircle className="me-2 text-success" /> Team collaboration</li>
                  <li><FaCheckCircle className="me-2 text-success" /> Priority support</li>
                </ul>
                <button className="btn pricing-button-solid">Start Free Trial</button>
              </div>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="col-md-4 mb-4" data-aos="flip-right" data-aos-delay="300">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center py-4 px-3">
                <h5 className="card-title mb-3">Enterprise</h5>
                <h2 style={{ color: '#fd7e14' }}>$29<small className="text-muted">/month</small></h2>
                <ul className="list-unstyled mt-4 mb-4 text-start px-4">
                  <li><FaCheckCircle className="me-2 text-success" /> Everything in Pro</li>
                  <li><FaCheckCircle className="me-2 text-success" /> Advanced analytics</li>
                  <li><FaCheckCircle className="me-2 text-success" /> Custom integrations</li>
                  <li><FaCheckCircle className="me-2 text-success" /> 24/7 support</li>
                </ul>
              <button className="btn pricing-button">Contact Sales</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

      {/* Footer */}
      <footer className="bg-dark text-white pt-4 pb-3 mt-5">
          <div className="container">
            <div className="row align-items-center text-center text-md-start">
              <div className="col-md-6 mb-3 mb-md-0">
                <h5 style={{ color: "#fd7e14" }}>RiseTask</h5>
                <p className="mb-0">© 2025 RiseTask. All rights reserved.</p>
              </div>
              <div className="col-md-6 text-md-end">
                <a href="#" className="text-white me-3 footer-icon">
                  <FaFacebook />
                </a>
                <a href="#" className="text-white me-3 footer-icon">
                  <FaTwitter />
                </a>
                <a href="#" className="text-white me-3 footer-icon">
                  <FaInstagram />
                </a>
                <a href="mailto:support@risetask.com" className="text-white footer-icon">
                  <FaEnvelope />
                </a>
              </div>
            </div>
          </div>
        </footer>
    </div>
  );
}


export default Home;