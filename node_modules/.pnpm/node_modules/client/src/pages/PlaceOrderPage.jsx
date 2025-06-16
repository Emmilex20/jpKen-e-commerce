// apps/client/src/pages/PlaceOrderPage.jsx
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import formatCurrency from '../utils/formatCurrency';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  // eslint-disable-next-line no-unused-vars
  const { userInfo } = useSelector((state) => state.auth); // Retained for consistency, though not directly used in render

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.shippingAddress.address, cart.paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="place-order-page-wrapper">
      <Helmet><title>ProShop - Place Order</title></Helmet>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row className="gx-4">
        <Col md={8}>
          <h1 className="order-summary-heading">Order Summary</h1>
          <ListGroup variant='flush' className="order-details-list">
            <ListGroup.Item className="order-details-item card-like-item">
              <h2 className="section-title">Shipping</h2>
              <p className="section-content">
                {/* ⭐ ADDED: Full Name and Phone Number ⭐ */}
                <strong className="text-primary">Name: </strong>
                {cart.shippingAddress.fullName}
                <br />
                <strong className="text-primary">Phone: </strong>
                {cart.shippingAddress.phoneNumber}
                <br />
                <strong className="text-primary">Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item className="order-details-item card-like-item">
              <h2 className="section-title">Payment Method</h2>
              <p className="section-content">
                <strong className="text-primary">Method: </strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>

            <ListGroup.Item className="order-items-section card-like-item">
              <h2 className="section-title">Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message variant="info" className="empty-cart-message">Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index} className="order-item-card d-flex align-items-center">
                      <Row className="g-3 w-100">
                        <Col xs={3} sm={2} md={2} lg={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                            className="order-item-image"
                          />
                        </Col>
                        <Col xs={9} sm={5} md={5} lg={6} className="d-flex align-items-center">
                          <Link to={`/product/${item._id}`} className="order-item-name">
                            {item.name}
                          </Link>
                        </Col>
                        <Col xs={12} sm={5} md={5} lg={5} className="d-flex align-items-center justify-content-lg-end justify-content-sm-start mt-2 mt-sm-0">
                          <span className="order-item-price">
                            {item.qty} x {formatCurrency(item.price)} = {formatCurrency(item.qty * item.price)}
                          </span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4} className="order-summary-col">
          <Card className="order-summary-card">
            <ListGroup variant='flush'>
              <ListGroup.Item className="order-summary-heading-item">
                <h2 className="summary-card-title">Order Totals</h2>
              </ListGroup.Item>
              <ListGroup.Item className="summary-detail-item">
                <Row className="summary-row">
                  <Col>Items</Col>
                  <Col className="text-end">
                    {formatCurrency(cart.itemsPrice)}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="summary-detail-item">
                <Row className="summary-row">
                  <Col>Shipping</Col>
                  <Col className="text-end">
                    {formatCurrency(cart.shippingPrice)}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="summary-detail-item">
                <Row className="summary-row">
                  <Col>Tax</Col>
                  <Col className="text-end">
                    {formatCurrency(cart.taxPrice)}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="summary-total-item">
                <Row className="summary-row font-weight-bold">
                  <Col>Total</Col>
                  <Col className="text-end total-price-value">
                    {formatCurrency(cart.totalPrice)}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="summary-error-item">
                {error && (
                  <Message variant='danger' className="order-error-message">
                    {error.data?.message || error.error}
                  </Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item className="summary-button-item">
                <Button
                  type='button'
                  className='btn-block place-order-btn'
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderPage;