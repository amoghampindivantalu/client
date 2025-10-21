import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// --- Import all your components and pages ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingCartIcon from './components/FloatingCartIcon';
import AdminDashboard from './pages/AdminDashboard';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminLogin from './pages/AdminLogin';

// Pages
import Home from './pages/Home';
import Franchise from './pages/Franchise';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import ProductDetailPage from './pages/ProductDetailPage';

// Import Products page and the essential CartProvider
import { Products, CartProvider } from './pages/Products';

// --- Protected Route Component ---
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Layout wrapper component
function Layout({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
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
          
          {/* Login route with proper callback */}
          <Route 
            path="/login" 
            element={
              <AdminLogin 
                onLoginSuccess={() => {
                  console.log('Login success callback triggered');
                  setIsAuthenticated(true);
                }} 
              />
            } 
          />

          {/* Protected Admin Dashboard Route */}
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
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('isAdminAuthenticated') === 'true'
  );

  // Sync authentication state changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(sessionStorage.getItem('isAdminAuthenticated') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <CartProvider>
      <Router>
        <Layout isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <FloatingCartIcon />
      </Router>
    </CartProvider>
  );
}

export default App;