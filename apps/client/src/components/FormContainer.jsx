// apps/client/src/components/FormContainer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className='justify-content-md-center'>
        {/* Add the custom class here */}
        <Col xs={12} md={8} lg={6} xl={5} className="form-container-wrapper">
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;