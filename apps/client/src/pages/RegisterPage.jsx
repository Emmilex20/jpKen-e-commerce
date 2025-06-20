// apps/client/src/pages/RegisterPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'; // Added useSelector

import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useRegisterMutation } from '../slices/authApiSlice'; // Assuming this is correct API slice
import { setCredentials } from '../slices/authSlice';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // For redirect logic

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const [registerUser, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth); // To check if already logged in

  const redirect = new URLSearchParams(location.search).get('redirect') || '/'; // Get redirect from URL or default to /

  // If user is already logged in, redirect them
  React.useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);


  const submitHandler = async (data) => {
    const { name, email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await registerUser({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res })); // This dispatches user data and token to Redux and localStorage
      toast.success('Registration successful!');
      navigate(redirect); // Use the redirect path
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.error('Registration error:', err);
    }
  };

  return (
    <FormContainer>
      <Helmet>
        <title>ProShop - Register</title>
      </Helmet>
      <h1 className="form-heading">Register</h1>

      <Form onSubmit={handleSubmit(submitHandler)} className="auth-form">
        <Form.Group className="mb-4" controlId="name">
          <Form.Label className="form-label-custom">Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            className={`form-input-custom ${errors.name ? 'is-invalid' : ''}`}
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters"
              }
            })}
          ></Form.Control>
          {errors.name && <Form.Text className="text-danger error-message">{errors.name.message}</Form.Text>}
        </Form.Group>

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

        <Form.Group className="mb-4" controlId="confirmPassword">
          <Form.Label className="form-label-custom">Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            className={`form-input-custom ${errors.confirmPassword ? 'is-invalid' : ''}`}
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: value =>
                value === password || "Passwords do not match"
            })}
          ></Form.Control>
          {errors.confirmPassword && <Form.Text className="text-danger error-message">{errors.confirmPassword.message}</Form.Text>}
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          className="form-submit-btn"
          disabled={isLoading}
        >
          Register
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3 form-links-row">
        <Col className="text-center">
          Have an account?{' '}
          <Link to="/login" className="form-link">
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterPage;