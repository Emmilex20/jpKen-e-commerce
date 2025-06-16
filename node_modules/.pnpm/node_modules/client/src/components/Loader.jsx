// apps/client/src/components/Loader.jsx
import React from 'react';
import { Spinner } from 'react-bootstrap'; // Assuming react-bootstrap is used

const Loader = () => {
  return (
    // Outer container for centering the spinner on the page/in its parent
    <div className="loader-container">
      <Spinner
        animation="border" // Standard Bootstrap border animation
        role="status"      // For accessibility
        className="custom-spinner" // Custom class for styling
      >
        {/* For screen readers, visually hidden is the modern Bootstrap class */}
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default Loader;