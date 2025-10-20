import React, { useState, useEffect, useMemo, useContext } from 'react'; // Added useMemo, useContext
import { useNavigate } from 'react-router-dom';

// --- Cart Context Setup ---
// Create a context to hold cart data and functions
export const CartContext = React.createContext();

// Provider component that wraps parts of the app needing cart access
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from local storage on initial load
    try {
      const savedCart = localStorage.getItem('shoppingCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Failed to load cart from local storage", e);
      return [];
    }
  });

  // Save cart to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to local storage", e);
    }
  }, [cartItems]);

  // Function to add an item to the cart
  const addToCart = (product, variant, quantity) => {
    // Create a unique ID for the cart item based on product ID and variant size
    const cartItemId = `${product.id}-${variant.size}`;
    const cartItem = {
      id: cartItemId,
      productId: product.id, // Store original product ID for reference
      name: product.name,
      image: product.image,
      size: variant.size,
      price: variant.price,
      quantity
    };

    setCartItems(prev => {
      const existing = prev.find(item => item.id === cartItem.id);
      if (existing) {
        // If item exists, update its quantity
        return prev.map(item =>
          item.id === cartItem.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      // If item doesn't exist, add it to the cart array
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
      // If quantity drops to 0 or less, remove the item
      removeFromCart(itemId);
    } else {
      // Otherwise, update the quantity of the specific item
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

  // Provide cart state and functions to consuming components
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
// Displays a single product on the products listing page
const ProductCard = ({ product }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0); // State for chosen variant (250g, 500g, 1KG)
  const { addToCart, cartItems, updateQuantity } = useCart(); // Get cart functions from context
  const navigate = useNavigate(); // Hook for navigation

  // --- Ensure product.stock is treated as a number and check if out of stock ---
  const stockCount = useMemo(() => parseInt(product.stock, 10) || 0, [product.stock]);
  const isOutOfStock = stockCount <= 0;

  // Memoize variants calculation to avoid recomputing on every render
  const variants = useMemo(() => {
    // If unit is '1KG', create standard weight variants
    if (product.unit === '1KG') {
      return [
        { size: '250g', price: product.price250g || Math.round(product.basePrice / 4) },
        { size: '500g', price: product.price500g || Math.round(product.basePrice / 2) },
        { size: '1KG', price: product.price1kg || product.basePrice },
      ];
    }
    // Otherwise, use the product's base unit and price
    return [{ size: product.unit || 'Unit', price: product.basePrice }];
  }, [product]);

  // Get the currently selected variant based on the index
  const currentVariant = variants[selectedVariantIndex];
  // Create the unique ID for this product variant in the cart
  const cartItemId = `${product.id}-${currentVariant.size}`;
  // Find if this specific item variant is already in the cart
  const cartItem = cartItems.find(item => item.id === cartItemId);
  // Determine the quantity currently in the cart (0 if not present)
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // Handler to add the item to the cart (stops propagation to prevent card click)
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigating to detail page when clicking button
    if (isOutOfStock) return; // Do nothing if out of stock
    addToCart(product, currentVariant, 1); // Add 1 unit of the selected variant
  };

  // Handler to change quantity (stops propagation)
  const handleQuantityChange = (e, amount) => {
    e.stopPropagation(); // Prevent navigating to detail page
    if (isOutOfStock && amount > 0) return; // Prevent increasing if out of stock
    updateQuantity(cartItemId, quantityInCart + amount); // Update quantity via context
  };

  // Handler for clicking the main card (navigates only if in stock)
  const handleCardClick = () => {
    if (!isOutOfStock) {
      navigate(`/products/${product.id}`);
    }
  };

  return (
    // Add 'out-of-stock' class for styling and adjust cursor
    <div
      className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}
      onClick={handleCardClick}
      style={{ cursor: isOutOfStock ? 'default' : 'pointer' }}
      title={isOutOfStock ? `${product.name} is currently out of stock` : `View ${product.name}`}
    >
      {/* Show quantity badge only if in cart AND in stock */}
      {quantityInCart > 0 && !isOutOfStock && (
        <div className="cart-badge-indicator">{quantityInCart}</div>
      )}
      {/* Show "Out of Stock" overlay if applicable */}
      {isOutOfStock && <div className="stock-overlay">Out of Stock</div>}

      {/* Product Information Section (Name, Telugu Name, Price) */}
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

      {/* Product Actions Section (Variants, Add/Quantity buttons) */}
      <div className="product-actions">
        {/* Variant Selector (if more than one variant exists) */}
        {variants.length > 1 && (
          <div className="variant-selector">
            {variants.map((variant, index) => (
              <button
                key={variant.size}
                // Stop propagation on variant button click
                onClick={(e) => { e.stopPropagation(); setSelectedVariantIndex(index); }}
                className={`variant-button ${selectedVariantIndex === index ? 'active' : ''}`}
                disabled={isOutOfStock} // Disable buttons if out of stock
              >
                {variant.size}
              </button>
            ))}
          </div>
        )}
        {/* Add to Cart / Quantity Control Container */}
        <div className="add-to-cart-container">
            {/* Show "Out of Stock" button if applicable */}
            {isOutOfStock ? (
              <button className="add-to-cart-button disabled-stock" disabled>Out of Stock</button>
            // Show Quantity controls if item is already in cart
            ) : quantityInCart > 0 ? (
             <div className="quantity-control">
                <button onClick={(e) => handleQuantityChange(e, -1)}>−</button>
                <span>{quantityInCart}</span>
                <button onClick={(e) => handleQuantityChange(e, 1)}>+</button>
            </div>
            // Show "Add" button if item is not in cart
            ) : (
              <button className="add-to-cart-button" onClick={handleAddToCart}>Add</button>
            )}
        </div>
      </div>
    </div>
  );
};

// --- Main Products Page Component ---
// Fetches products and displays them using ProductCard components
export const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('Sweets'); // State for the active category filter
  const [products, setProducts] = useState([]); // State to hold fetched products
  const [loading, setLoading] = useState(true); // State to track loading status

  const API_URL = 'http://localhost:5000/api'; // Backend API endpoint

  // Effect to load fonts and fetch initial product data
  useEffect(() => {
    // Dynamically load Google Fonts if not already present
    const fontLinks = [
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined",
      "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;700&display=swap",
      "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap",
      "https://fonts.googleapis.com/css2?family=Marcellus&display=swap",
      "https://fonts.googleapis.com/css2?family=NTR&display=swap"
    ];
    fontLinks.forEach(href => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    });

    // Fetch products when the component mounts
    fetchProducts();
  }, []); // Empty dependency array ensures this runs only once

  // Function to fetch products from the backend API
  const fetchProducts = async () => {
    try {
      setLoading(true); // Start loading indicator
      // Fetch from the endpoint that provides all products (ensure this endpoint exists and returns stock)
      const response = await fetch(`${API_URL}/admin/products`); // Using admin route for now
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Ensure stock is a number for all products
       const formattedProducts = (Array.isArray(data) ? data : []).map(p => ({
            ...p,
            stock: parseInt(p.stock, 10) || 0 // Default to 0 if parsing fails
        }));
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Clear products on error
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Define available product categories
  const categories = ['Sweets', 'Snacks', 'Spice Powders', 'Pickles'];
  // Filter the fetched products based on the selected category
  const filteredProducts = useMemo(() => products.filter(p => p.category === selectedCategory), [products, selectedCategory]);

  return (
    <div className="products-page-container">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 style={{ fontFamily: 'Marcellus, serif' }}>Our Delicacies</h1>
          <p style={{ fontFamily: 'Lora, serif' }}>Authentic traditional foods made with love and time-honored recipes.</p>
        </div>
        {/* Category Filter Buttons */}
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

        {/* Conditional Rendering: Loading, Empty, or Product List */}
        {loading ? (
          <div className="loading-state"> <p>Loading delicacies...</p> </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state"> <p>No products found in this category yet.</p> </div>
        ) : (
          <div className="products-list">
            {/* Map over filtered products and render a ProductCard for each */}
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      {/* Embedded Styles */}
      <style>{`
        /* --- Keep ALL Existing Styles for Products Page --- */
        /* --- Add/Update Styles for Out of Stock --- */
        .product-card.out-of-stock { opacity: 0.6; pointer-events: none; /* Make card non-interactive */ cursor: default !important; /* Override pointer cursor */ }
        .add-to-cart-button.disabled-stock { background-color: #9ca3af; color: #4b5563; cursor: not-allowed; font-weight: 500;}
        .add-to-cart-button.disabled-stock:hover { background-color: #9ca3af; } /* Prevent hover effect */
        .stock-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255, 255, 255, 0.7); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 700; color: #b91c1c; z-index: 3; text-transform: uppercase; letter-spacing: 0.05em; pointer-events: none; }

        /* --- Existing Styles (Ensure these are present) --- */
         * { box-sizing: border-box; } .products-page-container { background-color: #fdf8f0; min-height: 100vh; overflow-x: hidden; } .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; } .page-header { text-align: center; margin-bottom: 2rem; } .page-header h1 { font-size: 2.5rem; color: #185e20; margin-bottom: 0.5rem; } .page-header p { font-size: 1.125rem; color: #545454; max-width: 600px; margin: 0 auto; } .category-filters { margin-bottom: 2rem; } .category-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; max-width: 500px; margin: 0 auto; } .filter-button { padding: 0.75rem; border-radius: 0.5rem; font-weight: 700; font-size: 1rem; transition: all 0.3s ease; font-family: 'Josefin Sans', sans-serif; border: 2px solid #185e20; background-color: transparent; color: #185e20; cursor: pointer; } .filter-button.active, .filter-button:hover { background-color: #185e20; color: white; } .products-list { display: grid; grid-template-columns: 1fr; gap: 1rem; } .loading-state, .empty-state { text-align: center; padding: 4rem 2rem; color: #6b7280; font-size: 1.125rem; } .product-card { background-color: white; border-radius: 1rem; box-shadow: 0 4px 20px -15px rgba(0,0,0,0.1); overflow: hidden; /* cursor: pointer; REMOVED - handled inline */ transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease; position: relative; } .product-card:hover:not(.out-of-stock) { transform: translateY(-5px); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.15); } .cart-badge-indicator { position: absolute; top: 10px; right: 10px; z-index: 2; background-color: #D62828; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; } .product-info { display: flex; justify-content: space-between; padding: 1rem; } .text-content { flex: 1; display: flex; flex-direction: column; } .image-container { width: 100px; height: 100px; border-radius: 0.5rem; overflow: hidden; flex-shrink: 0; margin-left: 1rem; } .product-image { width: 100%; height: 100%; object-fit: cover; } .product-name { font-size: 1.125rem; color: #185e20; font-weight: 700; line-height: 1.2; } .product-telugu-name { font-size: 1.5rem; color: #D62828; margin-bottom: 0.5rem; line-height: 1; margin-top: 0.25rem; } .price-display { margin-top: auto; } .price-amount { font-size: 1.125rem; font-weight: 700; color: #D62828; } .price-unit { font-size: 0.75rem; color: #545454; } .product-actions { border-top: 1px solid #f0f0f0; padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between; } .variant-selector { display: flex; gap: 0.5rem; } .variant-button { padding: 0.4rem 0.75rem; font-size: 0.75rem; border: 1px solid #ddd; border-radius: 20px; background-color: #f9f9f9; cursor: pointer; transition: all 0.2s; } .variant-button.active { background-color: #185e20; color: white; border-color: #185e20; } .variant-button:disabled { background-color: #e5e7eb; border-color: #d1d5db; color: #9ca3af; cursor: not-allowed; } .add-to-cart-container { width: 90px; } .add-to-cart-button, .quantity-control { background-color: #D62828; color: white; font-family: 'Josefin Sans', sans-serif; border: none; border-radius: 20px; font-weight: 700; cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; justify-content: center; height: 36px; } .add-to-cart-button { padding: 0.5rem 1rem; font-size: 0.875rem; width: 100%; } .add-to-cart-button:hover:not(:disabled) { background-color: #b82222; } .quantity-control { justify-content: space-between; width: 100%; } .quantity-control span { font-size: 0.875rem; min-width: 25px; text-align: center;} .quantity-control button { background: none; border: none; color: white; font-size: 1.25rem; width: 30px; height: 30px; cursor: pointer; }
         /* Media Queries */
        @media (min-width: 768px) { .container { padding: 2rem; } .page-header h1 { font-size: 2.75rem; } .category-grid { display: flex; justify-content: center; } .products-list { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; } }
        @media (min-width: 1024px) { .products-list { grid-template-columns: repeat(3, 1fr); gap: 1.5rem;} }
      `}</style>
    </div>
  );
};