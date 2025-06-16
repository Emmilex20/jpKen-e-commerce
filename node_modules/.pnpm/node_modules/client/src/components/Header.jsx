// apps/client/src/components/Header.jsx
import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import {
  FaShoppingCart,
  FaUser,
  FaUtensils, // ⭐ Changed from FaBox to FaUtensils ⭐
  FaUserShield,
  FaInfoCircle, // ⭐ NEW: Import FaInfoCircle for About Us icon ⭐
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import SearchBox from './SearchBox';

import { useLogoutMutation } from '../slices/authApiSlice';
import { logout } from '../slices/authSlice';
import { clearCartItems } from '../slices/cartSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  // State to control the Navbar's expanded/collapsed state
  const [expanded, setExpanded] = useState(false);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(clearCartItems());
      navigate('/login');
      toast.success('Logged out successfully!');
      setExpanded(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Function to close the navbar
  const handleNavLinkClick = () => setExpanded(false);

  return (
    <header>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        fixed="top"
        className="py-3 custom-header-bg"
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center header-brand"
            onClick={handleNavLinkClick}
          >
            <img
              src="/logo.png"
              alt="JP Ken Logo"
              height="30"
              className="d-inline-block align-top me-2"
            />
            <strong className="fs-4 logo-text">JP Ken</strong>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto my-2 my-lg-0 search-box-container">
              <SearchBox />
            </Nav>

            <Nav className="ms-auto main-nav-links">
              {/* ⭐ UPDATED: Shop All to Our Menu with FaUtensils ⭐ */}
              <Nav.Link
                as={Link}
                to="/products" // Assuming '/products' still lists your menu items
                className="d-flex align-items-center nav-item-link"
                onClick={handleNavLinkClick}
              >
                <FaUtensils className="me-1 nav-icon" /> Our Menu
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/cart"
                className="d-flex align-items-center nav-item-link"
                onClick={handleNavLinkClick}
              >
                <FaShoppingCart className="me-1 nav-icon" /> Cart
                {cartItemCount > 0 && (
                  <Badge pill bg="primary" className="ms-1 header-cart-badge">
                    {cartItemCount}
                  </Badge>
                )}
              </Nav.Link>

              {/* ⭐ NEW: About Us Link ⭐ */}
              <Nav.Link
                as={Link}
                to="/about-us"
                className="d-flex align-items-center nav-item-link"
                onClick={handleNavLinkClick}
              >
                <FaInfoCircle className="me-1 nav-icon" /> About Us
              </Nav.Link>

              {userInfo ? (
                <NavDropdown
                  title={
                    <span className="d-flex align-items-center">
                      <FaUser className="me-1 nav-icon" /> {userInfo.name}
                    </span>
                  }
                  id="username"
                  className="nav-item-link"
                  onSelect={handleNavLinkClick}
                >
                  <NavDropdown.Item as={Link} to="/profile" onClick={handleNavLinkClick}>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="d-flex align-items-center nav-item-link"
                  onClick={handleNavLinkClick}
                >
                  <FaUser className="me-1 nav-icon" /> Sign In
                </Nav.Link>
              )}

              {/* Admin Links */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title={
                    <span className="d-flex align-items-center">
                      <FaUserShield className="me-1 nav-icon" /> Admin
                    </span>
                  }
                  id="adminmenu"
                  className="nav-item-link"
                  onSelect={handleNavLinkClick}
                >
                  <NavDropdown.Item as={Link} to="/admin/userlist" onClick={handleNavLinkClick}>
                    Users
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/productlist" onClick={handleNavLinkClick}>
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/orderlist" onClick={handleNavLinkClick}>
                    Orders
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ paddingTop: '80px' }}>
        {/* Your main application content will render below the fixed header */}
      </div>
    </header>
  );
};

export default Header;