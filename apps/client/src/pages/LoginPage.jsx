// apps/client/src/pages/LoginPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useLoginMutation } from '../slices/authApiSlice';
import { setCredentials } from '../slices/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [login, { isLoading }] = useLoginMutation();

  const submitHandler = async (data) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Login successful!');
      navigate('/');
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
      {/* Added custom class for the heading */}
      <h1 className="form-heading">Sign In</h1>

      <Form onSubmit={handleSubmit(submitHandler)} className="auth-form"> {/* Added custom class */}
        <Form.Group className="mb-4" controlId="email"> {/* Adjusted margin-bottom */}
          <Form.Label className="form-label-custom">Email Address</Form.Label> {/* Added custom class */}
          <Form.Control
            type="email"
            placeholder="Enter email"
            className={`form-input-custom ${errors.email ? 'is-invalid' : ''}`} // Added custom class & validation styling
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address"
              }
            })}
          ></Form.Control>
          {errors.email && <Form.Text className="text-danger error-message">{errors.email.message}</Form.Text>} {/* Added custom class */}
        </Form.Group>

        <Form.Group className="mb-4" controlId="password"> {/* Adjusted margin-bottom */}
          <Form.Label className="form-label-custom">Password</Form.Label> {/* Added custom class */}
          <Form.Control
            type="password"
            placeholder="Enter password"
            className={`form-input-custom ${errors.password ? 'is-invalid' : ''}`} // Added custom class & validation styling
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
          ></Form.Control>
          {errors.password && <Form.Text className="text-danger error-message">{errors.password.message}</Form.Text>} {/* Added custom class */}
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          className="form-submit-btn" // Added custom class
          disabled={isLoading}
        >
          Sign In
        </Button>

        {isLoading && <Loader />} {/* Loader display */}
      </Form>

      <Row className="py-3 form-links-row"> {/* Added custom class */}
        <Col className="text-start register-link-wrapper"> {/* Use text-start for left alignment */}
          New Customer?{' '}
          <Link to="/register" className="form-link">Register</Link> {/* Added custom class */}
        </Col>
        <Col className="text-end">
          <Link to="/forgotpassword" className="form-link">Forgot Password?</Link> {/* Added custom class */}
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginPage;