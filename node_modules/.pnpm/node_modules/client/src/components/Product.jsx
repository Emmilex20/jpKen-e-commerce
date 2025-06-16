import React from 'react';
import { Card, Button } from 'react-bootstrap'; // Import Button
import { Link } from 'react-router-dom';
import Rating from './Rating'; // Assuming you have this
import { FaShoppingCart } from 'react-icons/fa'; // Import shopping cart icon
import { useDispatch } from 'react-redux'; // For Redux dispatch
import { addToCart } from '../slices/cartSlice'; // Your addToCart action
import { toast } from 'react-toastify'; // For notifications
import formatCurrency from '../utils/formatCurrency';

const Product = ({ product }) => {
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    // We're adding 1 quantity when clicking from the product card list
    // The ProductPage handles quantity selection before adding.
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Card className="product-card my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" className="product-card-image" />
      </Link>

      <Card.Body className="d-flex flex-column">
        <Link to={`/product/${product._id}`} className="product-title-link">
          <Card.Title as="div" className="product-card-title text-truncate">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div" className="my-2">
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        </Card.Text>

        <Card.Text as="h3" className="product-card-price mt-auto mb-3">
          {formatCurrency(product.price)}
        </Card.Text>

        {/* Add to Cart Button for product card */}
        <Button
          className="btn-block add-to-cart-from-card-btn"
          type="button"
          disabled={product.countInStock === 0}
          onClick={addToCartHandler}
        >
          {product.countInStock === 0 ? (
            'Out of Stock'
          ) : (
            <>
              <FaShoppingCart className="me-2" /> Add to Cart
            </>
          )}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Product;