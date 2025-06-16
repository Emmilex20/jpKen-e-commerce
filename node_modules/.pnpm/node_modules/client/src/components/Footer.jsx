// apps/client/src/components/Footer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEnvelope, // New: For email icon
  FaPhoneAlt, // New: For phone icon
  FaMapMarkerAlt, // New: For address icon
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Dynamically get the current year

  return (
    <footer className="jpken-footer mt-5 py-5"> {/* Custom class and more padding */}
      <Container>
        <Row className="gx-4 gy-5"> {/* Added gutter classes for better spacing */}
          {/* Column 1: About & Socials */}
          <Col md={4} lg={3} className="text-center text-md-start">
            <h5 className="footer-heading mb-3">JP Ken</h5>
            <p className="footer-description mb-4">
              Your ultimate destination for cutting-edge electronics and gadgets. Quality, innovation, and customer satisfaction are our top priorities.
            </p>
            <div className="footer-social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </Col>

          {/* Column 2: Quick Links */}
          <Col md={4} lg={3} className="text-center text-md-start">
            <h5 className="footer-heading mb-3">Quick Links</h5>
            <ul className="list-unstyled footer-links-list">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/products" className="footer-link">Products</Link></li>
              <li><Link to="/profile" className="footer-link">Profile</Link></li>
              <li><Link to="/about-us" className="footer-link">About Us</Link></li>
              <li><Link to="/contact-us" className="footer-link">Contact Us</Link></li>
            </ul>
          </Col>

          {/* Column 3: Customer Service & Policies */}
          <Col md={4} lg={3} className="text-center text-md-start">
            <h5 className="footer-heading mb-3">Customer Service</h5>
            <ul className="list-unstyled footer-links-list">
              <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li> {/* New Link */}
              <li><Link to="/terms-conditions" className="footer-link">Terms & Conditions</Link></li> {/* New Link */}
              <li><Link to="/shipping-returns" className="footer-link">Shipping & Returns</Link></li> {/* New Link */}
              <li><Link to="/faqs" className="footer-link">FAQs</Link></li> {/* New Link */}
            </ul>
          </Col>

          {/* Column 4: Contact Info */}
          <Col md={12} lg={3} className="text-center text-lg-start">
            <h5 className="footer-heading mb-3">Get in Touch</h5>
            <ul className="list-unstyled footer-contact-list">
              <li className="d-flex align-items-start justify-content-center justify-content-lg-start mb-2">
                <FaMapMarkerAlt className="me-2 footer-contact-icon mt-1" />
                <span>
                  123 E-Commerce Way<br />
                  Digital City, Lekki<br />
                  Lagos, Nigeria
                </span>
              </li>
              <li className="d-flex align-items-center justify-content-center justify-content-lg-start mb-2">
                <FaEnvelope className="me-2 footer-contact-icon" />
                <a href="mailto:info@jpken.com" className="footer-link">info@jpken.com</a>
              </li>
              <li className="d-flex align-items-center justify-content-center justify-content-lg-start">
                <FaPhoneAlt className="me-2 footer-contact-icon" />
                <a href="tel:+2348012345678" className="footer-link">+234 (80) 1234-5678</a>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Copyright Section */}
        <Row className="border-top pt-4 mt-4"> {/* Adjusted padding and margin */}
          <Col className="text-center footer-copyright">
            Copyright &copy; JP Ken {currentYear}. All Rights Reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;