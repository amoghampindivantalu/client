import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// --- Import all your components and pages ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingCartIcon from './components/FloatingCartIcon';
import AdminDashboard from './pages/AdminDashboard';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminLogin from './pages/AdminLogin'; // <-- Import the new login page

// Pages
import Home from './pages/Home';
import Franchise from './pages/Franchise';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import ProductDetailPage from './pages/ProductDetailPage';

// Import Products page and the essential CartProvider
import { Products, CartProvider } from './pages/Products';

// --- NEW: Protected Route Component ---
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they login.
    return <Navigate to="/login" replace />;
  }
  return children;
};


// Layout wrapper component
function Layout({ isAuthenticated }) {
  const location = useLocation();
  // Don't show header/footer on admin or login routes
  const hideLayout = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!hideLayout && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/franchise" element={<Franchise />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          
          {/* Unprotected route for the login page */}
          <Route path="/login" element={<AdminLogin onLoginSuccess={() => { /* This will be handled by App state */ }} />} />

          {/* ** PROTECTED ADMIN DASHBOARD ROUTE ** */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  // --- NEW: Authentication state for the whole app ---
  const [isAuthenticated, setIsAuthenticated] = useState(
    // Check session storage on initial load
    sessionStorage.getItem('isAdminAuthenticated') === 'true'
  );

  // This effect can be used if you want to handle login state changes globally
  useEffect(() => {
    // A simple way to sync state if it changes in another tab (not fully robust)
    const handleStorageChange = () => {
       setIsAuthenticated(sessionStorage.getItem('isAdminAuthenticated') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <CartProvider>
      <Router>
        {/* Pass auth state to the Layout */}
        <Layout isAuthenticated={isAuthenticated} />
        {/* FloatingCartIcon only appears on non-admin/non-login pages */}
        <FloatingCartIcon />
      </Router>
    </CartProvider>
  );
}

export default App;