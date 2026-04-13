import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css"; // Create this file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand */}
        <div className="footer-section">
          <h2 className="footer-brand">SmartHR</h2>
          <p className="footer-description">
            Building smart HR solutions with React & modern web technologies.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <div className="footer-links">
            <Link className="footer-link" to='/'>Home</Link>
            <Link className="footer-link" to='/hr'>Dashboard</Link>
            <Link className="footer-link" to='/hr/jobs'>Job Postings</Link>
            <Link className="footer-link" to='/hr/applicants'>Applicants</Link>
          </div>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h3 className="footer-heading">Support</h3>
          <div className="footer-links">
            <Link className="footer-link" to='/help'>Help Center</Link>
            <Link className="footer-link" to='/privacy'>Privacy Policy</Link>
            <Link className="footer-link" to='/terms'>Terms & Conditions</Link>
          </div>
        </div>

        {/* Social */}
        <div className="footer-section">
          <h3 className="footer-heading">Follow Us</h3>
          <div className="social-icons">
            <span className="social-icon">🌐</span>
            <span className="social-icon">🐦</span>
            <span className="social-icon">📸</span>
            <span className="social-icon">💼</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} SmartHR. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;