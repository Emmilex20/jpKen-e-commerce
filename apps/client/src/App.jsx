// C:\Users\user\Desktop\e-commerce-fresh\apps\client\src\App.jsx
import { Routes, Route } from 'react-router-dom'; // No BrowserRouter import here, it will be in main.jsx

// Page Imports
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
// NEW PAGE IMPORTS FOR PASSWORD RESET
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ShippingReturnsPage from './pages/ShippingReturnsPage';
import FAQsPage from './pages/FAQsPage';
import ContactUsPage from './pages/ContactUsPage';

// Admin Page Imports (Ensure these files exist in src/pages/ or adjust paths)
import UserListPage from './pages/UserListPage';
import UserEditPage from './pages/UserEditPage';
import PublicProductListPage from './pages/PublicProductListPage';
import AdminProductListPage from './pages/AdminProductListPage';
import ProductEditPage from './pages/ProductEditPage';
import OrderListPage from './pages/OrderListPage';

// Component Imports
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoutes from './components/PrivateRoutes'; // Ensure this component is named PrivateRoutes (plural)
import AdminRoute from './components/AdminRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './components/ScrollToTop';

// IMPORT THE NEW FLOATING CART BUTTON
import FloatingCartButton from './components/FloatingCartButton'; // <--- ADD THIS IMPORT

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path='/products' element={<PublicProductListPage />} />
          <Route path='/products/page/:pageNumber' element={<PublicProductListPage />} />
          <Route path='products/search/:keyword' element={<PublicProductListPage />} />
          <Route path='products/search/:keyword/page/:pageNumber' element={<PublicProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart/:id?" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* NEW PUBLIC ROUTES FOR PASSWORD RESET */}
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="/resetpassword/:token" element={<ResetPasswordPage />} />
          <Route path='/about-us' element={<AboutPage />} />
          <Route path='/privacy-policy' element={<PrivacyPolicyPage />} />
          <Route path='/shipping-returns' element={<ShippingReturnsPage />} />
          <Route path='/faqs' element={<FAQsPage />} />
          <Route path='/contact-us' element={<ContactUsPage />} />
          

          {/* Protected User Routes */}
          <Route path="" element={<PrivateRoutes />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/placeorder" element={<PlaceOrderPage />} />
            <Route path="/order/:id" element={<OrderPage />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route path="" element={<AdminRoute />}>
            <Route path="/admin/userlist" element={<UserListPage />} />
            <Route path="/admin/user/:id/edit" element={<UserEditPage />} />
            <Route path='/admin/productlist' element={<AdminProductListPage />} />
            <Route path='/admin/productlist/:pageNumber' element={<AdminProductListPage />} />
            <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />
            <Route path="/admin/orderlist" element={<OrderListPage />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      {/* RENDER THE FLOATING CART BUTTON HERE */}
      <FloatingCartButton /> {/* <--- ADD THIS LINE */}
      <ToastContainer />
    </>
  );
}

export default App;