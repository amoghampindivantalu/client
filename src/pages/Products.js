import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Cart Context Setup ---
// Create a context to hold cart data and functions
export const CartContext = React.createContext();

// Provider component that wraps parts of the app needing cart access
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Function to add an item to the cart
  const addToCart = (product, variant, quantity) => {
    // Create a unique ID for the cart item based on product ID and variant size
    const cartItemId = `${product.id}-${variant.size}`;
    const cartItem = {
      id: cartItemId,
      productId: product.id,
      name: product.name,
      image: product.image,
      size: variant.size,
      price: variant.price,
      quantity
    };

    setCartItems(prev => {
      const existing = prev.find(item => item.id === cartItem.id);
      if (existing) {
        return prev.map(item =>
          item.id === cartItem.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, cartItem];
    });
  };

  // Function to remove an item completely from the cart
  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Function to update the quantity of an item in the cart
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(prev =>
        prev.map(item => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  // Function to calculate the total number of items in the cart
  const getCartItemCount = () => cartItems.reduce((total, item) => total + item.quantity, 0);

  // Function to calculate the total price of all items in the cart
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Function to clear all items from the cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartItemCount,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to easily consume the CartContext
export const useCart = () => useContext(CartContext);

// --- Product Card Component ---
const ProductCard = ({ product }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const { addToCart, cartItems, updateQuantity } = useCart();
  const navigate = useNavigate();

  // Ensure product.stock is treated as a number and check if out of stock
  const stockCount = useMemo(() => parseInt(product.stock, 10) || 0, [product.stock]);
  const isOutOfStock = stockCount <= 0;

  // Memoize variants calculation
  const variants = useMemo(() => {
    if (product.unit === '1KG') {
      return [
        { size: '250g', price: product.price250g || Math.round(product.basePrice / 4) },
        { size: '500g', price: product.price500g || Math.round(product.basePrice / 2) },
        { size: '1KG', price: product.price1kg || product.basePrice },
      ];
    }
    return [{ size: product.unit || 'Unit', price: product.basePrice }];
  }, [product]);

  const currentVariant = variants[selectedVariantIndex];
  const cartItemId = `${product.id}-${currentVariant.size}`;
  const cartItem = cartItems.find(item => item.id === cartItemId);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, currentVariant, 1);
  };

  const handleQuantityChange = (e, amount) => {
    e.stopPropagation();
    if (isOutOfStock && amount > 0) return;
    updateQuantity(cartItemId, quantityInCart + amount);
  };

  const handleCardClick = () => {
    if (!isOutOfStock) {
      navigate(`/products/${product.id}`);
    }
  };

  return (
    <div
      className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}
      onClick={handleCardClick}
      style={{ cursor: isOutOfStock ? 'default' : 'pointer' }}
      title={isOutOfStock ? `${product.name} is currently out of stock` : `View ${product.name}`}
    >
      {quantityInCart > 0 && !isOutOfStock && (
        <div className="cart-badge-indicator">{quantityInCart}</div>
      )}
      {isOutOfStock && <div className="stock-overlay">Out of Stock</div>}

      <div className="product-info">
        <div className="text-content">
          <h3 className="product-name" style={{ fontFamily: 'Marcellus, serif' }}>
            {product.name}
          </h3>
          {product.teluguName && (
            <p className="product-telugu-name" style={{ fontFamily: 'NTR, Hind Vadodara, sans-serif' }}>
              {product.teluguName}
            </p>
          )}
          <div className="price-display">
            <span className="price-amount">₹{currentVariant.price}</span>
            <span className="price-unit">/ {currentVariant.size}</span>
          </div>
        </div>
        <div className="image-container">
          <img src={product.image} alt={product.name} className="product-image" />
        </div>
      </div>

      <div className="product-actions">
        {variants.length > 1 && (
          <div className="variant-selector">
            {variants.map((variant, index) => (
              <button
                key={variant.size}
                onClick={(e) => { e.stopPropagation(); setSelectedVariantIndex(index); }}
                className={`variant-button ${selectedVariantIndex === index ? 'active' : ''}`}
                disabled={isOutOfStock}
              >
                {variant.size}
              </button>
            ))}
          </div>
        )}
        <div className="add-to-cart-container">
          {isOutOfStock ? (
            <button className="add-to-cart-button disabled-stock" disabled>Out of Stock</button>
          ) : quantityInCart > 0 ? (
            <div className="quantity-control">
              <button onClick={(e) => handleQuantityChange(e, -1)}>−</button>
              <span>{quantityInCart}</span>
              <button onClick={(e) => handleQuantityChange(e, 1)}>+</button>
            </div>
          ) : (
            <button className="add-to-cart-button" onClick={handleAddToCart}>Add</button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Products Page Component ---
export const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('Sweets');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

const API_URL = process.env.REACT_APP_API_URL || 'https://server-4qyb.onrender.com/api';

  // Effect to load fonts and fetch initial product data
  useEffect(() => {
    // Dynamically load Google Fonts
    const fontLinks = [
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined",
      "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;700&display=swap",
      "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap",
      "https://fonts.googleapis.com/css2?family=Marcellus&display=swap",
      "https://fonts.googleapis.com/css2?family=NTR&display=swap",
      "https://fonts.googleapis.com/css2?family=Hind+Vadodara&display=swap"
    ];
    
    fontLinks.forEach(href => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    });

    // Wait for fonts to load before fetching products
    if (document.fonts) {
      document.fonts.ready.then(() => {
        fetchProducts();
      });
    } else {
      setTimeout(fetchProducts, 1000);
    }
  }, []);

  // Function to fetch products from the backend API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Ensure stock is a number for all products
      const formattedProducts = (Array.isArray(data) ? data : []).map(p => ({
        ...p,
        stock: parseInt(p.stock, 10) || 0
      }));
      
      console.log('===== DEBUG INFO =====');
      console.log('Total products fetched:', formattedProducts.length);
      console.log('First product:', formattedProducts[0]);
      console.log('Telugu name exists?', formattedProducts[0]?.teluguName);
      console.log('All fields in first product:', Object.keys(formattedProducts[0] || {}));
      console.log('Products with Telugu names:', formattedProducts.filter(p => p.teluguName).length);
      console.log('======================');
      
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Sweets', 'Snacks', 'Spice Powders', 'Pickles'];
  const filteredProducts = useMemo(
    () => products.filter(p => p.category === selectedCategory),
    [products, selectedCategory]
  );

  return (
    <div className="products-page-container">
      <div className="container">
        <div className="page-header">
          <h1 style={{ fontFamily: 'Marcellus, serif' }}>Our Delicacies</h1>
          <p style={{ fontFamily: 'Lora, serif' }}>
            Authentic traditional foods made with love and time-honored recipes.
          </p>
        </div>

        <div className="category-filters">
          <div className="category-grid">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading delicacies...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>No products found in this category yet.</p>
          </div>
        ) : (
          <div className="products-list">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; }
        
        .products-page-container {
          background-color: #fdf8f0;
          min-height: 100vh;
          overflow-x: hidden;
        }
        
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .page-header h1 {
          font-size: 2.5rem;
          color: #185e20;
          margin-bottom: 0.5rem;
        }
        
        .page-header p {
          font-size: 1.125rem;
          color: #545454;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .category-filters {
          margin-bottom: 2rem;
        }
        
        .category-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .filter-button {
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-family: 'Josefin Sans', sans-serif;
          border: 2px solid #185e20;
          background-color: transparent;
          color: #185e20;
          cursor: pointer;
        }
        
        .filter-button.active,
        .filter-button:hover {
          background-color: #185e20;
          color: white;
        }
        
        .products-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        
        .loading-state,
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #6b7280;
          font-size: 1.125rem;
        }
        
        .product-card {
          background-color: white;
          border-radius: 1rem;
          box-shadow: 0 4px 20px -15px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
          position: relative;
        }
        
        .product-card:hover:not(.out-of-stock) {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.15);
        }
        
        .product-card.out-of-stock {
          opacity: 0.6;
          pointer-events: none;
          cursor: default !important;
        }
        
        .cart-badge-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 2;
          background-color: #D62828;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
        }
        
        .stock-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          font-weight: 700;
          color: #b91c1c;
          z-index: 3;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          pointer-events: none;
        }
        
        .product-info {
          display: flex;
          justify-content: space-between;
          padding: 1rem;
        }
        
        .text-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .image-container {
          width: 100px;
          height: 100px;
          border-radius: 0.5rem;
          overflow: hidden;
          flex-shrink: 0;
          margin-left: 1rem;
        }
        
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .product-name {
          font-size: 1.125rem;
          color: #185e20;
          font-weight: 700;
          line-height: 1.2;
        }
        
        .product-telugu-name {
          font-size: 1.5rem;
          color: #D62828;
          margin-bottom: 0.5rem;
          line-height: 1;
          margin-top: 0.25rem;
          font-feature-settings: "kern" 1;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .price-display {
          margin-top: auto;
        }
        
        .price-amount {
          font-size: 1.125rem;
          font-weight: 700;
          color: #D62828;
        }
        
        .price-unit {
          font-size: 0.75rem;
          color: #545454;
        }
        
        .product-actions {
          border-top: 1px solid #f0f0f0;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .variant-selector {
          display: flex;
          gap: 0.5rem;
        }
        
        .variant-button {
          padding: 0.4rem 0.75rem;
          font-size: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 20px;
          background-color: #f9f9f9;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .variant-button.active {
          background-color: #185e20;
          color: white;
          border-color: #185e20;
        }
        
        .variant-button:disabled {
          background-color: #e5e7eb;
          border-color: #d1d5db;
          color: #9ca3af;
          cursor: not-allowed;
        }
        
        .add-to-cart-container {
          width: 90px;
        }
        
        .add-to-cart-button,
        .quantity-control {
          background-color: #D62828;
          color: white;
          font-family: 'Josefin Sans', sans-serif;
          border: none;
          border-radius: 20px;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 36px;
        }
        
        .add-to-cart-button {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          width: 100%;
        }
        
        .add-to-cart-button:hover:not(:disabled) {
          background-color: #b82222;
        }
        
        .add-to-cart-button.disabled-stock {
          background-color: #9ca3af;
          color: #4b5563;
          cursor: not-allowed;
          font-weight: 500;
        }
        
        .add-to-cart-button.disabled-stock:hover {
          background-color: #9ca3af;
        }
        
        .quantity-control {
          justify-content: space-between;
          width: 100%;
        }
        
        .quantity-control span {
          font-size: 0.875rem;
          min-width: 25px;
          text-align: center;
        }
        
        .quantity-control button {
          background: none;
          border: none;
          color: white;
          font-size: 1.25rem;
          width: 30px;
          height: 30px;
          cursor: pointer;
        }
        
        @media (min-width: 768px) {
          .container {
            padding: 2rem;
          }
          
          .page-header h1 {
            font-size: 2.75rem;
          }
          
          .category-grid {
            display: flex;
            justify-content: center;
          }
          
          .products-list {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
        }
        
        @media (min-width: 1024px) {
          .products-list {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};