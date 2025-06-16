// apps/client/src/pages/AdminProductListPage.jsx

import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'; // Add useParams for admin pagination
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { Table, Button, Row, Col } from 'react-bootstrap';
import Paginate from '../components/Paginate'; // Import Paginate for admin
import formatCurrency from '../utils/formatCurrency';

import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from '../slices/productsApiSlice';

const AdminProductListPage = () => { // Renamed component
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { pageNumber } = useParams(); // Get pageNumber for admin pagination

  const currentPageNumber = pageNumber || 1;

  // For admin list, we generally get all products (or paginated, but no keyword search typically)
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber: currentPageNumber,
  });

  const products = data?.products || [];
  const pages = data?.pages;
  const page = data?.page;

  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  useEffect(() => {
    // Only check admin status if userInfo is available
    if (userInfo && !userInfo.isAdmin) {
      navigate('/login'); // Redirect non-admins trying to access this page
      toast.error('You are not authorized to view this page.');
    } else if (!userInfo) {
        // If no user info at all, also redirect (this might be handled by AdminRoute directly)
        // navigate('/login');
        // toast.error('Please login to view this page.');
    }
    // No dependency on isAdminPage because this component *is* the admin page
  }, [userInfo, navigate]);


  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
        console.error('Error deleting product:', err);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        const res = await createProduct().unwrap();
        toast.success('Product created successfully');
        navigate(`/admin/product/${res._id}/edit`);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
        console.error('Error creating product:', err);
      }
    }
  };

  return (
    <div className="admin-page-wrapper">
      <Helmet><title>ProShop Admin - Product List</title></Helmet>

      <Row className="align-items-center mb-4 product-list-header">
        <Col>
          <h1 className="admin-heading mb-0">Products</h1>
        </Col>
        <Col className="text-end">
          <Button
            onClick={createProductHandler}
            className={`create-product-btn ${loadingCreate ? 'disabled-btn' : ''}`}
            disabled={loadingCreate}
          >
            <FaPlus className="me-2" /> Create Product
          </Button>
        </Col>
      </Row>

      {loadingDelete && <Loader />}
      {loadingCreate && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger" className="admin-error-message">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <div className="table-responsive-wrapper fade-in-up">
            <Table striped hover responsive className="admin-table product-list-table"><thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">No products found.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="table-row-item">
                    <td>{product._id.substring(product._id.length - 6)}</td>
                    <td>{product.name}</td>
                    <td>{formatCurrency(product.price.toFixed(2))}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td className="table-actions">
                      <Link to={`/admin/product/${product._id}/edit`} className="action-btn edit-btn me-2">
                        <FaEdit />
                      </Link>
                      <Button
                        onClick={() => deleteHandler(product._id)}
                        className="action-btn delete-btn"
                        disabled={loadingDelete}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody></Table>
          </div>
          {pages > 1 && (
            <Paginate
              pages={pages}
              page={page}
              isAdmin={true} // Explicitly true for admin pagination
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdminProductListPage;