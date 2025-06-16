// apps/client/src/components/PrivateRoutes.jsx
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoutes = () => {
  // Get userInfo from the Redux state
  const { userInfo } = useSelector((state) => state.auth);

  // If userInfo exists (user is logged in), render the nested routes (Outlet)
  // Otherwise, navigate to the login page
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoutes;