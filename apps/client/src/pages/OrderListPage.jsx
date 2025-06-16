// apps/client/src/pages/OrderListPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
// Import icons for check and times, including the new FaBan for canceled
import { FaCheckCircle, FaTimesCircle, FaBan } from 'react-icons/fa';

import {
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useMarkOrderPaidManuallyMutation,
  useCancelOrderMutation, // NEW: Import useCancelOrderMutation
} from '../slices/ordersApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useSelector } from 'react-redux';

const OrderListPage = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();

  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const [markOrderPaidManually, { isLoading: loadingMarkPaidManually }] =
    useMarkOrderPaidManuallyMutation();
  // NEW: Add cancelOrder mutation hook
  const [cancelOrder, { isLoading: loadingCancel }] = useCancelOrderMutation();


  const { userInfo } = useSelector((state) => state.auth);

  const deliverHandler = async (orderId) => {
    if (window.confirm('Are you sure you want to mark this order as delivered?')) {
      try {
        await deliverOrder(orderId).unwrap();
        toast.success('Order delivered successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const markAsPaidHandler = async (orderId) => {
    if (window.confirm('Are you sure you want to manually mark this order as PAID? This action cannot be undone for manual payments.')) {
      try {
        await markOrderPaidManually(orderId).unwrap();
        toast.success('Order successfully marked as paid manually');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  // --- NEW CANCEL HANDLER ---
  const cancelHandler = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone and items will be returned to stock.')) {
      try {
        await cancelOrder(orderId).unwrap();
        toast.success('Order canceled successfully');
        refetch(); // Refetch orders to update the list
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  // --- END NEW CANCEL HANDLER ---

  return (
    <div className="admin-page-wrapper">
      <Helmet><title>ProShop Admin - Orders</title></Helmet>
      <h1 className="admin-heading">Orders</h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger" className="admin-error-message">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="table-responsive-wrapper fade-in-up">
          <Table striped hover responsive className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>CANCELED</th> {/* NEW COLUMN HEADING */}
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">No orders found.</td> {/* Updated colspan */}
                </tr>
              ) : (
                orders.map((order) => {
                  // Pre-calculate date strings for tooltips to avoid complex expressions in JSX
                  const paidAtDate = order.paidAt ? new Date(order.paidAt).toLocaleDateString() : '';
                  const deliveredAtDate = order.isDelivered && order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : '';
                  const canceledAtDate = order.isCanceled && order.canceledAt ? new Date(order.canceledAt).toLocaleDateString() : ''; // NEW: Canceled date

                  return (
                    <tr key={order._id} className="table-row-item">
                      <td>{order._id.substring(order._id.length - 6)}</td>
                      <td>{order.user && order.user.name ? order.user.name : 'N/A'}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td>₦{order.totalPrice.toFixed(2)}</td>
                      <td className="text-center">
                        {order.isPaid ? (
                          // Use the pre-calculated string here
                          <FaCheckCircle className="success-icon" title={`Paid on ${paidAtDate}`} />
                        ) : (
                          <FaTimesCircle className="danger-icon" />
                        )}
                      </td>
                      <td className="text-center">
                        {order.isDelivered ? (
                          // Use the pre-calculated string here
                          <FaCheckCircle className="success-icon" title={`Delivered on ${deliveredAtDate}`} />
                        ) : (
                          <FaTimesCircle className="danger-icon" />
                        )}
                      </td>
                      {/* NEW: CANCELED COLUMN CELL */}
                      <td className="text-center">
                        {order.isCanceled ? (
                          <FaBan className="info-icon" title={`Canceled on ${canceledAtDate}`} /> // Use FaBan for canceled
                        ) : (
                          <FaTimesCircle className="danger-icon" />
                        )}
                      </td>
                      {/* END NEW CANCELED COLUMN CELL */}
                      <td className="table-actions">
                        <Link to={`/order/${order._id}`} className="btn btn-outline-primary btn-sm me-2 action-btn">
                          Details
                        </Link>

                        {userInfo && userInfo.isAdmin && !order.isPaid && order.paymentMethod !== 'PayPal' && !order.isCanceled && ( // Only show if not paid, not PayPal method, and not canceled
                          <Button
                            variant="info"
                            className="btn-sm me-2 action-btn"
                            onClick={() => markAsPaidHandler(order._id)}
                            disabled={loadingMarkPaidManually}
                          >
                            {loadingMarkPaidManually ? <Loader size="sm" /> : 'Mark Paid'}
                          </Button>
                        )}

                        {userInfo && userInfo.isAdmin && !order.isDelivered && order.isPaid && !order.isCanceled && ( // Only show if paid, not delivered, and not canceled
                          <Button
                            variant="success"
                            className="btn-sm action-btn"
                            onClick={() => deliverHandler(order._id)}
                            disabled={loadingDeliver}
                          >
                            {loadingDeliver ? <Loader size="sm" /> : 'Deliver'}
                          </Button>
                        )}

                        {/* --- NEW CANCEL BUTTON (ADMIN ONLY) --- */}
                        {userInfo && userInfo.isAdmin && !order.isPaid && !order.isDelivered && !order.isCanceled && ( // Only show if admin, not paid, not delivered, and not already canceled
                          <Button
                            variant="danger"
                            className="btn-sm ms-2 action-btn" // Add margin-left for spacing
                            onClick={() => cancelHandler(order._id)}
                            disabled={loadingCancel}
                          >
                            {loadingCancel ? <Loader size="sm" /> : 'Cancel'}
                          </Button>
                        )}
                        {/* --- END NEW CANCEL BUTTON --- */}

                      </td>
                    </tr>
                  ); // Make sure to return the JSX from the map function
                })
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default OrderListPage;