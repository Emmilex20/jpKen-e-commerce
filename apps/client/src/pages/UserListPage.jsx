// apps/client/src/pages/UserListPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Table, Button, Row, Col } from 'react-bootstrap'; // Import Row and Col
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from '../slices/usersApiSlice';
import { useSelector } from 'react-redux';

const UserListPage = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap();
        toast.success('User deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="admin-page-wrapper"> {/* Use admin-page-wrapper */}
      <Helmet><title>ProShop Admin - Users</title></Helmet> {/* More descriptive title */}
      
      <Row className="align-items-center mb-4 user-list-header"> {/* Bootstrap Row for layout */}
        <Col>
          <h1 className="admin-heading mb-0">Users</h1> {/* Reusing admin-heading */}
        </Col>
      </Row>

      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger" className="admin-error-message"> {/* Reusing admin-error-message */}
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="table-responsive-wrapper fade-in-up"> {/* Reusing table wrapper and animation */}
          <Table striped hover responsive className="admin-table user-list-table"> {/* Reusing admin-table, adding specific class */}
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th className="text-center">ADMIN</th> {/* Center align header for consistency */}
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="table-row-item"> {/* Reusing table-row-item */}
                    <td>{user._id.substring(user._id.length - 6)}</td> {/* Shorten ID */}
                    <td>{user.name}</td>
                    <td>
                      <a href={`mailto:${user.email}`} className="user-email-link">{user.email}</a> {/* Custom class for email link */}
                    </td>
                    <td className="text-center"> {/* Center align icon */}
                      {user.isAdmin ? (
                        <FaCheck className="success-icon" /> 
                      ) : (
                        <FaTimes className="danger-icon" /> 
                      )}
                    </td>
                    <td className="table-actions"> 
                      <Link to={`/admin/user/${user._id}/edit`} className="action-btn edit-btn me-2"> 
                        <FaEdit />
                      </Link>
                      <Button
                        onClick={() => deleteHandler(user._id)}
                        className="action-btn delete-btn" 
                        disabled={loadingDelete || user._id === userInfo._id}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UserListPage;