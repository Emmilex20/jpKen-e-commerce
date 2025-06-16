// apps/client/src/pages/AboutPage.jsx
import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import {
  FaLeaf, // For fresh/natural
  FaHeartbeat, // For healthy
  FaUtensils, // For delicious/flavors
  FaTruck, // For delivery
  FaSeedling // For quality ingredients / natural
} from 'react-icons/fa'; // Updated icons for food theme
import { Link } from 'react-router-dom';
import Meta from '../components/Meta';

const AboutPage = () => {
  return (
    <>
      <Meta title="About Us | JP Ken Parfait & Yogurt" description="Discover JP Ken - Lagos's premier destination for fresh, delicious, and healthy parfaits and yogurts, made with love and natural ingredients." />

      <Container className="py-5 about-page-container">
        {/* Hero Section */}
        <Row className="text-center mb-5">
          <Col>
            <h1 className="about-heading mb-3">About JP Ken Parfait & Yogurt</h1>
            <p className="lead about-subheading">
              Crafting Freshness, Spoonful by Spoonful.
            </p>
          </Col>
        </Row>

        {/* Our Story & Philosophy */}
        <Row className="mb-5 align-items-center">
          <Col md={6} className="mb-4 mb-md-0">
            {/* Replace with an image of fresh ingredients, a parfait, or a happy customer */}
            <Image src="/ingredients.jpg" alt="JP Ken Fresh Ingredients" fluid rounded />
          </Col>
          <Col md={6}>
            <h2 className="section-title mb-3">Our Journey to Freshness</h2>
            <p className="about-text">
              Born from a passion for wholesome living and a love for delicious, natural treats, JP Ken started as a simple idea: to bring the freshest and most delightful parfaits and yogurts to the heart of Lagos. We noticed a growing demand for convenient yet genuinely healthy snack options, and we set out to fill that gap with products that don't compromise on taste or quality.
            </p>
            <p className="about-text">
              Our journey began in a small kitchen, experimenting with countless combinations of creamy yogurt, vibrant fruits, and crunchy granola. Every parfait and yogurt cup we create is a testament to our commitment to natural goodness and culinary excellence. We believe that eating healthy should never be boring, and that every spoonful should be a moment of pure joy.
            </p>
            <p className="about-text">
              Today, JP Ken stands as a beacon of fresh, convenient, and healthy indulgence. From our carefully selected local fruits to our signature homemade granola, every ingredient is chosen with your well-being and satisfaction in mind.
            </p>
          </Col>
        </Row>

        {/* Our Commitment / Values */}
        <Row className="mb-5 align-items-center flex-md-row-reverse"> {/* Reversed order for visual variety */}
            <Col md={6} className="mb-4 mb-md-0">
                {/* Replace with an image of healthy eating, a production process, or a clean kitchen */}
                <Image src="/quality.avif" alt="JP Ken Commitment to Quality" fluid rounded />
            </Col>
            <Col md={6}>
                <h2 className="section-title mb-3">Our Core Values</h2>
                <p className="about-text">
                    At the heart of JP Ken are a set of unwavering values that guide everything we do:
                </p>
                <ul className="about-values-list mb-4">
                    <li><strong>Freshness First:</strong> We prioritize sourcing the freshest local fruits and dairy, preparing our products daily to ensure peak taste and nutritional value.</li>
                    <li><strong>Uncompromising Quality:</strong> From premium yogurt bases to artisanal toppings, we use only the highest quality ingredients in every cup.</li>
                    <li><strong>Health & Wellness:</strong> Our parfaits and yogurts are crafted to be genuinely good for you, packed with nutrients without artificial additives.</li>
                    <li><strong>Flavor Innovation:</strong> We constantly explore new and exciting flavor combinations, offering a diverse menu that caters to every palate.</li>
                    <li><strong>Customer Delight:</strong> Your satisfaction is our utmost priority. We strive to provide exceptional service, from seamless ordering to timely delivery.</li>
                </ul>
                <p className="about-text">
                    These values drive us to continuously improve and innovate, ensuring that every JP Ken product you enjoy meets the highest standards of taste, health, and purity.
                </p>
            </Col>
        </Row>


        {/* What Sets Us Apart / Our Features */}
        <Row className="mb-5 text-center">
          <Col>
            <h2 className="section-title mb-4">The JP Ken Difference</h2>
            <p className="lead about-subheading mb-4">
                What makes a JP Ken parfait or yogurt truly special?
            </p>
          </Col>
        </Row>
        <Row className="mb-5 gy-4">
          <Col md={6} lg={3}>
            <Card className="h-100 feature-card">
              <Card.Body>
                <div className="text-center mb-3">
                  <FaLeaf className="feature-icon" />
                </div>
                <Card.Title className="text-center feature-title">Farm-Fresh Ingredients</Card.Title>
                <Card.Text className="text-center feature-text">
                  We partner with local farms and trusted suppliers to bring you the freshest fruits and natural dairy, picked at their peak ripeness.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="h-100 feature-card">
              <Card.Body>
                <div className="text-center mb-3">
                  <FaUtensils className="feature-icon" />
                </div>
                <Card.Title className="text-center feature-title">Exquisite Flavor Combinations</Card.Title>
                <Card.Text className="text-center feature-text">
                  From classic berry and granola to exotic tropical blends, our menu offers a delightful symphony of tastes for every preference.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="h-100 feature-card">
              <Card.Body>
                <div className="text-center mb-3">
                  <FaHeartbeat className="feature-icon" />
                </div>
                <Card.Title className="text-center feature-title">Nutrition in Every Bite</Card.Title>
                <Card.Text className="text-center feature-text">
                  Packed with probiotics, vitamins, and fiber, our products are designed to nourish your body and boost your energy naturally.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="h-100 feature-card">
              <Card.Body>
                <div className="text-center mb-3">
                  <FaTruck className="feature-icon" />
                </div>
                <Card.Title className="text-center feature-title">Convenient & Quick Delivery</Card.Title>
                <Card.Text className="text-center feature-text">
                  Order online and get your favorite healthy treats delivered promptly to your home or office across Lekki, Lagos.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Call to Action */}
        <Row className="text-center bg-light p-4 rounded-3 shadow-sm">
          <Col>
            <h3 className="section-title mb-3">Taste the Difference Today!</h3>
            <p className="about-text mb-4">
              Explore our wide variety of parfaits and yogurts, each crafted to perfection for your healthy indulgence.
            </p>
            <Link to="/products" className="btn btn-primary btn-lg">
              View Our Menu
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AboutPage;