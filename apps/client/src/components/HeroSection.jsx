// src/components/HeroSection.jsx
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaIceCream, FaStar, FaCookieBite } from 'react-icons/fa'; // More relevant icons

const HeroSection = () => {
  return (
    <div className="hero-section text-center d-flex align-items-center justify-content-center">
      <Container>
        <h1 className="hero-title mb-3 animate__animated animate__fadeInDown">
          Indulge in Perfectly Layered Parfaits
        </h1>
        <p className="hero-subtitle mb-4 animate__animated animate__fadeInUp">
          Fresh ingredients, delightful layers, delivered to your door.
        </p>
        <Link to="/products"> {/* Or simply to / if your homepage is also the products list */}
          <Button variant="primary" size="lg" className="hero-shop-btn animate__animated animate__zoomIn">
            View Our Parfaits
          </Button>
        </Link>
        <div className="hero-features mt-4 animate__animated animate__fadeInUp animate__delay-1s">
          <div className="feature-item">
            <FaStar size={30} className="feature-icon" />
            <p>Premium Quality</p>
          </div>
          <div className="feature-item">
            <FaIceCream size={30} className="feature-icon" />
            <p>Freshly Made</p>
          </div>
          <div className="feature-item">
            <FaCookieBite size={30} className="feature-icon" />
            <p>Sweet Delights</p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HeroSection;