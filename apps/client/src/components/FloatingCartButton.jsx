import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa'; // Importing a shopping cart icon from Font Awesome

import './FloatingCartButton.css'; // We'll create this CSS file next

const FloatingCartButton = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  // Calculate total quantity of items in the cart
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleCartClick = () => {
    navigate('/cart'); // Navigate to your cart page
  };

  // Only render the button if there are items in the cart,
  // or if you want it always visible, remove the totalItems > 0 check.
  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="floating-cart-button" onClick={handleCartClick}>
      <FaShoppingCart size={24} /> {/* Cart icon */}
      {totalItems > 0 && <span className="cart-badge">{totalItems}</span>} {/* Item count badge */}
    </div>
  );
};

export default FloatingCartButton;