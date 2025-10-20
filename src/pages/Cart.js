import React, { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './Products';

// --- Country Data ---
const countryData = [
    { name: "India", code: "IN", phone: "91", flag: "🇮🇳", phoneLength: 10, pincodeRegex: /^\d{6}$/ },
    { name: "United States", code: "US", phone: "1", flag: "🇺🇸", phoneLength: 10, pincodeRegex: /^\d{5}(-\d{4})?$/ },
    { name: "United Kingdom", code: "GB", phone: "44", flag: "🇬🇧", phoneLength: 10, pincodeRegex: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i },
    { name: "United Arab Emirates", code: "AE", phone: "971", flag: "🇦🇪", phoneLength: 9, pincodeRegex: null },
    { name: "Australia", code: "AU", phone: "61", flag: "🇦🇺", phoneLength: 9, pincodeRegex: /^\d{4}$/ },
    { name: "Canada", code: "CA", phone: "1", flag: "🇨🇦", phoneLength: 10, pincodeRegex: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i },
];

export const Cart = () => {
  // --- Hooks & Context ---
  const { cartItems, updateQuantity, getCartTotal, getCartItemCount, clearCart } = useCart();
  const navigate = useNavigate();

  // --- State ---
  const [formData, setFormData] = useState({
    customerName: '', customerEmail: '', mobileNumber: '',
    countryCode: '+91', address: '', pincode: '',
    country: 'India', city: ''
  });
  const [errors, setErrors] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // --- Constants ---
  const API_URL = 'http://localhost:5000/api';

  // --- Derived State ---
  const isSiddipetDelivery = useMemo(() => formData.city.trim().toLowerCase() === 'siddipet', [formData.city]);
  const shippingCharge = isSiddipetDelivery ? 0 : 99;
  const subtotal = getCartTotal();
  const total = subtotal + shippingCharge;

  // --- Form Validation ---
  const validateForm = useCallback(() => {
    const newErrors = {};
    const selectedCountry = countryData.find(c => c.name === formData.country);

    if (!formData.customerName.trim()) newErrors.customerName = 'Full Name is required.';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) newErrors.customerEmail = 'Email is invalid.';

    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile Number is required.';
    else if (selectedCountry && selectedCountry.phoneLength && formData.mobileNumber.trim().length !== selectedCountry.phoneLength) {
        newErrors.mobileNumber = `Must be ${selectedCountry.phoneLength} digits for ${selectedCountry.name}.`;
    }

    if (!formData.address.trim()) newErrors.address = 'Delivery Address is required.';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required.';
    else if (selectedCountry && selectedCountry.pincodeRegex && !selectedCountry.pincodeRegex.test(formData.pincode)) {
        newErrors.pincode = `Invalid pincode format for ${selectedCountry.name}.`;
    }
    if (!formData.country.trim()) newErrors.country = 'Country is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const isFormReadyForPayment = useMemo(() => {
      const basicFormValid =
             formData.customerName.trim() !== '' &&
             formData.customerEmail.trim() !== '' && /\S+@\S+\.\S+/.test(formData.customerEmail) &&
             formData.mobileNumber.trim() !== '' &&
             formData.address.trim() !== '' &&
             formData.pincode.trim() !== '' &&
             formData.city.trim() !== '' &&
             formData.country.trim() !== '';
      return basicFormValid && Object.keys(errors).length === 0;
  }, [formData, errors]);

  // --- Event Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountryName = e.target.value;
    const selectedCountry = countryData.find(c => c.name === selectedCountryName);
    if (selectedCountry) {
      setFormData(prev => ({
        ...prev,
        country: selectedCountry.name,
        countryCode: `+${selectedCountry.phone}`,
        mobileNumber: ''
      }));
      setErrors(prev => ({ ...prev, country: null, mobileNumber: null }));
    }
  };

  // --- Razorpay Payment Logic ---
  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-checkout-js')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-checkout-js';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const createOrderInBackend = useCallback(async (orderData) => {
    try {
      const response = await fetch(`${API_URL}/payment/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        const errorBody = await response.json();
        console.error("Backend Error Details:", errorBody);
        throw new Error(`Failed to create order (${response.status})`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating order in backend:', error);
      throw error;
    }
  }, [API_URL]);

  const handleRazorpayPayment = async () => {
    if (!validateForm()) {
       alert('Please ensure all required fields are filled correctly.');
       return;
    }

    setIsProcessingPayment(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Failed to load payment gateway script.');

      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: `${formData.countryCode}${formData.mobileNumber}`,
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.pincode}, ${formData.country}`,
        items: cartItems.map(item => ({
          productId: item.id.split('-')[0],
          productName: item.name, size: item.size, quantity: item.quantity, price: item.price
        })),
        subtotal: subtotal, shippingCharge: shippingCharge, totalAmount: total, status: 'pending'
      };

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: Math.round(total * 100), currency: 'INR', name: "Amogham Pindi Vantalu",
        description: 'Order Payment', image: 'https://res.cloudinary.com/duhabjmtf/image/upload/v1760451952/Amogam_Final_bp90ft.png',
        handler: async (response) => {
          try {
            const completedOrderData = {
              ...orderData, status: 'completed', paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id, razorpaySignature: response.razorpay_signature
            };
            const savedOrder = await createOrderInBackend(completedOrderData);
            clearCart();
            navigate('/order-confirmation', { state: { order: savedOrder } });
          } catch (error) {
            alert(`Payment successful but failed to save order: ${error.message}. Please contact support.`);
            setIsProcessingPayment(false);
          }
        },
        prefill: { name: formData.customerName, email: formData.customerEmail, contact: formData.mobileNumber },
        notes: { address: orderData.deliveryAddress }, theme: { color: '#185e20' },
        modal: { ondismiss: () => setIsProcessingPayment(false) }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', async (response) => {
        try {
          const failedOrderData = {
            ...orderData, status: 'failed',
            paymentError: `Code: ${response.error.code}, Desc: ${response.error.description}`
          };
          await createOrderInBackend(failedOrderData);
        } catch (error) { console.error('Error saving failed order:', error); }
        alert(`Payment failed: ${response.error.description}. Please try again.`);
        setIsProcessingPayment(false);
      });
      razorpay.open();

    } catch (error) {
      console.error('Payment Setup/Execution Error:', error);
      alert(`An error occurred: ${error.message}. Please try again.`);
      setIsProcessingPayment(false);
    }
  };

  // --- JSX ---
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

      <div className="cart-page-container">
        <div className="background-shapes">
            <div className="shape1"></div>
            <div className="shape2"></div>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart-container">
            <div className="empty-cart-content">
              <div className="empty-cart-animation">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="50" fill="#f3f4f6" />
                  <path d="M40 45 L50 35 L70 35 L80 45 L75 75 L45 75 Z" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" />
                  <circle cx="50" cy="85" r="5" fill="#6b7280" />
                  <circle cx="70" cy="85" r="5" fill="#6b7280" />
                </svg>
              </div>
              <h1 style={{ fontFamily: 'Domine, serif' }}>Your Cart is Empty</h1>
              <p>Looks like you haven't added anything to your cart yet. Start shopping to fill it up!</p>
              <Link to="/products" className="cta-button primary">
                <span className="material-symbols-outlined">shopping_bag</span>
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="page-header">
              <h1 style={{ fontFamily: 'Domine, serif' }}>Review Your Order</h1>
            </div>

            <div className="cart-layout-grid">
              {/* --- Order Items Card --- */}
              <div className="content-card">
                <div className="card-header">
                    <h2 style={{ fontFamily: 'Lora, serif', fontWeight: '500' }}>Order Items ({getCartItemCount()})</h2>
                </div>
                <div className="items-list">
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item-card">
                      <img src={item.image} alt={item.name} className="item-image" />
                      <div className="item-details">
                        <h3 className="item-name" style={{ fontFamily: 'Domine, serif' }}>{item.name}</h3>
                        <p className="item-price">₹{item.price.toFixed(2)} / {item.size}</p>
                      </div>
                      <div className="item-actions">
                        <div className="quantity-control">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={isProcessingPayment}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={isProcessingPayment}>+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* --- Delivery & Contact Card --- */}
              <div className="content-card">
                <div className="card-header">
                    <h2 style={{ fontFamily: 'Lora, serif', fontWeight: '500' }}>Delivery & Contact</h2>
                </div>
                <div className="form-grid">
                    <div className="input-group full-width">
                      <label htmlFor="customerName">Full Name *</label>
                      <input type="text" id="customerName" name="customerName" value={formData.customerName} onChange={handleInputChange} placeholder="As per government ID" className={errors.customerName ? 'error' : ''} disabled={isProcessingPayment}/>
                      {errors.customerName && <p className="error-message">{errors.customerName}</p>}
                    </div>
                    
                    <div className="input-group full-width">
                      <label htmlFor="customerEmail">Email Address *</label>
                      <input type="email" id="customerEmail" name="customerEmail" value={formData.customerEmail} onChange={handleInputChange} placeholder="For order updates" className={errors.customerEmail ? 'error' : ''} disabled={isProcessingPayment}/>
                      {errors.customerEmail && <p className="error-message">{errors.customerEmail}</p>}
                    </div>

                    <div className="input-group full-width">
                      <label htmlFor="mobileNumber">Mobile Number *</label>
                      <div className="mobile-input-wrapper">
                        <select name="countryCode" value={formData.countryCode} onChange={handleCountryChange} disabled={isProcessingPayment}>
                            {countryData.map(c => <option key={c.code} value={`+${c.phone}`}>{c.flag} +{c.phone}</option>)}
                        </select>
                        <input type="tel" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} placeholder="10 digits for India" className={errors.mobileNumber ? 'error' : ''} disabled={isProcessingPayment} />
                      </div>
                      {errors.mobileNumber && <p className="error-message">{errors.mobileNumber}</p>}
                    </div>

                    <div className="input-group full-width">
                      <label htmlFor="address">Delivery Address *</label>
                      <textarea id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="House No, Street Name, Area..." rows="3" className={errors.address ? 'error' : ''} disabled={isProcessingPayment}></textarea>
                      {errors.address && <p className="error-message">{errors.address}</p>}
                    </div>
                    
                    <div className="input-group">
                      <label htmlFor="pincode">Pincode *</label>
                      <input type="text" id="pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="e.g., 500001" className={errors.pincode ? 'error' : ''} disabled={isProcessingPayment}/>
                      {errors.pincode && <p className="error-message">{errors.pincode}</p>}
                    </div>
                    
                    <div className="input-group">
                      <label htmlFor="city">City *</label>
                      <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g., Siddipet" className={errors.city ? 'error' : ''} disabled={isProcessingPayment}/>
                      {errors.city && <p className="error-message">{errors.city}</p>}
                    </div>
                    
                    <div className="input-group full-width">
                      <label htmlFor="country">Country *</label>
                      <select id="country" name="country" value={formData.country} onChange={handleCountryChange} className={errors.country ? 'error' : ''} disabled={isProcessingPayment}>
                        {countryData.map(c => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
                      </select>
                       {errors.country && <p className="error-message">{errors.country}</p>}
                    </div>
                    
                    
                </div>
              </div>

              {/* --- Order Summary Card --- */}
              <div className="content-card">
                <div className="card-header">
                  <h2 style={{ fontFamily: 'Lora, serif', fontWeight: '500' }}>Order Summary</h2>
                </div>
                <div className="summary-details">
                   <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                   <div className="summary-row"><span>Shipping</span><span className={isSiddipetDelivery ? 'free-shipping' : ''}>{isSiddipetDelivery ? 'FREE' : `₹${shippingCharge.toFixed(2)}`}</span></div>
                   <div className="summary-divider"></div>
                   <div className="summary-row total"><span style={{ fontFamily: 'Domine, serif' }}>Total Amount</span><span style={{ fontFamily: 'Domine, serif' }}>₹{total.toFixed(2)}</span></div>

                  <button
                    onClick={handleRazorpayPayment}
                    disabled={!isFormReadyForPayment || isProcessingPayment}
                    className="cta-button primary payment-btn"
                  >
                    {isProcessingPayment ? (
                      <><span className="spinner"></span> Processing Payment...</>
                    ) : (
                      <><span className="material-symbols-outlined">lock</span> Proceed to Payment</>
                    )}
                  </button>

                  {!isFormReadyForPayment && cartItems.length > 0 &&
                    <p className="validation-prompt guidance">Please fill all required (*) fields to proceed.</p>
                  }

                  <div className="payment-security">
                    <span className="material-symbols-outlined">verified_user</span>
                    <span>Secure payment by Razorpay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .cart-page-container { 
          background-color: #fdf8f0; 
          min-height: 100vh; 
          padding: 2rem 0; 
          position: relative; 
          overflow-x: hidden; 
        }
        
        .container { 
          width: 100%; 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 0 1rem; 
          position: relative; 
          z-index: 2; 
        }
        
        .background-shapes div { 
          position: absolute; 
          border-radius: 50%; 
          z-index: 1; 
          filter: blur(50px); 
        }
        
        .shape1 { 
          width: 400px; 
          height: 400px; 
          background: rgba(255, 213, 79, 0.4); 
          top: 5%; 
          left: -200px; 
          animation: drift 15s infinite alternate; 
        }
        
        .shape2 { 
          width: 300px; 
          height: 300px; 
          background: rgba(214, 40, 40, 0.3); 
          bottom: 5%; 
          right: -150px; 
          animation: drift 20s infinite alternate; 
        }
        
        @keyframes drift { 
          from { transform: translate(0, 0); } 
          to { transform: translate(50px, 50px); } 
        }
        
        .empty-cart-container { 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          min-height: 80vh; 
          text-align: center; 
          padding: 1rem; 
        }
        
        .empty-cart-content { 
          background: rgba(255, 255, 255, 0.6); 
          backdrop-filter: blur(10px); 
          padding: 3rem 2.5rem; 
          border-radius: 1rem; 
          box-shadow: 0 10px 30px -15px rgba(0,0,0,0.1); 
          max-width: 450px; 
          width: 100%; 
        }
        
        .empty-cart-animation { 
          margin-bottom: 2rem; 
          animation: float 3s ease-in-out infinite; 
        }
        
        @keyframes float { 
          0%, 100% { transform: translateY(0px); } 
          50% { transform: translateY(-10px); } 
        }
        
        .empty-cart-content h1 { 
          font-size: 1.75rem; 
          color: #185e20; 
          margin-bottom: 0.75rem; 
        }
        
        .empty-cart-content p { 
          color: #545454; 
          margin-bottom: 2rem; 
          line-height: 1.6; 
        }
        
        .page-header { 
          text-align: center; 
          margin-bottom: 2.5rem; 
        }
        
        .page-header h1 { 
          font-size: 2.5rem; 
          color: #185e20; 
        }
        
        .cta-button { 
          padding: 0.8rem 1.5rem; 
          border-radius: 50px; 
          font-weight: 700; 
          font-size: 1rem; 
          transition: all 0.3s ease; 
          text-decoration: none; 
          font-family: 'Josefin Sans', sans-serif; 
          border: 2px solid transparent; 
          cursor: pointer; 
          display: inline-flex; 
          align-items: center; 
          justify-content: center; 
          gap: 0.5rem; 
          width: 100%; 
          line-height: 1.2; 
        }
        
        .cta-button.primary { 
          background-color: #D62828; 
          color: white; 
        }
        
        .cta-button:disabled { 
          background-color: #ccc; 
          cursor: not-allowed; 
          opacity: 0.7; 
          box-shadow: none; 
          transform: none; 
        }
        
        .cta-button:hover:not(:disabled) { 
          transform: translateY(-2px); 
          box-shadow: 0 4px 12px rgba(214, 40, 40, 0.3); 
        }
        
        .cart-layout-grid { 
          display: flex; 
          flex-direction: column; 
          gap: 2rem; 
          max-width: 800px; 
          margin: 0 auto; 
        }
        
        .content-card { 
          background: rgba(255, 255, 255, 0.6); 
          backdrop-filter: blur(10px); 
          border-radius: 1rem; 
          border: 1px solid rgba(255, 255, 255, 0.2); 
          box-shadow: 0 10px 30px -15px rgba(0,0,0,0.1); 
        }
        
        .card-header { 
          padding: 1.25rem 1.5rem; 
          border-bottom: 1px solid rgba(0,0,0,0.05); 
        }
        
        .card-header h2 { 
          font-size: 1.125rem; 
          color: #185e20; 
          text-align: left; 
          font-weight: 500; 
        }
        
        .items-list { 
          display: flex; 
          flex-direction: column; 
          gap: 1.5rem; 
          padding: 1.5rem; 
        }
        
        .cart-item-card { 
          display: grid; 
          grid-template-columns: auto 1fr auto; 
          gap: 1rem; 
          align-items: center; 
        }
        
        .item-image { 
          width: 60px; 
          height: 60px; 
          object-fit: cover; 
          border-radius: 0.5rem; 
        }
        
        .item-name { 
          font-size: 1.125rem; 
          color: #185e20; 
          font-weight: 700; 
        }
        
        .item-price { 
          color: #545454; 
          font-size: 0.875rem; 
        }
        
        .quantity-control { 
          display: flex; 
          align-items: center; 
          background-color: rgba(0,0,0,0.05); 
          border-radius: 20px; 
        }
        
        .quantity-control span { 
          padding: 0 0.75rem; 
          font-size: 1rem; 
          font-weight: 700; 
          color: #185e20; 
          min-width: 30px; 
          text-align: center;
        }
        
        .quantity-control button { 
          background: none; 
          border: none; 
          font-size: 1.5rem; 
          width: 32px; 
          height: 32px; 
          cursor: pointer; 
          color: #545454; 
          transition: color 0.2s; 
        }
        
        .quantity-control button:hover:not(:disabled) { 
          color: #185e20; 
        }
        
        .quantity-control button:disabled { 
          color: #9ca3af; 
          cursor: not-allowed;
        }
        
        .form-grid { 
          padding: 1.5rem; 
          display: grid; 
          grid-template-columns: 1fr; 
          gap: 1rem; 
        }
        
        .input-group label { 
          display: block; 
          font-family: 'Lora', serif; 
          font-weight: 400; 
          color: #185e20; 
          margin-bottom: 0.5rem; 
          font-size: 0.9rem; 
          text-align: left; 
        }
        
        .input-group input, 
        .input-group textarea, 
        .input-group select { 
          width: 100%; 
          padding: 0.75rem 1rem; 
          border: 1px solid rgba(0,0,0,0.1); 
          border-radius: 0.5rem; 
          font-family: 'Lora', serif; 
          font-size: 1rem; 
          background-color: rgba(255,255,255,0.8); 
          transition: all 0.2s; 
        }
        
        .input-group input:focus, 
        .input-group textarea:focus, 
        .input-group select:focus { 
          border-color: #185e20; 
          outline: none; 
          box-shadow: 0 0 0 2px rgba(24, 94, 32, 0.2); 
        }
        
        .mobile-input-wrapper { 
          display: flex; 
        }
        
        .mobile-input-wrapper select { 
          width: 120px; 
          border-top-right-radius: 0; 
          border-bottom-right-radius: 0; 
          appearance: none; 
          background-image: none; 
          padding-right: 0.5rem;
        }
        
        .mobile-input-wrapper input { 
          border-top-left-radius: 0; 
          border-bottom-left-radius: 0; 
          border-left: none; 
          flex-grow: 1; 
        }
        
        .input-group input.error, 
        .input-group textarea.error, 
        .input-group select.error { 
          border-color: #D62828 !important; 
        }
        
        .error-message { 
          color: #D62828; 
          font-size: 0.875rem; 
          margin-top: 0.5rem; 
          text-align: left; 
        }
        
        .dev-notice {
          grid-column: 1 / -1;
          background-color: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 0.5rem;
          padding: 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        
        .dev-notice .material-symbols-outlined {
          color: #f59e0b;
          font-size: 1.25rem;
          flex-shrink: 0;
        }
        
        .dev-notice p {
          color: #92400e;
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 0;
        }
        
        .dev-notice strong {
          font-weight: 600;
        }
        
        .summary-details { 
          padding: 1.5rem; 
        }
        
        .summary-row { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 1rem; 
          font-size: 1rem; 
          font-family: 'Lora', serif; 
          font-weight: 400; 
        }
        
        .summary-row.total { 
          font-size: 1.25rem; 
          font-weight: 700; 
          color: #185e20; 
        }
        
        .free-shipping { 
          color: #185e20; 
          font-weight: 700; 
        }
        
        .summary-divider { 
          height: 1px; 
          background-color: rgba(0,0,0,0.05); 
          margin: 1.5rem 0; 
        }
        
        .validation-prompt { 
          font-size: 0.875rem; 
          color: #D62828; 
          text-align: center; 
          margin-top: 1rem; 
        }
        
        .validation-prompt.guidance { 
          color: #f59e0b; 
        }
        
        .payment-security { 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 0.5rem; 
          margin-top: 1.5rem; 
          font-size: 0.875rem; 
          color: #545454; 
        }
        
        .payment-security .material-symbols-outlined { 
          font-size: 1.125rem; 
          color: #185e20; 
        }
        
        .spinner { 
          display: inline-block; 
          width: 1em; 
          height: 1em; 
          border: 2px solid rgba(255,255,255,0.3); 
          border-top-color: white; 
          border-radius: 50%; 
          animation: spin 0.8s linear infinite; 
        }
        
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
        
        input:disabled, 
        select:disabled, 
        textarea:disabled { 
          background-color: #e5e7eb !important; 
          cursor: not-allowed; 
          opacity: 0.7; 
          border-color: #d1d5db !important;
        }
        
        @media (min-width: 768px) {
            .form-grid { 
              grid-template-columns: 1fr 1fr; 
            }
            .input-group.full-width { 
              grid-column: 1 / -1; 
            }
            .cart-layout-grid { 
              max-width: 900px; 
            }
        }
        
        @media (min-width: 1024px) {
          .container { 
            padding: 0 2rem; 
          }
          .page-header h1 { 
            font-size: 2.75rem; 
          }
          .cart-layout-grid { 
            max-width: 1000px; 
          }
        }
      `}</style>
    </>
  );
};

export default Cart;