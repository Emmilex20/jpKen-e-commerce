// apps/client/src/pages/OrderPage.jsx

import { useEffect, useState } from 'react'; // Import useState
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { FaCheckCircle, FaTimesCircle, FaChevronLeft } from 'react-icons/fa';
import io from 'socket.io-client'; // Import socket.io-client

import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useDeliverOrderMutation,
  useMarkOrderPaidManuallyMutation,
  useInitializePaystackPaymentMutation,
  useCancelOrderMutation, // NEW: Import useCancelOrderMutation
} from '../slices/ordersApiSlice';

import { usePaystackPayment } from 'react-paystack'; // Correct import for react-paystack hook

const OrderPage = () => {
  const { id: orderId } = useParams();

  // RTK Query hook to fetch order data
  const { data: queriedOrderData, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

  // Local state to hold the order data for display and real-time updates
  // Initialize with null to ensure explicit checks before accessing properties
  const [displayOrder, setDisplayOrder] = useState(null);

  // Effect to update `displayOrder` when `queriedOrderData` changes (initial fetch, refetch)
  useEffect(() => {
    if (queriedOrderData) {
      setDisplayOrder(queriedOrderData);
    }
  }, [queriedOrderData]);


  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation(); // For PayPal
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const [markOrderPaidManually, { isLoading: loadingMarkPaidMan_Manual }] =
    useMarkOrderPaidManuallyMutation();
  // NEW: Add cancelOrder mutation hook
  const [cancelOrder, { isLoading: loadingCancel }] = useCancelOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  // --- PAYSTACK INTEGRATION START ---
  const [initializePaystackPayment, { isLoading: loadingPaystackInit }] =
    useInitializePaystackPaymentMutation();

  // Paystack configuration object (initial values for the react-paystack hook)
  // Ensure `displayOrder` is checked before accessing properties
  const paystackConfig = {
    reference: '', // Will be updated by backend response
    email: userInfo?.email || '', // Provide a default empty string if userInfo.email is null/undefined
    amount: displayOrder?.totalPrice * 100 || 0, // Ensure initial amount is in kobo or 0
    publicKey: 'pk_test_f8c6dab51136220aed88b8fbcb639c43a8aa9d73', // <<< IMPORTANT: REPLACE WITH YOUR ACTUAL PAYSTACK PUBLIC KEY
    metadata: {
      order_id: orderId,
    },
  };

  const paystackPop = usePaystackPayment(paystackConfig); // Renamed initializePaystackPop to paystackPop for clarity

  const paystackPaymentHandler = async () => {
    try {
      // Use `displayOrder` for all checks
      if (!displayOrder) {
        toast.error('Order data not available');
        return;
      }
      if (!userInfo.email) {
        toast.error('User email not available for Paystack. Please log in again.');
        return;
      }
      if (!displayOrder.totalPrice || displayOrder.totalPrice <= 0) {
        toast.error('Order total price is invalid for payment.');
        return;
      }

      // 1. Calculate amount and ensure it's an integer for Paystack
      const amountInKobo = Math.round(displayOrder.totalPrice * 100);

      // 2. Call your backend to initialize the Paystack transaction
      const backendResponse = await initializePaystackPayment({
        orderId,
        amount: amountInKobo,
        email: userInfo.email,
      }).unwrap();

      // --- CRITICAL CORRECTION: Destructure directly from backendResponse ---
      // eslint-disable-next-line no-unused-vars
      const { reference, authorization_url, access_code } = backendResponse;
      // --- END CRITICAL CORRECTION ---

      // 3. Update the config for the react-paystack popup with the reference from the backend
      const updatedConfig = {
        ...paystackConfig,
        reference: reference, // Use the reference from the backend's direct response
        amount: amountInKobo, // Confirm amount for the popup (in Kobo)
        email: userInfo.email, // Confirm email for the popup
      };

      // 4. Initialize the Paystack payment popup with updated config and callbacks
      paystackPop({ // Use the paystackPop function returned by usePaystackPayment
        ...updatedConfig,
        onSuccess: (paymentResult) => {
          console.log('Paystack Payment Success (client-side callback):', paymentResult);
          toast.success('Payment successful!');
          // The socket.io event from the backend will now handle the UI update.
          // Keeping refetch as a fallback/confirmation to ensure data consistency after a moment.
          refetch();
        },
        onClose: () => {
          console.log('Paystack Payment closed.');
          toast.info('Payment cancelled.');
        },
      });

    } catch (err) {
      console.error('Paystack initialization or popup error:', err);
      toast.error(err?.data?.message || err.error || 'Failed to initiate Paystack payment. Please try again.');
    }
  };
  // --- PAYSTACK INTEGRATION END ---

  // --- SOCKET.IO INTEGRATION START ---
  useEffect(() => {
    // Ensure orderId is available before attempting to connect
    if (!orderId) return;

    // Connect to your backend URL where Socket.IO is running
    // Make sure VITE_BACKEND_URL is set in your .env file (e.g., VITE_BACKEND_URL=http://localhost:5000 or your ngrok URL)
    const socket = io(import.meta.env.VITE_BACKEND_URL);

    socket.on('connect', () => {
      console.log('Socket.IO: Connected to server:', socket.id);
      // Join a specific room for this order
      socket.emit('joinOrderRoom', orderId);
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO: Disconnected from server');
    });

    // Listen for the 'paymentSuccess' event from the backend
    socket.on('paymentSuccess', (data) => {
      console.log('Socket.IO: Payment Success Event Received:', data);
      if (data.orderId === orderId) { // Ensure the event is for the current order
        toast.success('Payment confirmed in real-time!');
        // Update the `displayOrder` state directly for immediate UI update
        setDisplayOrder(prevOrder => {
            // Defensive check: only update if prevOrder exists
            if (!prevOrder) return prevOrder;
            return {
                ...prevOrder,
                isPaid: data.isPaid,
                paidAt: data.paidAt,
                paymentResult: data.paymentResult
            };
        });
        // Refetch to ensure all other derived data (if any) is perfectly in sync
        // This acts as a definitive state update from the database
        refetch();
      }
    });
    
    // NEW: Listen for 'orderCanceled' event
    socket.on('orderCanceled', (data) => {
      console.log('Socket.IO: Order Canceled Event Received:', data);
      if (data.orderId === orderId) {
        toast.info('Order has been canceled in real-time!');
        setDisplayOrder(prevOrder => {
          if (!prevOrder) return prevOrder;
          return {
            ...prevOrder,
            isCanceled: data.isCanceled,
            canceledAt: data.canceledAt,
          };
        });
        refetch(); // Refetch to ensure full consistency
      }
    });

    // Clean up the socket connection when the component unmounts or orderId changes
    return () => {
      if (socket) {
        socket.emit('leaveOrderRoom', orderId); // Inform server we're leaving the room
        socket.disconnect();
        console.log('Socket.IO: Cleaned up connection.');
      }
    };
  }, [orderId, refetch]); // Depend on orderId and refetch


  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      // Use `displayOrder` here
      if (displayOrder && !displayOrder.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, paypal, displayOrder, paypalDispatch]);


  function onApprove(data, actions) {
    return actions.order.capture().then(async (details) => {
      try {
        await payOrder({ orderId, details }).unwrap();
        refetch();
        toast.success('Payment successful');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: displayOrder.totalPrice, // Use `displayOrder` here
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success('Order delivered successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const markAsPaidManuallyHandler = async () => {
    if (window.confirm('Are you sure you want to manually mark this order as PAID? This action cannot be undone.')) {
      try {
        await markOrderPaidManually(orderId).unwrap();
        refetch();
        toast.success('Order successfully marked as paid manually');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  // --- NEW CANCEL HANDLER ---
  const cancelHandler = async () => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone and items will be returned to stock.')) {
      try {
        await cancelOrder(orderId).unwrap();
        refetch(); // Refetch to ensure the updated status is reflected
        toast.success('Order canceled successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  // --- END NEW CANCEL HANDLER ---


  // --- Conditional Rendering with Robust Checks ---
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger" className="admin-error-message">{error?.data?.message || error.error}</Message>
  ) : !displayOrder ? ( // Important: Check if displayOrder is null/undefined after loading and no error
    <Message variant="info">Order details could not be loaded or order not found.</Message>
  ) : (
    // Now it's safe to use `displayOrder` as it's guaranteed to be an object
    <div className="order-page-wrapper fade-in-up">
      {/* Access displayOrder properties safely */}
      <Helmet><title>ProShop - Order {displayOrder._id.substring(displayOrder._id.length - 6)}</title></Helmet>

      <Link to={userInfo && userInfo.isAdmin ? '/admin/orderlist' : '/profile'} className="btn btn-light my-3 admin-back-btn">
        <FaChevronLeft className="me-1" /> Go Back
      </Link>

      <h1 className="order-page-title mb-4">Order <span className="order-id-highlight">{displayOrder._id}</span></h1>

      <Row>
        <Col md={8}>
          <ListGroup variant="flush" className="order-details-wrapper">
            <ListGroup.Item className="order-info-item">
              <h2 className="order-section-heading">Shipping Address</h2>
              <p>
                <strong>Name: </strong> {displayOrder.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${displayOrder.user.email}`} className="order-email-link">{displayOrder.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                <br />
                {displayOrder.shippingAddress.address}, {displayOrder.shippingAddress.city}, {displayOrder.shippingAddress.postalCode},{' '}
                {displayOrder.shippingAddress.country}
              </p>
              {displayOrder.isDelivered ? (
                <Message variant="success" className="order-status-message success">
                  <FaCheckCircle className="me-2" /> Delivered on {new Date(displayOrder.deliveredAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Message>
              ) : (
                <Message variant="danger" className="order-status-message danger">
                  <FaTimesCircle className="me-2" /> Not Delivered
                </Message>
              )}
               {/* NEW: Display Canceled Status */}
              {displayOrder.isCanceled ? (
                <Message variant="warning" className="order-status-message warning">
                  <FaTimesCircle className="me-2" /> Canceled on {new Date(displayOrder.canceledAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Message>
              ) : null}
            </ListGroup.Item>

            <ListGroup.Item className="order-info-item">
              <h2 className="order-section-heading">Payment Method</h2>
              <p>
                <strong>Method: </strong>
                <span className="payment-method-text">{displayOrder.paymentMethod}</span>
              </p>
              {displayOrder.isPaid ? (
                <Message variant="success" className="order-status-message success">
                  <FaCheckCircle className="me-2" /> Paid on {new Date(displayOrder.paidAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Message>
              ) : (
                <Message variant="danger" className="order-status-message danger">
                  <FaTimesCircle className="me-2" /> Not Paid
                </Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item className="order-info-item">
              <h2 className="order-section-heading">Order Items</h2>
              {displayOrder.orderItems.length === 0 ? (
                <Message variant="info" className="order-status-message info">Order is empty</Message>
              ) : (
                <ListGroup variant="flush" className="order-item-list">
                  {displayOrder.orderItems.map((item, index) => (
                    <ListGroup.Item key={index} className="order-item">
                      <Row className="align-items-center">
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                            className="order-item-image"
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`} className="order-item-name-link">
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4} className="order-item-price">
                          {item.qty} &times; ₦{item.price.toFixed(2)} = ₦{ (item.qty * item.price).toFixed(2) }
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card className="order-summary-card">
            <ListGroup variant="flush">
              <ListGroup.Item className="order-summary-header">
                <h2 className="order-section-heading">Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item className="order-total-row">
                <Row>
                  <Col>Items</Col>
                  <Col className="text-end">₦{displayOrder.itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="order-total-row">
                <Row>
                  <Col>Shipping</Col>
                  <Col className="text-end">₦{displayOrder.shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="order-total-row">
                <Row>
                  <Col>Tax</Col>
                  <Col className="text-end">₦{displayOrder.taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="order-total-row total-price">
                <Row>
                  <Col><strong>Total</strong></Col>
                  <Col className="text-end"><strong>₦{displayOrder.totalPrice.toFixed(2)}</strong></Col>
                </Row>
              </ListGroup.Item>

              {/* PayPal Buttons */}
              {!displayOrder.isPaid && displayOrder.paymentMethod === 'PayPal' && !displayOrder.isCanceled && ( // Only show if not paid and not canceled
                <ListGroup.Item className="paypal-section">
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div className="paypal-buttons-container">
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {/* Paystack Payment Button */}
              {!displayOrder.isPaid && displayOrder.paymentMethod === 'Paystack' && !displayOrder.isCanceled && ( // Only show if not paid and not canceled
                <ListGroup.Item>
                  {loadingPaystackInit && <Loader />}

                  <Button
                    variant='success'
                    className='btn btn-block'
                    onClick={paystackPaymentHandler}
                    disabled={loadingPaystackInit || !displayOrder.totalPrice || !userInfo.email}
                  >
                    Pay with Paystack
                  </Button>
                </ListGroup.Item>
              )}

              {/* Admin "Mark as Paid" button (for non-PayPal/non-Paystack orders, or manual override) */}
              {userInfo && userInfo.isAdmin && !displayOrder.isPaid && !displayOrder.isCanceled && ( // Only show if admin, not paid, and not canceled
                <ListGroup.Item>
                  {loadingMarkPaidMan_Manual && <Loader />}
                  <Button
                    type="button"
                    className={`btn-block admin-action-btn mark-paid-btn ${loadingMarkPaidMan_Manual ? 'disabled-btn' : ''}`}
                    onClick={markAsPaidManuallyHandler}
                    disabled={loadingMarkPaidMan_Manual}
                  >
                    Mark As Paid (Manual)
                  </Button>
                </ListGroup.Item>
              )}


              {/* Admin Mark As Delivered Button */}
              {userInfo && userInfo.isAdmin && displayOrder.isPaid && !displayOrder.isDelivered && !displayOrder.isCanceled && ( // Only show if admin, paid, not delivered, and not canceled
                <ListGroup.Item>
                  {loadingDeliver && <Loader />}
                  <Button
                    type="button"
                    className={`btn-block admin-action-btn deliver-btn ${loadingDeliver ? 'disabled-btn' : ''}`}
                    onClick={deliverHandler}
                    disabled={loadingDeliver}
                  >
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}

              {/* --- NEW CANCEL BUTTON (USER & ADMIN) --- */}
              {/* Show if: (current user is order owner AND not paid/delivered) OR (user is admin)
                  AND order is NOT already canceled. */}
              {((userInfo && displayOrder.user._id === userInfo._id && !displayOrder.isPaid && !displayOrder.isDelivered) || (userInfo && userInfo.isAdmin)) && !displayOrder.isCanceled && (
                <ListGroup.Item>
                  <Button
                    type='button'
                    variant='danger' // Use danger variant for cancel button
                    className='btn-block'
                    onClick={cancelHandler}
                    disabled={loadingCancel}
                  >
                    {loadingCancel ? 'Canceling...' : 'Cancel Order'}
                  </Button>
                  {loadingCancel && <Loader />}
                </ListGroup.Item>
              )}
              {/* --- END NEW CANCEL BUTTON --- */}

            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderPage;