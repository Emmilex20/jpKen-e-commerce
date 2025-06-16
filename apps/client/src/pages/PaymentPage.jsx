// apps/client/src/pages/PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shippingAddress, paymentMethod } = useSelector((state) => state.cart);
  // eslint-disable-next-line no-unused-vars
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  // Initialize with existing method or 'PayPal' as default
  const [paymentMethodName, setPaymentMethodName] = useState(paymentMethod || 'PayPal');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethodName));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <Helmet><title>ProShop - Payment Method</title></Helmet>
      <CheckoutSteps step1 step2 step3 />

      <h1 className="form-heading">Payment Method</h1>
      <Form onSubmit={submitHandler} className="auth-form">
        <Form.Group className="mb-4 payment-method-group">
          <Form.Label as='legend' className="payment-label">Select Method</Form.Label>
          <Col className="payment-options-col">
            <Form.Check
              type='radio'
              label='PayPal or Credit Card (via PayPal)'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked={paymentMethodName === 'PayPal'}
              onChange={(e) => setPaymentMethodName(e.target.value)}
              className='payment-radio-item my-3'
            ></Form.Check>

            {/* --- NEW: Paystack Payment Option --- */}
            <Form.Check
              type='radio'
              label='Paystack (Card, Bank Transfer, USSD & more)'
              id='Paystack'
              name='paymentMethod'
              value='Paystack'
              checked={paymentMethodName === 'Paystack'}
              onChange={(e) => setPaymentMethodName(e.target.value)}
              className='payment-radio-item my-3'
            ></Form.Check>
            {/* --- END NEW: Paystack Payment Option --- */}

            <Form.Check
              type='radio'
              label='Credit Card (Other Provider - if you have one)'
              id='CreditCard'
              name='paymentMethod'
              value='CreditCard'
              checked={paymentMethodName === 'CreditCard'}
              onChange={(e) => setPaymentMethodName(e.target.value)}
              className='payment-radio-item my-3'
            ></Form.Check>

            <Form.Check
              type='radio'
              label='Local Bank Transfer (Manual Confirmation)'
              id='BankTransfer'
              name='paymentMethod'
              value='BankTransfer'
              checked={paymentMethodName === 'BankTransfer'}
              onChange={(e) => setPaymentMethodName(e.target.value)}
              className='payment-radio-item my-3'
            ></Form.Check>

          </Col>
        </Form.Group>

        <Button type='submit' variant='primary' className='form-submit-btn mt-3'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentPage;