// apps/client/src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating'; // Assuming you have a Rating component

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover object-center transform hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 truncate mb-1">
            {product.name}
          </h3>
        </Link>
        <div className="mb-2">
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        </div>
        <p className="text-xl font-bold text-gray-900">₦{product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;