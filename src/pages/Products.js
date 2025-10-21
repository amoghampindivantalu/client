import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Cart Context Setup ---
export const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('shoppingCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Failed to load cart from local storage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to local storage", e);
    }
  }, [cartItems]);

  const addToCart = (product, variant, quantity) => {
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

  const removeFromCart = (itemId) => setCartItems(prev => prev.filter(item => item.id !== itemId));

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) removeFromCart(itemId);
    else {
      setCartItems(prev =>
        prev.map(item => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  const getCartItemCount = () => cartItems.reduce((total, item) => total + item.quantity, 0);
  const getCartTotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const clearCart = () => setCartItems([]);

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

export const useCart = () => useContext(CartContext);

const ProductCard = ({ product }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const { addToCart, cartItems, updateQuantity } = useCart();
  const navigate = useNavigate();

  const stockCount = useMemo(() => parseInt(product.stock, 10) || 0, [product.stock]);
  const isOutOfStock = stockCount <= 0;

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
    if (!isOutOfStock) addToCart(product, currentVariant, 1);
  };

  const handleQuantityChange = (e, amount) => {
    e.stopPropagation();
    if (isOutOfStock && amount > 0) return;
    updateQuantity(cartItemId, quantityInCart + amount);
  };

  const handleCardClick = () => {
    if (!isOutOfStock) navigate(`/products/${product.id}`);
  };

  return (
    <div
      className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}
      onClick={handleCardClick}
      style={{ cursor: isOutOfStock ? 'default' : 'pointer' }}
      title={isOutOfStock ? `${product.name} is currently out of stock` : `View ${product.name}`}
    >
      {quantityInCart > 0 && !isOutOfStock && <div className="cart-badge-indicator">{quantityInCart}</div>}
      {isOutOfStock && <div className="stock-overlay">Out of Stock</div>}

      <div className="product-info">
        <div className="text-content">
          <h3 className="product-name" style={{ fontFamily: 'Marcellus, serif' }}>{product.name}</h3>
          <p className="product-telugu-name" style={{ fontFamily: 'NTR, sans-serif' }}>{product.teluguName}</p>
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

export const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('Sweets');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Automatically switch API between local + production
  const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://server-4qyb.onrender.com/api'
    : 'http://localhost:5000/api';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/products`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const formatted = (Array.isArray(data) ? data : []).map(p => ({
        ...p,
        stock: parseInt(p.stock, 10) || 0
      }));
      setProducts(formatted);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Sweets', 'Snacks', 'Spice Powders', 'Pickles'];
  const filteredProducts = useMemo(() => products.filter(p => p.category === selectedCategory), [products, selectedCategory]);

  return (
    <div className="products-page-container">
      <div className="container">
        <div className="page-header">
          <h1 style={{ fontFamily: 'Marcellus, serif' }}>Our Delicacies</h1>
          <p style={{ fontFamily: 'Lora, serif' }}>Authentic traditional foods made with love and time-honored recipes.</p>
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
          <div className="loading-state"><p>Loading delicacies...</p></div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state"><p>No products found in this category yet.</p></div>
        ) : (
          <div className="products-list">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
