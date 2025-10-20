import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../pages/Products'; // Make sure this path is correct

export const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  
  // *** FIX: Get cartItems directly to make the component reactive ***
  const { cartItems } = useCart();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Load necessary fonts
  React.useEffect(() => {
    // ... (font loading code remains the same)
  }, []);

  return (
    <nav className="navbar" style={{ overflowX: 'hidden' }}>
      <div className="container nav-container">
        {/* Brand Logo Image */}
        <Link to="/" className="brand-logo">
          <img 
            src="https://res.cloudinary.com/duhabjmtf/image/upload/v1760451952/Amogam_Final_bp90ft.png" 
            alt="Venela’s Amoghapindivantalu Logo" 
            className="navbar-logo"
          />
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mobile-menu-button"
          aria-label="Toggle navigation"
        >
          <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            )}
          </svg>
        </button>

        {/* Navigation Links */}
        <div className={`nav-links-container ${isOpen ? 'open' : ''}`}>
          <ul className="nav-links-list">
            {/* ... (Home, Products, etc. links remain the same) */}
            <li><Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Home</Link></li>
            <li><Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Products</Link></li>
            <li><Link to="/franchise" className={`nav-link ${location.pathname === '/franchise' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Franchise</Link></li>
            <li><Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Contact</Link></li>
            
            {/* Cart Link with Badge */}
            <li>
              <Link
                to="/cart"
                className={`nav-link cart-link ${location.pathname === '/cart' ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Cart
                {/* Use the reactive cartItemCount */}
                {cartItemCount > 0 && (
                  <span className="cart-badge" style={{ backgroundColor: '#D62828' }}>
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <style>{`
        /* Styles remain the same */
        .navbar { padding: 0.5rem 1rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); background-color: #ffd54f; position: relative; z-index: 100; }
        .container { width: 100%; max-width: 1200px; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; }
        .nav-container { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; }
        .brand-logo { display: flex; align-items: center; text-decoration: none; }
        .navbar-logo { height: 45px; width: auto; }
        .mobile-menu-button { color: #185e20; padding: 0.5rem; border-radius: 0.375rem; border: none; background: none; cursor: pointer; }
        .menu-icon { width: 2rem; height: 2rem; }
        .nav-links-container { width: 100%; margin-top: 1rem; display: none; }
        .nav-links-container.open { display: block; }
        .nav-links-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; font-size: 1.125rem; }
        .nav-link { display: block; padding: 0.5rem 1rem; border-radius: 50px; transition: all 0.3s ease; color: #185e20; text-decoration: none; font-family: 'Josefin Sans', sans-serif; font-weight: 700; }
        .nav-link:hover { background-color: #D62828; color: white; }
        .nav-link.active { background-color: #D62828; color: white; }
        .cart-link { position: relative; }
        .cart-badge { position: absolute; top: -4px; right: -4px; font-size: 0.75rem; font-weight: 700; color: white; border-radius: 9999px; width: 1.25rem; height: 1.25rem; display: flex; align-items: center; justify-content: center; }
        @media (min-width: 768px) {
          .navbar-logo { height: 60px; }
          .mobile-menu-button { display: none; }
          .nav-links-container { display: flex; align-items: center; width: auto; margin-top: 0; }
          .nav-links-list { flex-direction: row; gap: 1.5rem; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;