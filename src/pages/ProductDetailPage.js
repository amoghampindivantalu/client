import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Ensure useCart is imported from Products.js
import { useCart } from './Products'; // Assuming Products.js exports useCart

const ProductDetailPage = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  // --- FIX: Get all necessary functions from useCart ---
  const { addToCart, cartItems, updateQuantity, getCartItemCount } = useCart(); // Use cart context

  const [product, setProduct] = useState(null); // State for the fetched product
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0); // Selected size variant

  const API_URL = 'http://localhost:5000/api'; // Backend API endpoint

  // --- FIX: Wrap fetchProduct in useCallback to satisfy exhaustive-deps warning ---
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/products`);
      if (!response.ok) throw new Error(`Network response error: ${response.statusText}`);
      const data = await response.json();
      const foundProduct = Array.isArray(data) ? data.find(p => p.id === id) : null;
      if (foundProduct) {
        foundProduct.stock = parseInt(foundProduct.stock, 10) || 0;
      }
      setProduct(foundProduct);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id, API_URL]); // Dependencies for useCallback

  // Fetch product data when the component mounts or ID changes
  useEffect(() => {
    fetchProduct();
  }, [id, fetchProduct]); // --- FIX: Add fetchProduct to dependency array ---

  // Effect to load necessary fonts
  useEffect(() => {
    const fontLinks = [
      "https://fonts.googleapis.com/css2?family=Marcellus&display=swap",
      "https://fonts.googleapis.com/css2?family=NTR&display=swap",
      "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;700&display=swap",
      "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap"
    ];
    fontLinks.forEach(href => { 
        if (!document.querySelector(`link[href="${href}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        }
     });
  }, []);

  // --- FIX: Hooks are now called at the top level, BEFORE early returns ---
  const stockCount = useMemo(() => product?.stock ?? 0, [product]);
  const isOutOfStock = stockCount <= 0;

  const variants = useMemo(() => {
    if (!product || typeof product.basePrice === 'undefined') return [];
    if (product.unit === '1KG') {
      return [
        { size: '250g', price: product.price250g ?? Math.round(product.basePrice / 4) },
        { size: '500g', price: product.price500g ?? Math.round(product.basePrice / 2) },
        { size: '1KG', price: product.price1kg ?? product.basePrice },
      ];
    }
    return [{ size: product.unit || 'Unit', price: product.basePrice }];
  }, [product]);

  useEffect(() => {
    if (variants.length > 0 && selectedVariantIndex >= variants.length) {
      setSelectedVariantIndex(0);
    }
  }, [variants, selectedVariantIndex]);

  // --- Loading State Display ---
  if (loading) {
    return ( <div className="loading-container"><p>Loading product details...</p></div> );
  }

  // --- Product Not Found State Display ---
  if (!product) {
    return ( <div className="not-found-container"><p>Sorry, product not found.</p><button onClick={() => navigate('/products')}>Back to Products</button></div> );
  }

  // Safely get the current variant, defaulting if needed
  const currentVariant = variants[selectedVariantIndex] || variants[0] || { size: 'N/A', price: 0 };
  const cartItemId = `${product.id}-${currentVariant.size}`;
  const cartItem = cartItems.find(item => item.id === cartItemId);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // --- Cart Action Handlers (with stock checks) ---
  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, currentVariant, 1);
  };

  const handleQuantityChange = (amount) => {
    if (isOutOfStock && amount > 0) return;
    const newQuantity = quantityInCart + amount;
    updateQuantity(cartItemId, newQuantity);
  };

  // --- JSX Rendering ---
  return (
    <div className="detail-page-container">
      <div className="detail-container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <div className="detail-card">
          <div className="product-detail-grid">
            <div className="image-wrapper">
              <img src={product.image} alt={product.name} className="product-detail-image" />
              {isOutOfStock && <div className="stock-badge-overlay">Out of Stock</div>}
            </div>
            <div className="info-wrapper">
              <div>
                <h1 className="product-detail-name">{product.name}</h1>
                <p className="product-detail-telugu">{product.teluguName}</p>
              </div>
              <div>
                <p className="product-description">{product.description}</p>
                <p className="product-telugu-description">{product.teluguDescription}</p>
              </div>
              <div>
                <div className="product-detail-price">
                  ₹{currentVariant.price}
                  <span className="price-unit-detail">/ {currentVariant.size}</span>
                </div>
              </div>
              {variants.length > 1 && (
                <div>
                  <p className="variant-label">Select Size:</p>
                  <div className="variant-buttons-container">
                    {variants.map((variant, index) => (
                      <button
                        key={variant.size}
                        onClick={() => setSelectedVariantIndex(index)}
                        disabled={isOutOfStock}
                        className={`variant-button-detail ${selectedVariantIndex === index ? 'active' : ''}`}
                      >
                        {variant.size} - ₹{variant.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="action-row">
                 {isOutOfStock ? (
                    <div className="out-of-stock-message">Currently Unavailable</div>
                 ) : quantityInCart > 0 ? (
                   <div className="quantity-control-detail">
                     <button onClick={() => handleQuantityChange(-1)} className="quantity-button">−</button>
                     <span className="quantity-display">{quantityInCart}</span>
                     <button onClick={() => handleQuantityChange(1)} className="quantity-button">+</button>
                   </div>
                 ) : (
                   <button onClick={handleAddToCart} className="add-to-cart-button-detail">
                     Add to Cart
                   </button>
                 )}
                 {cartItems.length > 0 && (
                    // --- FIX: Use getCartItemCount from the hook ---
                    <button onClick={() => navigate('/cart')} className="go-to-cart-button">
                        View Cart ({getCartItemCount()})
                    </button>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        /* --- Keep ALL Existing Styles --- */
        .out-of-stock-message { font-size: 1.1rem; font-weight: 600; color: #b91c1c; background-color: #fee2e2; padding: 0.9rem 1.5rem; border-radius: 0.5rem; border: 1px solid #fca5a5; text-align: center; width: 100%; }
        .stock-badge-overlay { position: absolute; top: 1rem; right: 1rem; background-color: rgba(185, 28, 28, 0.85); color: white; padding: 0.4rem 0.8rem; border-radius: 0.375rem; font-size: 0.8rem; font-weight: 600; z-index: 1; }
        .variant-button-detail:disabled { background-color: #e5e7eb; border-color: #d1d5db; color: #9ca3af; cursor: not-allowed; }
        .detail-page-container { background-color: #fdf8f0; min-height: 100vh; padding: 2rem 1rem; font-family: 'Josefin Sans', sans-serif;}
        .detail-container { max-width: 1100px; margin: 0 auto; }
        .loading-container, .not-found-container { min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #fdf8f0; text-align: center;}
        .loading-container p, .not-found-container p { font-size: 1.25rem; color: #6b7280; margin-bottom: 1rem; }
        .not-found-container button { padding: 0.75rem 1.5rem; background-color: #185e20; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem; font-family: 'Josefin Sans', sans-serif; font-weight: 700; }
        .back-button { padding: 0.5rem 1rem; background-color: transparent; color: #185e20; border: 2px solid #185e20; border-radius: 0.5rem; cursor: pointer; font-size: 0.875rem; font-family: 'Josefin Sans', sans-serif; font-weight: 700; margin-bottom: 2rem; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s; }
        .back-button:hover { background-color: #e8f5e9; }
        .detail-card { background-color: white; border-radius: 1rem; box-shadow: 0 4px 20px -15px rgba(0,0,0,0.1); overflow: hidden; }
        .product-detail-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; padding: 2rem; }
        .image-wrapper { display: flex; justify-content: center; align-items: center; position: relative; }
        .product-detail-image { width: 100%; max-width: 450px; height: auto; border-radius: 0.75rem; object-fit: cover; border: 1px solid #eee; }
        .info-wrapper { display: flex; flex-direction: column; gap: 1.5rem; justify-content: center; }
        .product-detail-name { font-size: 2.25rem; font-weight: 700; color: #185e20; margin-bottom: 0.25rem; font-family: 'Marcellus', serif; line-height: 1.2; }
        .product-detail-telugu { font-size: 1.8rem; color: #D62828; font-family: 'NTR', sans-serif; line-height: 1.2; margin-bottom: 1rem; }
        .product-description { font-size: 1rem; color: #374151; line-height: 1.7; margin-bottom: 0.5rem; font-family: 'Lora', serif; }
        .product-telugu-description { font-size: 1rem; color: #545454; line-height: 1.7; font-family: 'NTR', sans-serif; }
        .product-detail-price { font-size: 2.5rem; font-weight: 700; color: #D62828; font-family: 'Josefin Sans', sans-serif; }
        .price-unit-detail { font-size: 1.1rem; color: #6b7280; font-weight: 400; margin-left: 0.5rem; }
        .variant-label { font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.75rem; }
        .variant-buttons-container { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .variant-button-detail { padding: 0.75rem 1.25rem; border: 2px solid #ddd; border-radius: 0.5rem; background-color: #f9f9f9; color: #374151; cursor: pointer; font-size: 0.9rem; font-weight: 600; font-family: 'Josefin Sans', sans-serif; transition: all 0.2s; }
        .variant-button-detail.active { border-color: #185e20; background-color: #185e20; color: white; }
        .action-row { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-top: 1.5rem; }
        .quantity-control-detail { display: flex; align-items: center; gap: 0.5rem; background-color: #D62828; border-radius: 0.5rem; padding: 0.25rem; }
        .quantity-button { background-color: transparent; border: none; color: white; font-size: 1.75rem; cursor: pointer; font-weight: 400; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; line-height: 1; }
        .quantity-display { color: white; font-size: 1.25rem; font-weight: 700; font-family: 'Josefin Sans', sans-serif; min-width: 40px; text-align: center; }
        .add-to-cart-button-detail { padding: 0.9rem 1.8rem; background-color: #D62828; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem; font-weight: 700; font-family: 'Josefin Sans', sans-serif; transition: background-color 0.2s; }
        .add-to-cart-button-detail:hover { background-color: #b82222; }
        .go-to-cart-button { padding: 0.9rem 1.8rem; background-color: #185e20; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem; font-weight: 700; font-family: 'Josefin Sans', sans-serif; transition: background-color 0.2s; }
        .go-to-cart-button:hover { background-color: #104216; }

        @media (min-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr 1fr !important; gap: 3rem; padding: 3rem; }
          .product-detail-name { font-size: 2.75rem; }
          .product-detail-telugu { font-size: 2.25rem; }
          .product-detail-price { font-size: 3rem; }
        }
      `}</style>
    </div>
  );
};

export default ProductDetailPage;