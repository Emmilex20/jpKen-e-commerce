// apps/client/src/pages/LoginPage.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'; // Added useSelector

import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useLoginMutation } from '../slices/authApiSlice'; // Assuming this is correct API slice
import { setCredentials } from '../slices/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // For redirect logic

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth); // To check if already logged in

  const redirect = new URLSearchParams(location.search).get('redirect') || '/'; // Get redirect from URL or default to /

  // If user is already logged in, redirect them
  React.useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);


  const submitHandler = async (data) => {
    try {
      // res.data will now contain user info AND the token
      const res = await login(data).unwrap();
      dispatch(setCredentials({ ...res })); // This dispatches user data and token to Redux and localStorage
      toast.success('Login successful!');
      navigate(redirect); // Use the redirect path
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.error('Login error:', err);
    }
  };

  return (
    <FormContainer>
      <Helmet>
        <title>ProShop - Login</title>
      </Helmet>
      <h1 className="form-heading">Sign In</h1>

      <Form onSubmit={handleSubmit(submitHandler)} className="auth-form">
        <Form.Group className="mb-4" controlId="email">
          <Form.Label className="form-label-custom">Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            className={`form-input-custom ${errors.email ? 'is-invalid' : ''}`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address"
              }
            })}
          ></Form.Control>
          {errors.email && <Form.Text className="text-danger error-message">{errors.email.message}</Form.Text>}
        </Form.Group>

        <Form.Group className="mb-4" controlId="password">
          <Form.Label className="form-label-custom">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            className={`form-input-custom ${errors.password ? 'is-invalid' : ''}`}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
          ></Form.Control>
          {errors.password && <Form.Text className="text-danger error-message">{errors.password.message}</Form.Text>}
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          className="form-submit-btn"
          disabled={isLoading}
        >
          Sign In
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3 form-links-row">
        <Col className="text-start register-link-wrapper">
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="form-link">
            Register
          </Link>
        </Col>
        <Col className="text-end">
          <Link to="/forgotpassword" className="form-link">Forgot Password?</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginPage;