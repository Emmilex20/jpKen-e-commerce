import React from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FeatureBanner = ({
  heading,
  text,
  buttonText,
  buttonLink,
  imageAlt,
  reverse = false, // Prop to control image/text order
  className = '', // Allow custom class for section
}) => {
  return (
    <Container fluid className={`feature-banner-section py-5 my-5 ${className}`}>
      <Row className={`align-items-center ${reverse ? 'flex-row-reverse' : ''}`}>
        <Col md={6} className="feature-banner-image-col">
          <Image src={"/Featured.jpg"} alt={imageAlt} fluid className="feature-banner-image" />
        </Col>
        <Col md={6} className="feature-banner-content-col text-center text-md-start px-md-5 mt-4 mt-md-0">
          <h2 className="feature-banner-heading mb-3">{heading}</h2>
          <p className="feature-banner-text lead mb-4">{text}</p>
          {buttonText && buttonLink && (
            <Link to={buttonLink}>
              <Button variant="primary" size="lg" className="feature-banner-btn">
                {buttonText}
              </Button>
            </Link>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default FeatureBanner;