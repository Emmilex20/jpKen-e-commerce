// apps/client/src/pages/ProductEditPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { Helmet } from 'react-helmet-async';
import { Form, Button } from 'react-bootstrap'; // Import Form and Button from react-bootstrap

// Import RTK Query hooks
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../slices/productsApiSlice';
import { UPLOAD_URL } from '../constants'; // Ensure this is imported for the upload URL

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  // Local component state for form fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  // RTK Query hooks
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload, error: errorUpload }] =
    useUploadProductImageMutation();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      toast.error('You are not authorized to view this page.');
      return;
    }

    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product, userInfo, navigate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      setImage(res.image);
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.error('Upload Error:', err);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const updatedProduct = {
        productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      };

      await updateProduct(updatedProduct).unwrap();
      toast.success('Product updated successfully!');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.error('Update Error:', err);
    }
  };

  return (
    <div className="admin-page-wrapper"> {/* Reusable wrapper for admin pages */}
      <Helmet><title>ProShop Admin - Edit Product</title></Helmet> {/* More descriptive title */}
      <Link to="/admin/productlist" className="btn btn-light my-3 admin-back-btn"> {/* Use Bootstrap Button & custom class */}
        Go Back
      </Link>
      <FormContainer className="product-edit-form-container fade-in-up"> {/* Custom class for form container */}
        <h1 className="admin-heading mb-4">Edit Product</h1> {/* Reusing admin-heading */}

        {loadingUpdate && <Loader />}
        {loadingUpload && <Loader />}
        {errorUpload && <Message variant="danger" className="admin-error-message">{errorUpload.data?.message || errorUpload.error}</Message>}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger" className="admin-error-message">{error?.data?.message || error.error}</Message>
        ) : (
          <Form onSubmit={submitHandler} className="product-edit-form"> {/* Use react-bootstrap Form */}
            <Form.Group controlId="name" className="mb-3">
              <Form.Label className="form-label-custom">Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control-custom"
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price" className="mb-3">
              <Form.Label className="form-label-custom">Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="form-control-custom"
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image" className="mb-3">
              <Form.Label className="form-label-custom">Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="form-control-custom mb-2"
              ></Form.Control>
              <Form.Control
                type="file"
                id="image-file"
                onChange={uploadFileHandler}
                className="form-file-custom" // Custom class for file input
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="brand" className="mb-3">
              <Form.Label className="form-label-custom">Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="form-control-custom"
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock" className="mb-3">
              <Form.Label className="form-label-custom">Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter count in stock"
                value={countInStock}
                onChange={(e) => setCountInStock(Number(e.target.value))}
                className="form-control-custom"
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category" className="mb-3">
              <Form.Label className="form-label-custom">Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control-custom"
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="mb-4"> {/* Increased margin bottom */}
              <Form.Label className="form-label-custom">Description</Form.Label>
              <Form.Control
                as="textarea" // Use as="textarea" for multiline input
                rows="4"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control-custom textarea-custom" // Custom class for textarea sizing
              ></Form.Control>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className={`w-100 product-update-btn ${loadingUpdate ? 'disabled-btn' : ''}`}
              disabled={loadingUpdate}
            >
              {loadingUpdate ? 'Updating...' : 'Update Product'}
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
};

export default ProductEditPage;