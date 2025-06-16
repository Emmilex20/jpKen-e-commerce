// apps/client/src/pages/UserEditPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../slices/usersApiSlice';

const UserEditPage = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin }).unwrap();
      toast.success('User updated successfully');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="admin-page-wrapper"> 
      <Helmet><title>ProShop Admin - Edit User</title></Helmet> 
      
      <Link to="/admin/userlist" className="btn btn-light my-3 admin-back-btn"> 
        Go Back
      </Link>
      
    
      <FormContainer className="product-edit-form-container fade-in-up"> 
        <h1 className="admin-heading mb-4">Edit User</h1> 
        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger" className="admin-error-message">{error?.data?.message || error.error}</Message> 
        ) : (
          <Form onSubmit={submitHandler} className="product-edit-form"> 
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

            <Form.Group controlId="email" className="mb-3">
              <Form.Label className="form-label-custom">Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control-custom"
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="isAdmin" className="mb-4"> 
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="form-check-custom"
              ></Form.Check>
            </Form.Group>

            <Button 
              type="submit" 
              variant="primary" 
              className={`w-100 product-update-btn ${loadingUpdate ? 'disabled-btn' : ''}`} 
              disabled={loadingUpdate}
            >
              {loadingUpdate ? 'Updating...' : 'Update'}
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
};

export default UserEditPage;