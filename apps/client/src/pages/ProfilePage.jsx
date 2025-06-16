// apps/client/src/pages/ProfilePage.jsx
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Import icons
import formatCurrency from '../utils/formatCurrency';

import Loader from '../components/Loader';
import Message from '../components/Message';
import { useProfileMutation } from '../slices/authApiSlice';
import { setCredentials } from '../slices/authSlice';
// CORRECTED: Import 'useGetMyOrdersQuery' as it's the standard RTK Query generated name
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';

const ProfilePage = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const password = watch('password'); // Watch password field for conditional validation

  // RTK Query hooks
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  // CORRECTED: Use 'useGetMyOrdersQuery()'
  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      setValue('name', userInfo.name);
      setValue('email', userInfo.email);
    }
  }, [userInfo, setValue]);

  const submitHandler = async (data) => {
    const { name, email, password, confirmPassword } = data;

    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const updateData = {
        _id: userInfo._id,
        name,
        email,
      };
      if (password) {
        updateData.password = password;
      }

      const res = await updateProfile(updateData).unwrap();

      dispatch(setCredentials({ ...res }));
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.error('Profile update error:', err);
    }
  };

  return (
    <div className="profile-page-wrapper">
      <Helmet><title>ProShop - User Profile</title></Helmet>

      <Row>
        <Col md={4} className="profile-form-column fade-in-up">
          <h1 className="profile-heading mb-4">User Profile</h1>
          <Form onSubmit={handleSubmit(submitHandler)} className="profile-form">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label className="profile-label">Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                {...register("name", { required: "Name is required" })}
                className="profile-input"
              ></Form.Control>
              {errors.name && <Form.Text className="text-danger profile-error-text">{errors.name.message}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label className="profile-label">Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address"
                  }
                })}
                className="profile-input"
              ></Form.Control>
              {errors.email && <Form.Text className="text-danger profile-error-text">{errors.email.message}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label className="profile-label">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password (leave blank to keep current)"
                {...register("password", {
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                className="profile-input"
              ></Form.Control>
              {errors.password && <Form.Text className="text-danger profile-error-text">{errors.password.message}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-4" controlId="confirmPassword">
              <Form.Label className="profile-label">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                {...register("confirmPassword", {
                  validate: value =>
                    !password || value === password || "Passwords do not match"
                })}
                className="profile-input"
              ></Form.Control>
              {errors.confirmPassword && <Form.Text className="text-danger profile-error-text">{errors.confirmPassword.message}</Form.Text>}
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className={`w-100 profile-update-button ${loadingUpdateProfile ? 'disabled-btn' : ''}`}
              disabled={loadingUpdateProfile}
            >
              {loadingUpdateProfile ? 'Updating Profile...' : 'Update Profile'}
            </Button>

            {loadingUpdateProfile && <Loader className="mt-3" />}
          </Form>
        </Col>

        <Col md={8} className="profile-orders-column fade-in-up">
          <h2 className="profile-heading mb-4">My Orders</h2>
          {loadingOrders ? (
            <Loader />
          ) : errorOrders ? (
            <Message variant="danger" className="profile-error-message">
              {errorOrders?.data?.message || errorOrders.error}
            </Message>
          ) : orders.length === 0 ? (
            <Message variant="info" className="profile-info-message">You have no orders yet.</Message>
          ) : (
            <div className="table-responsive-wrapper profile-table-wrapper">
              <Table striped hover responsive className="profile-orders-table admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="table-row-item">
                      <td>{order._id.substring(order._id.length - 6)}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{formatCurrency(order.totalPrice)}</td>
                      <td className="text-center">
                        {order.isPaid ? (
                          <FaCheck className="success-icon" />
                        ) : (
                          <FaTimes className="danger-icon" />
                        )}
                      </td>
                      <td className="text-center">
                        {order.isDelivered ? (
                          <FaCheck className="success-icon" />
                        ) : (
                          <FaTimes className="danger-icon" />
                        )}
                      </td>
                      <td className="table-actions">
                        <Link to={`/order/${order._id}`} className="action-btn details-btn">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;