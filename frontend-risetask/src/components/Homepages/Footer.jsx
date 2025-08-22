import React, { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";
import axios from "axios";

function Footer() {
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/footer")
      .then(res => setFooter(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!footer) 
    return <p className="text-center mt-5">Loading...</p>;

  return (
    <footer className="bg-dark text-white pt-4 pb-3 mt-5">
      <div className="container">
        <div className="row align-items-center text-center text-md-start">
          <div className="col-md-6 mb-3 mb-md-0">
            <h5 style={{ color: "#fd7e14" }}>{footer.company}</h5>
            <p className="mb-0">© {footer.year} {footer.company}. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <a href={footer.socialLinks.facebook} className="text-white me-3 footer-icon"><FaFacebook /></a>
            <a href={footer.socialLinks.twitter} className="text-white me-3 footer-icon"><FaTwitter /></a>
            <a href={footer.socialLinks.instagram} className="text-white me-3 footer-icon"><FaInstagram /></a>
            <a href={`mailto:${footer.email}`} className="text-white footer-icon"><FaEnvelope /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
