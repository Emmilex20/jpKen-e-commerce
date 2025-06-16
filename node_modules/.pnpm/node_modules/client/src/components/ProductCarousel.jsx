import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice'; // Import the new hook
import formatCurrency from '../utils/formatCurrency';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">
      {error?.data?.message || error.error || 'Failed to load top products'}
    </Message>
  ) : (
    <Carousel pause="hover" className="bg-primary mb-4 product-carousel-custom">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image
              src={product.image}
              alt={product.name}
              fluid
              className="d-block w-100 product-carousel-image"
            />
            <Carousel.Caption className="carousel-caption-custom">
              <h2 className="carousel-product-name">
                {product.name} ({formatCurrency(product.price)})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;