// apps/client/src/pages/CartPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=/shipping');
    }
  };

  return (
    <Row className="cart-page-wrapper"> {/* Added wrapper class for overall styling */}
      <Col md={8}>
        <h1 className="cart-heading">Shopping Cart</h1> {/* Added custom heading class */}
        {cartItems.length === 0 ? (
          <Message variant="info" className="empty-cart-message"> {/* Added variant and class */}
            Your cart is empty. <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush" className="cart-items-list"> {/* Added custom class */}
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id} className="cart-item-card"> {/* Custom class for each item */}
                <Row className="align-items-center"> {/* Align items vertically */}
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded className="cart-item-image" /> {/* Custom class */}
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`} className="cart-item-name">{item.name}</Link> {/* Custom class */}
                  </Col>
                  <Col md={2} className="cart-item-price">${item.price}</Col> {/* Custom class */}
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                      className="qty-select" // Custom class for quantity select
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2} className="text-center"> {/* Centered for the button */}
                    <Button
                      type="button"
                      variant="danger" // Changed to danger for delete
                      className="remove-btn" // Custom class for remove button
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash /> Remove
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card className="cart-summary-card"> {/* Custom class for summary card */}
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2 className="subtotal-heading"> {/* Custom class for subtotal heading */}
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}{' '}
                items)
              </h2>
              <strong className="cart-total-price"> {/* Custom class for total price */}
                ₦{cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </strong>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block checkout-btn" // Custom class for checkout button
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartPage;