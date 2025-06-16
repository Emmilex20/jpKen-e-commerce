// C:\Users\user\Desktop\e-commerce-fresh\apps\client\src\components\AdminRoute.jsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Assuming you use Redux for auth state

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth); // Get userInfo from Redux state
  return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;