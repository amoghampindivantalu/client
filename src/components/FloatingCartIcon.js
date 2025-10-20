import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../pages/Products'; // Make sure this path is correct

export const FloatingCartIcon = () => {
  const location = useLocation();

  // *** FIX: Get cartItems directly to make the component reactive ***
  const { cartItems } = useCart();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Do not show the icon if cart is empty or on the cart page
  if (cartItemCount === 0 || location.pathname === '/cart') {
    return null;
  }

  return (
    <div className="floating-cart-container">
      <Link
        to="/cart"
        className="floating-cart-link"
        aria-label="View shopping cart"
      >
        <span className="material-symbols-outlined">shopping_cart</span>
        <span className="floating-cart-badge">{cartItemCount}</span>
      </Link>
      <style>{`
        .floating-cart-container {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 999;
        }
        .floating-cart-link {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background-color: #D62828;
          color: white;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          transition: transform 0.3s ease;
          text-decoration: none;
        }
        .floating-cart-link:hover {
          transform: scale(1.1);
        }
        .floating-cart-link .material-symbols-outlined {
          font-size: 32px;
        }
        .floating-cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 24px;
          height: 24px;
          background-color: #185E20;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default FloatingCartIcon;