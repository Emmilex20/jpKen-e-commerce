// src/components/CallToActionSection.jsx
import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShippingFast, FaShieldAlt } from 'react-icons/fa';

const CallToActionSection = () => {
  return (
    <div className="cta-section text-center py-5">
      <Container>
        <h2 className="section-heading cta-heading mb-3">Why Choose ProShop?</h2>
        <Row className="justify-content-center mb-4">
          <Col md={6} lg={4} className="feature-box mb-3">
            <FaShippingFast size={40} className="cta-icon mb-2" />
            <h4>Fast & Reliable Shipping</h4>
            <p>Get your products quickly and securely.</p>
          </Col>
          <Col md={6} lg={4} className="feature-box mb-3">
            <FaShieldAlt size={40} className="cta-icon mb-2" />
            <h4>Secure Payments</h4>
            <p>Your transactions are always safe with us.</p>
          </Col>
        </Row>
        <Link to="/contact">
          <Button variant="outline-light" size="lg" className="cta-button">
            Have Questions? Contact Us
          </Button>
        </Link>
      </Container>
    </div>
  );
};

export default CallToActionSection;