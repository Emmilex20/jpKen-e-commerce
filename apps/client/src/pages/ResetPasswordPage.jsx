// apps/client/src/pages/ResetPasswordPage.jsx
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useResetPasswordMutation } from '../slices/authApiSlice'; // Import the new hook
import { Helmet } from 'react-helmet-async'; // For SEO

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { token } = useParams(); // Get the reset token from the URL params
  const navigate = useNavigate();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    // Optional: You could add a check here to ensure 'token' exists
    // before attempting to render the form, or show a message if it's missing.
    if (!token) {
      toast.error('Password reset token is missing or invalid.');
      navigate('/login'); // Redirect if no token
    }
  }, [token, navigate]);


  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) { // Basic password length validation
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      await resetPassword({ resettoken: token, password }).unwrap(); // Pass token and password
      toast.success('Password reset successfully! You are now logged in.');
      navigate('/'); // Or navigate to /profile, /login etc. based on preference
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <h1>Reset Password</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='password'>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter new password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm new password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3' disabled={isLoading}>
          Reset Password
        </Button>

        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default ResetPasswordPage;