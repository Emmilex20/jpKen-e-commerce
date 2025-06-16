// apps/client/src/components/Footer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Import social media icons
import { Link } from 'react-router-dom'; // For internal links

const Footer = () => {
  return (
    // Use Container fluid for full width background, add custom class for styling
    <footer className="custom-footer-bg mt-5"> {/* Added mt-5 for some spacing from content */}
      <Container>
        {/* Main Footer Content - Multi-column layout */}
        <Row className="py-4 footer-content-row">
          {/* About Section */}
          <Col md={4} className="text-center text-md-start mb-4 mb-md-0">
            <h5 className="footer-heading">JP Ken</h5>
            <p className="footer-text">
              Your ultimate destination for cutting-edge electronics and gadgets. Quality, innovation, and customer satisfaction are our top priorities.
            </p>
            <div className="footer-social-icons mt-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </Col>

          {/* Quick Links Section */}
          <Col md={4} className="text-center mb-4 mb-md-0">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              {/* Add more links as needed */}
            </ul>
          </Col>

          {/* Contact Info Section */}
          <Col md={4} className="text-center text-md-end">
            <h5 className="footer-heading">Contact Us</h5>
            <p className="footer-text">
              123 E-Commerce Way<br />
              Digital City, TX 75001<br />
              United States
            </p>
            <p className="footer-text">
              Email: <a href="mailto:info@proshop.com" className="footer-link-email">info@proshop.com</a><br />
              Phone: <a href="tel:+1234567890" className="footer-link-phone">+1 (234) 567-890</a>
            </p>
          </Col>
        </Row>

        {/* Copyright Section */}
        <Row className="border-top pt-3 mt-3"> {/* Add a top border for separation */}
          <Col className="text-center py-2 footer-copyright">
            Copyright &copy; ProShop {new Date().getFullYear()}
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;