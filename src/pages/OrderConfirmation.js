// pages/OrderConfirmation.js

import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const { order } = location.state || {}; // Get order details passed from the cart page

  // Play success sound when order is confirmed
  useEffect(() => {
    if (order) {
      const audio = new Audio('/success.mp3');
      audio.play().catch(error => {
        console.error("Audio playback failed:", error);
      });
    }
  }, [order]);

  // Debug: Log the order object to see its structure
  useEffect(() => {
    if (order) {
      console.log('Order object:', order);
      console.log('Order items:', order.items);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="confirmation-container" style={styles.container}>
        <div className="confirmation-card" style={styles.card}>
          <h1 style={styles.header}>Order Not Found</h1>
          <p style={styles.text}>We couldn't find your order details. Please check your email for a confirmation.</p>
          <Link to="/" style={styles.button}>Go to Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-container" style={styles.container}>
      <div className="confirmation-card" style={styles.card}>
        <div style={styles.iconWrapper}>✅</div>
        <h1 style={styles.header}>Thank you for your order!</h1>
        <p style={styles.text}>
          Your order has been placed successfully. A confirmation email has been sent to <strong>{order.customerEmail}</strong>.
        </p>
        
        <div style={styles.orderDetails}>
          <h2 style={styles.subHeader}>Order Summary</h2>
          <div style={styles.infoSection}>
            <p style={styles.detailItem}><strong>Order ID:</strong> #{order.id}</p>
            <p style={styles.detailItem}><strong>Customer Name:</strong> {order.customerName}</p>
            <p style={styles.detailItem}><strong>Phone:</strong> {order.customerPhone}</p>
            <p style={styles.detailItem}><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
          </div>

          <h3 style={styles.productsHeader}>Ordered Items</h3>
          <div style={styles.productsContainer}>
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={index} style={styles.productItem}>
                  <div style={styles.productInfo}>
                    <span style={styles.productName}>
                      {item.name || item.productName || 'Product'}
                    </span>
                    <span style={styles.productDetails}>
                      Quantity: {item.quantity || 1} {item.unit || item.selectedUnit || 'unit'} • ₹{parseFloat(item.price || item.unitPrice || 0).toFixed(2)} each
                    </span>
                  </div>
                  <span style={styles.productTotal}>
                    ₹{((item.quantity || 1) * (item.price || item.unitPrice || 0)).toFixed(2)}
                  </span>
                </div>
              ))
            ) : order.orderItems && order.orderItems.length > 0 ? (
              order.orderItems.map((item, index) => (
                <div key={index} style={styles.productItem}>
                  <div style={styles.productInfo}>
                    <span style={styles.productName}>
                      {item.name || item.productName || 'Product'}
                    </span>
                    <span style={styles.productDetails}>
                      Quantity: {item.quantity || 1} {item.unit || item.selectedUnit || 'unit'} • ₹{parseFloat(item.price || item.unitPrice || 0).toFixed(2)} each
                    </span>
                  </div>
                  <span style={styles.productTotal}>
                    ₹{((item.quantity || 1) * (item.price || item.unitPrice || 0)).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p style={styles.noItems}>No items found in this order</p>
            )}
          </div>

          <div style={styles.priceBreakdown}>
            <div style={styles.priceRow}>
              <span>Subtotal:</span>
              <span>₹{parseFloat(order.subtotal || 0).toFixed(2)}</span>
            </div>
            <div style={styles.priceRow}>
              <span>Shipping Charge:</span>
              <span>₹{parseFloat(order.shippingCharge || 0).toFixed(2)}</span>
            </div>
            <div style={styles.totalRow}>
              <span><strong>Total Amount:</strong></span>
              <span><strong>₹{parseFloat(order.totalAmount).toFixed(2)}</strong></span>
            </div>
          </div>
        </div>
        
        <div style={styles.buttonGroup}>
          <Link to="/products" style={styles.button}>Continue Shopping</Link>
          <Link to="/" style={{...styles.button, ...styles.secondaryButton}}>Go to Homepage</Link>
        </div>

        <div style={styles.helpText}>
          <p>Need help with your order? Contact us at support@amogam.com</p>
        </div>
      </div>
    </div>
  );
};

// Enhanced styles for the component
const styles = {
  container: { 
    backgroundColor: '#fdf8f0', 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: '2rem' 
  },
  card: { 
    backgroundColor: 'white', 
    borderRadius: '1rem', 
    padding: '2.5rem', 
    textAlign: 'center', 
    maxWidth: '700px', 
    width: '100%', 
    boxShadow: '0 10px 30px -15px rgba(0,0,0,0.1)' 
  },
  iconWrapper: { 
    fontSize: '4rem', 
    marginBottom: '1rem' 
  },
  header: { 
    fontFamily: 'Marcellus, serif', 
    color: '#185e20', 
    fontSize: '2rem', 
    marginBottom: '0.5rem' 
  },
  subHeader: { 
    fontFamily: 'Marcellus, serif', 
    color: '#185e20', 
    fontSize: '1.25rem', 
    marginBottom: '1rem', 
    borderBottom: '2px solid #ffd54f', 
    paddingBottom: '0.5rem',
    textAlign: 'left'
  },
  productsHeader: {
    fontFamily: 'Marcellus, serif',
    color: '#185e20',
    fontSize: '1.1rem',
    marginTop: '1.5rem',
    marginBottom: '1rem',
    textAlign: 'left',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #e5e7eb'
  },
  text: { 
    fontFamily: 'Lora, serif', 
    color: '#545454', 
    lineHeight: '1.6', 
    marginBottom: '2rem' 
  },
  orderDetails: { 
    textAlign: 'left', 
    margin: '2rem 0', 
    padding: '1.5rem', 
    backgroundColor: '#f9fafb', 
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb'
  },
  infoSection: {
    marginBottom: '1rem'
  },
  detailItem: { 
    fontFamily: 'Lora, serif', 
    marginBottom: '0.5rem',
    color: '#374151',
    fontSize: '0.95rem'
  },
  productsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem'
  },
  productItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb'
  },
  productInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  productName: {
    fontFamily: 'Lora, serif',
    fontWeight: '600',
    color: '#111827',
    fontSize: '1rem',
    marginBottom: '0.25rem'
  },
  productDetails: {
    fontFamily: 'Lora, serif',
    color: '#6b7280',
    fontSize: '0.85rem'
  },
  productTotal: {
    fontFamily: 'Josefin Sans, sans-serif',
    fontWeight: '700',
    color: '#2563eb',
    fontSize: '1rem'
  },
  noItems: {
    textAlign: 'center',
    color: '#6b7280',
    fontStyle: 'italic',
    padding: '1rem'
  },
  priceBreakdown: {
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTop: '2px solid #e5e7eb'
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    fontFamily: 'Lora, serif',
    color: '#374151',
    fontSize: '0.95rem'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    marginTop: '0.5rem',
    paddingTop: '1rem',
    borderTop: '2px solid #ffd54f',
    fontFamily: 'Josefin Sans, sans-serif',
    fontSize: '1.1rem',
    color: '#185e20'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '2rem'
  },
  button: { 
    display: 'inline-block', 
    padding: '0.8rem 1.5rem', 
    backgroundColor: '#D62828', 
    color: 'white', 
    textDecoration: 'none', 
    borderRadius: '50px', 
    fontWeight: '700', 
    fontFamily: 'Josefin Sans, sans-serif',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  secondaryButton: {
    backgroundColor: '#185e20'
  },
  helpText: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e5e7eb',
    fontFamily: 'Lora, serif',
    color: '#6b7280',
    fontSize: '0.9rem'
  }
};

export default OrderConfirmation;