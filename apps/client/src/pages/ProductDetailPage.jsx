// apps/client/src/pages/ProductDetailPage.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import formatCurrency from '../utils/formatCurrency';

import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';

const ProductDetailPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductDetailsQuery(productId);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
    toast.success('Product added to cart!');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();

    if (!rating || !comment) {
      toast.error('Please select a rating and enter a comment.');
      return;
    }

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Review submitted successfully');
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link className="btn btn-primary my-3 go-back-btn" to="/"> {/* Added custom class and primary variant */}
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Helmet><title>ProShop - {product.name}</title></Helmet>
          {/* Main product details row with animation class */}
          <Row className="product-detail-main-row mb-5">
            <Col md={5} className="product-image-col"> {/* Column for image */}
              <Image src={product.image} alt={product.name} fluid className="product-detail-image" /> {/* Added custom class */}
            </Col>
            <Col md={4} className="product-info-col"> {/* Column for main product info */}
              <ListGroup variant="flush" className="product-info-listgroup"> {/* Added custom class */}
                <ListGroup.Item className="product-info-item product-name">
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item className="product-info-item product-rating-detail">
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item className="product-info-item product-price-detail">
                  Price: <strong>{formatCurrency(product.price)}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="product-info-item product-description">
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3} className="product-cart-col"> {/* Column for Add to Cart card */}
              <Card className="add-to-cart-card"> {/* Added custom class */}
                <ListGroup variant="flush">
                  <ListGroup.Item className="add-to-cart-item">
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong className="text-success">{formatCurrency(product.price)}</strong> {/* Green for price */}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="add-to-cart-item">
                    <Row>
                      <Col>Status:</Col>
                      <Col className={product.countInStock > 0 ? 'text-success' : 'text-danger'}>
                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item className="add-to-cart-item">
                      <Row className="align-items-center">
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                            className="qty-select" // Added custom class
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item className="add-to-cart-item text-center">
                    <Button
                      className="btn-block add-to-cart-btn" // Added custom class
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          {/* Product Reviews Section */}
          <Row className="product-reviews-section mt-5 mb-5"> {/* Added custom class and spacing */}
            <Col md={6} className="reviews-list-col">
              <h2 className="reviews-heading">Reviews</h2>
              {product.reviews.length === 0 && <Message variant="info">No Reviews Yet</Message>} {/* Changed Message variant */}
              <ListGroup variant="flush" className="product-reviews-list">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id} className="single-review-item">
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p className="review-date">{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="review-comment">{review.comment}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>

            <Col md={6} className="write-review-col">
              <h2 className="reviews-heading">Write a Customer Review</h2>
              {loadingProductReview && <Loader />}
              {userInfo ? (
                product.reviews.find(
                  (r) => r.user.toString() === userInfo._id.toString()
                ) ? (
                  <Message variant="info">You have already reviewed this product</Message>
                ) : (
                  <Form onSubmit={submitReviewHandler} className="review-form"> {/* Added custom class */}
                    <Form.Group controlId="rating" className="my-3">
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        as="select"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        required
                        className="review-rating-select" // Added custom class
                      >
                        <option value="">Select...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="comment" className="my-3">
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="5" // Increased rows for better usability
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        className="review-comment-textarea" // Added custom class
                      ></Form.Control>
                    </Form.Group>
                    <Button
                      disabled={loadingProductReview}
                      type="submit"
                      variant="primary"
                      className="review-submit-btn" // Added custom class
                    >
                      Submit Review
                    </Button>
                  </Form>
                )
              ) : (
                <Message variant="info">
                  Please <Link to="/login">log in</Link> to write a review
                </Message>
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductDetailPage;