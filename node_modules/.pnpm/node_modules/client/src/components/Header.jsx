// apps/client/src/components/Header.jsx
import React, { useState } from 'react'; // Import useState
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaBox } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import SearchBox from './SearchBox';

import { useLogoutMutation } from '../slices/authApiSlice';
import { logout } from '../slices/authSlice';

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
      navigate('/login');
      toast.success('Logged out successfully!');
      setExpanded(false); // Close the menu after logout
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
        expanded={expanded} // Control expanded state
        onToggle={() => setExpanded(!expanded)} // Toggle on click of Navbar.Toggle
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center header-brand" onClick={handleNavLinkClick}>
            <img
              src="/logo.png" // Path to your logo in the public folder
              alt="JP Ken Logo" // Always provide a descriptive alt text for accessibility
              height="30" // Adjust height as needed
              className="d-inline-block align-top me-2" // Bootstrap utility classes for alignment and margin
            />
            <strong className="fs-4 logo-text">JP Ken</strong>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto my-2 my-lg-0 search-box-container">
              <SearchBox />
            </Nav>

            <Nav className="ms-auto main-nav-links">
              {/* New "Shop" or "Products" Link */}
              <Nav.Link as={Link} to="/products" className="d-flex align-items-center nav-item-link" onClick={handleNavLinkClick}>
                <FaBox className="me-1 nav-icon" /> Shop All
              </Nav.Link>

              <Nav.Link as={Link} to="/cart" className="d-flex align-items-center nav-item-link" onClick={handleNavLinkClick}>
                <FaShoppingCart className="me-1 nav-icon" /> Cart
                {cartItemCount > 0 && (
                  <Badge pill bg="primary" className="ms-1 header-cart-badge">
                    {cartItemCount}
                  </Badge>
                )}
              </Nav.Link>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username' className="nav-item-link" onSelect={handleNavLinkClick}>
                  <NavDropdown.Item as={Link} to='/profile' onClick={handleNavLinkClick}>Profile</NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login" className="d-flex align-items-center nav-item-link" onClick={handleNavLinkClick}>
                  <FaUser className="me-1 nav-icon" /> Sign In
                </Nav.Link>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu" className="nav-item-link" onSelect={handleNavLinkClick}>
                  <NavDropdown.Item as={Link} to="/admin/userlist" onClick={handleNavLinkClick}>Users</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/productlist" onClick={handleNavLinkClick}>Products</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/orderlist" onClick={handleNavLinkClick}>Orders</NavDropdown.Item>
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