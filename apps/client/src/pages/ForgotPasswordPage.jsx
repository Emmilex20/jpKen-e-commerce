// apps/client/src/pages/ForgotPasswordPage.jsx
// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap'; // Import Row and Col for layout
// eslint-disable-next-line no-unused-vars
import { useDispatch, useSelector } from 'react-redux'; // Not strictly needed for this page, but good to have if you expand
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useForgotPasswordMutation } from '../slices/authApiSlice'; // Import the new hook
import { Helmet } from 'react-helmet-async'; // For SEO

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      toast.success('Password reset email sent. Please check your inbox.');
      setEmail(''); // Clear the email field after successful submission
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>
      <h1>Forgot Password</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3' disabled={isLoading}>
          Send Reset Link
        </Button>

        {isLoading && <Loader />}

        <Row className='py-3'>
          <Col>
            Remembered your password? <Link to='/login'>Login</Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default ForgotPasswordPage;