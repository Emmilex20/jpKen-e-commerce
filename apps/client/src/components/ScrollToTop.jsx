// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top of the page on route change
    window.scrollTo(0, 0);
  }, [pathname]); // Re-run effect whenever the pathname changes

  return null; // This component doesn't render any UI
};

export default ScrollToTop;