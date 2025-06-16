// apps/client/src/pages/ShippingPage.jsx
import React, { useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (shippingAddress) {
      setValue('address', shippingAddress.address || '');
      setValue('city', shippingAddress.city || '');
      setValue('postalCode', shippingAddress.postalCode || '');
      setValue('country', shippingAddress.country || '');
    }
  }, [shippingAddress, setValue]);

  const submitHandler = (data) => {
    dispatch(saveShippingAddress(data));
    navigate('/payment');
  };

  return (
    <FormContainer>
      <Helmet><title>ProShop - Shipping</title></Helmet>
      
      <CheckoutSteps step1 step2 /> {/* Keep this as is */}

      <h1 className="form-heading">Shipping</h1> {/* Reusing form-heading class */}
      <Form onSubmit={handleSubmit(submitHandler)} className="auth-form"> {/* Reusing auth-form class */}
        <Form.Group className='mb-4' controlId='address'> {/* Adjusted margin-bottom for consistency */}
          <Form.Label className="form-label-custom">Address</Form.Label> {/* Reusing form-label-custom */}
          <Form.Control
            type='text'
            placeholder='Enter address'
            className={`form-input-custom ${errors.address ? 'is-invalid' : ''}`} 
            {...register('address', { required: 'Address is required' })}
          ></Form.Control>
          {errors.address && <Form.Text className="text-danger error-message">{errors.address.message}</Form.Text>} {/* Reusing error-message */}
        </Form.Group>

        <Form.Group className='mb-4' controlId='city'>
          <Form.Label className="form-label-custom">City</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter city'
            className={`form-input-custom ${errors.city ? 'is-invalid' : ''}`}
            {...register('city', { required: 'City is required' })}
          ></Form.Control>
          {errors.city && <Form.Text className="text-danger error-message">{errors.city.message}</Form.Text>}
        </Form.Group>

        <Form.Group className='mb-4' controlId='postalCode'>
          <Form.Label className="form-label-custom">Postal Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter postal code'
            className={`form-input-custom ${errors.postalCode ? 'is-invalid' : ''}`}
            {...register('postalCode', { required: 'Postal Code is required' })}
          ></Form.Control>
          {errors.postalCode && <Form.Text className="text-danger error-message">{errors.postalCode.message}</Form.Text>}
        </Form.Group>

        <Form.Group className='mb-4' controlId='country'>
          <Form.Label className="form-label-custom">Country</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter country'
            className={`form-input-custom ${errors.country ? 'is-invalid' : ''}`}
            {...register('country', { required: 'Country is required' })}
          ></Form.Control>
          {errors.country && <Form.Text className="text-danger error-message">{errors.country.message}</Form.Text>}
        </Form.Group>

        <Button type='submit' variant='primary' className='form-submit-btn'> {/* Reusing form-submit-btn */}
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingPage;