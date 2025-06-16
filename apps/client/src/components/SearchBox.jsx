// apps/client/src/components/SearchBox.jsx
import React, { useState } from 'react'; // Import useState
import { Form, Button, InputGroup } from 'react-bootstrap'; // Import InputGroup
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SearchBox = () => {
  const [keyword, setKeyword] = useState(''); // State for the search input
  const navigate = useNavigate(); // Hook for navigation

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) { // Check if keyword is not just empty spaces
      navigate(`/search/${keyword}`); // Navigate to search results page
      setKeyword(''); // Clear the input field after search
    } else {
      navigate('/'); // If empty, navigate back to home or a default page
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex search-form-container"> {/* Added search-form-container for overall styling */}
      <InputGroup className="search-input-group"> {/* Wrapper for input and button */}
        <Form.Control
          type="text"
          name="q"
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword} // Connect input value to state
          placeholder="Search Products..."
          className="search-input-field" // Custom class for input styling
        ></Form.Control>
        <Button
          type="submit"
          variant="outline-primary" // Changed to outline-primary for better visual harmony with dark header
          className="search-button p-2" // Custom class for button styling
        >
          <FaSearch className="search-icon" /> {/* Custom class for icon styling */}
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBox;