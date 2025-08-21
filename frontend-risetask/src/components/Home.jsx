import React from "react";
import { FaCheckCircle,FaTimesCircle, FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Homepages/Home";
import Features from "./Homepages/Features";
import About from "./Homepages/About";
import Testimonial  from "./Homepages/Testimonial";
import Pricing from "./Homepages/Pricing"


function MainHome (){
  return (
    <>
      {/* Sections */}
      <Home />
      <Features />
      <About />
      <Testimonial/>
      <Pricing/>

      

      {/* Footer */}
      <footer className="bg-dark text-white pt-4 pb-3 mt-5">
        <div className="container">
          <div className="row align-items-center text-center text-md-start">
            <div className="col-md-6 mb-3 mb-md-0">
              <h5 style={{ color: "#fd7e14" }}>RiseTask</h5>
              <p className="mb-0">© 2025 RiseTask. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <a href="#" className="text-white me-3 footer-icon"><FaFacebook /></a>
              <a href="#" className="text-white me-3 footer-icon"><FaTwitter /></a>
              <a href="#" className="text-white me-3 footer-icon"><FaInstagram /></a>
              <a href="mailto:support@risetask.com" className="text-white footer-icon"><FaEnvelope /></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default MainHome;
