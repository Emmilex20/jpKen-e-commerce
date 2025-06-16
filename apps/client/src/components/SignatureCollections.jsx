import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Placeholder data for signature collections
const collections = [
  {
    id: 1,
    name: 'Fruity & Fresh Parfaits',
    image: '/sig1.jpeg', // Replace with your image
    description: 'Light, refreshing, and bursting with natural fruit flavors.',
    link: '/products/search/fruit', // Example link to search by category
  },
  {
    id: 2,
    name: 'Decadent Chocolate Delights',
    image: '/sig2.jfif', // Replace with your image
    description: 'Indulge in rich, creamy chocolate layers for the ultimate treat.',
    link: '/products/search/chocolate',
  },
  {
    id: 3,
    name: 'Nutty & Crunchy Creations',
    image: '/sig3.jpg', // Replace with your image
    description: 'Perfect blend of textures with nuts, granola, and creamy goodness.',
    link: '/products/search/nut',
  },
  {
    id: 4,
    name: 'Seasonal & Special Editions',
    image: '/sig4.jpg', // Replace with your image
    description: 'Limited-time flavors inspired by the freshest seasonal ingredients.',
    link: '/products/search/seasonal',
  },
];

const SignatureCollections = () => {
  return (
    <Container className="signature-collections-section my-5 py-4 text-center">
      <h2 className="section-heading mb-5">Discover Our Signature Collections</h2>
      <Row className="justify-content-center">
        {collections.map((collection) => (
          <Col key={collection.id} sm={12} md={6} lg={3} className="mb-4">
            <Card className="collection-card h-100">
              <Card.Img variant="top" src={collection.image} className="collection-card-image" />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="collection-card-title">
                  <strong>{collection.name}</strong>
                </Card.Title>
                <Card.Text className="collection-card-description">
                  {collection.description}
                </Card.Text>
                <Link to={collection.link} className="mt-auto"> {/* mt-auto pushes button to bottom */}
                  <Button variant="outline-primary" className="collection-card-btn">
                    Explore
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SignatureCollections;