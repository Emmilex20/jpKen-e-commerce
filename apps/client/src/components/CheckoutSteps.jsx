// apps/client/src/components/CheckoutSteps.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className='justify-content-center mb-4 checkout-steps-nav'>
      <Nav.Item>
        {step1 ? (
          // Use Link directly inside Nav.Link
          // Add 'as="div"' to Nav.Link to prevent it from rendering its own <a> tag
          <Nav.Link as="div" className="checkout-step-link active-step">
            <Link to='/login' className="text-decoration-none"> {/* Apply text-decoration-none to Link */}
              Sign In
            </Link>
          </Nav.Link>
        ) : (
          <Nav.Link disabled className="checkout-step-link">Sign In</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <Nav.Link as="div" className="checkout-step-link active-step">
            <Link to='/shipping' className="text-decoration-none">
              Shipping
            </Link>
          </Nav.Link>
        ) : (
          <Nav.Link disabled className="checkout-step-link">Shipping</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <Nav.Link as="div" className="checkout-step-link active-step">
            <Link to='/payment' className="text-decoration-none">
              Payment
            </Link>
          </Nav.Link>
        ) : (
          <Nav.Link disabled className="checkout-step-link">Payment</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <Nav.Link as="div" className="checkout-step-link active-step">
            <Link to='/placeorder' className="text-decoration-none">
              Place Order
            </Link>
          </Nav.Link>
        ) : (
          <Nav.Link disabled className="checkout-step-link">Place Order</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;