import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Package, ShoppingCart, Plus, Edit2, Trash2, X, DollarSign, FileDown, AlertCircle, RefreshCw, ChevronDown, ChevronUp, XCircle, Info } from 'lucide-react';

// Dialog Component
const Dialog = ({ message, type, onConfirm, onCancel, isConfirm }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (onCancel) onCancel();
        else if (!isConfirm) onConfirm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onConfirm, onCancel, isConfirm]);

  if (!message) return null;

  const colors = {
    success: { bg: 'bg-green-100', text: 'text-green-800', button: 'bg-green-600', hoverButton: 'hover:bg-green-700' },
    error: { bg: 'bg-red-100', text: 'text-red-800', button: 'bg-red-600', hoverButton: 'hover:bg-red-700' },
    confirm: { bg: 'bg-yellow-100', text: 'text-yellow-800', button: 'bg-red-600', hoverButton: 'hover:bg-red-700' }
  };
  const theme = colors[type] || colors['confirm'];

  return (
    <div className="modal-overlay" style={{ zIndex: 1001 }} onClick={onCancel || onConfirm}>
      <div className="dialog-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`dialog-icon ${theme.bg}`}>
          <AlertCircle className={theme.text} size={32} />
        </div>
        <h3 className="dialog-title">
          {isConfirm ? 'Confirmation Required' : (type === 'success' ? 'Operation Successful' : 'An Error Occurred')}
        </h3>
        <p className="dialog-message">{message}</p>
        <div className="dialog-actions">
          {isConfirm ? (
            <>
              <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
              <button onClick={onConfirm} className={`btn ${theme.button} ${theme.hoverButton}`}>Confirm</button>
            </>
          ) : (
            <button onClick={onConfirm} className={`btn ${theme.button} ${theme.hoverButton}`}>OK</button>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('newOrders');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [dialog, setDialog] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [previousOrderCount, setPreviousOrderCount] = useState(0);
  const [hasNewOrders, setHasNewOrders] = useState(false);
  
  const refreshIntervalRef = useRef(null);
  const audioRef = useRef(null);

  const [formData, setFormData] = useState({
    id: '', name: '', teluguName: '', description: '', teluguDescription: '',
    category: 'Sweets', basePrice: '', price250g: '', price500g: '', price1kg: '',
    unit: '1KG', image: '', stock: 100
  });

  const API_URL = process.env.REACT_APP_API_URL;
  const categories = ['Sweets', 'Snacks', 'Spice Powders', 'Pickles'];
  const orderStatuses = ['pending', 'completed', 'shipped', 'delivered', 'cancelled', 'failed'];
  const LOW_STOCK_THRESHOLD = 5;
  const AUTO_REFRESH_INTERVAL = 10000;

  useEffect(() => {
    handleRefresh(false);
    refreshIntervalRef.current = setInterval(() => {
        handleRefresh(false);
    }, AUTO_REFRESH_INTERVAL);
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (previousOrderCount > 0 && orders.length > previousOrderCount) {
      const newPendingOrders = orders.filter(o => o.status === 'pending');
      if (newPendingOrders.length > 0) {
        playNewOrderSound();
        setHasNewOrders(true);
        setTimeout(() => setHasNewOrders(false), 3000);
      }
    }
    setPreviousOrderCount(orders.length);
  }, [orders]);

  const showDialog = (message, type = 'success', onConfirm = () => {}, onCancel = null, isConfirm = false) => {
    const confirmAction = () => { setDialog({}); onConfirm(); };
    const cancelAction = () => { setDialog({}); if(onCancel) onCancel(); };
    setDialog({ message, type, onConfirm: confirmAction, onCancel: cancelAction, isConfirm });
  };

  const playNewOrderSound = () => {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          console.log('Audio playback failed (user interaction may be required):', error);
        });
      }
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  const handleRefresh = async (showSuccessDialog = true) => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setSearchTerm('');
    setOrderSearchTerm('');
    try {
      await Promise.all([fetchProducts(), fetchOrders()]);
      if (showSuccessDialog) {
          showDialog('Dashboard data refreshed successfully!', 'success');
      }
    } catch (e) {
      if (showSuccessDialog) {
          showDialog('Failed to refresh data. Check console for details.', 'error');
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchProducts = async () => {
     try {
        const response = await fetch(`${API_URL}/admin/products`);
        if (!response.ok) throw new Error(`HTTP error fetching products: ${response.status}`);
        const data = await response.json();
        const formattedProducts = (Array.isArray(data) ? data : []).map(p => ({
            ...p,
            stock: parseInt(p.stock, 10) || 0
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
  };

  const fetchOrders = async () => {
     try {
        const response = await fetch(`${API_URL}/payment/orders`);
        if (!response.ok) throw new Error(`HTTP error fetching orders: ${response.status}`);
        const data = await response.json();
        setOrders((Array.isArray(data) ? data : []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const originalOrder = orders.find(o => o.id === orderId);
    if (!originalOrder) return;

    setOrders(prevOrders => prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
    ));

    try {
      const response = await fetch(`${API_URL}/payment/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const updatedOrderData = await response.json();
      if (!response.ok) {
        throw new Error(updatedOrderData.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      showDialog(`Failed to update status: ${error.message}`, 'error');
      setOrders(prevOrders => prevOrders.map(order =>
        order.id === orderId ? originalOrder : order
      ));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'stock' ? (parseInt(value, 10) || 0) : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));

    if (name === 'basePrice' && value) {
      const base = parseFloat(value);
      if (!isNaN(base)) {
        setFormData(prev => ({
          ...prev,
          price250g: Math.round(base / 4),
          price500g: Math.round(base / 2),
          price1kg: base
        }));
      } else {
         setFormData(prev => ({ ...prev, price250g: '', price500g: '', price1kg: '' }));
      }
    }
    if (name === 'category' && !editingProduct) {
      const newId = generateProductId(value);
      setFormData(prev => ({ ...prev, id: newId }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.teluguName || !formData.image || !formData.basePrice || typeof formData.stock !== 'number' || formData.stock < 0) {
      showDialog('Please fill all required (*) fields correctly. Ensure Base Price and Stock are valid positive numbers.', 'error');
      return;
    }
    try {
      new URL(formData.image);
    } catch (_) {
      showDialog('Please enter a valid Image URL (e.g., https://...).', 'error');
      return;
    }

    setIsRefreshing(true);
    try {
      const url = editingProduct ? `${API_URL}/admin/products/${editingProduct.id}` : `${API_URL}/admin/products`;
      const method = editingProduct ? 'PUT' : 'POST';
      const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
      });
      const responseData = await response.json();

      if (response.ok) {
        fetchProducts();
        closeProductModal();
        showDialog(editingProduct ? 'Product updated successfully!' : 'Product added successfully!', 'success');
      } else {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showDialog(`Error saving product: ${error.message}`, 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = (id) => {
    showDialog('Delete this product permanently?', 'confirm', async () => {
       try {
        const response = await fetch(`${API_URL}/admin/products/${id}`, { method: 'DELETE' });
        if (response.ok) {
          fetchProducts();
          showDialog('Product deleted successfully!', 'success');
        } else {
           const errorData = await response.json();
           throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        showDialog(`Failed to delete product: ${error.message}`, 'error');
      }
    });
  };

  const handleDeleteOrder = (orderId) => {
    showDialog('Permanently delete this order?', 'confirm', async () => {
        try {
            const response = await fetch(`${API_URL}/payment/orders/${orderId}`, { method: 'DELETE' });
            if (response.ok) {
                fetchOrders();
                showDialog('Order deleted successfully!', 'success');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            showDialog(`Failed to delete order: ${error.message}`, 'error');
        }
    });
  };

  const generateProductId = (category) => {
    const prefixMap = { 'Sweets': 'sw', 'Snacks': 'sn', 'Spice Powders': 'sp', 'Pickles': 'pk' };
    const prefix = prefixMap[category] || 'un';
    let maxNum = 0;
    products.forEach(p => {
        if (p.id?.startsWith(prefix)) {
            const num = parseInt(p.id.substring(prefix.length), 10);
            if (!isNaN(num) && num > maxNum) maxNum = num;
        }
    });
    return `${prefix}${maxNum + 1}`;
  };

  const openProductModal = (product = null) => {
      if (product) {
          setEditingProduct(product);
          setFormData({
              id: product.id || '', name: product.name || '', teluguName: product.teluguName || '',
              description: product.description || '', teluguDescription: product.teluguDescription || '',
              category: product.category || 'Sweets', basePrice: product.basePrice || '',
              price250g: product.price250g || '', price500g: product.price500g || '', price1kg: product.price1kg || '',
              unit: product.unit || '1KG', image: product.image || '',
              stock: product.stock !== null ? Number(product.stock) : 100
          });
      } else {
          setEditingProduct(null);
          setFormData({
              id: generateProductId('Sweets'), name: '', teluguName: '', description: '', teluguDescription: '',
              category: 'Sweets', basePrice: '', price250g: '', price500g: '', price1kg: '',
              unit: '1KG', image: '', stock: 100
          });
      }
      setShowProductModal(true);
  };

  const closeProductModal = () => { setShowProductModal(false); setEditingProduct(null); };
  const toggleOrderDetails = (orderId) => { setExpandedOrderId(prevId => (prevId === orderId ? null : orderId)); };
  
  const exportToExcel = () => {
    const csvData = filteredOrders.map(order => ({
      'Order ID': order.id,
      'Customer Name': order.customerName || 'N/A',
      'Email': order.customerEmail || 'N/A',
      'Phone': order.customerPhone || 'N/A',
      'Delivery Address': order.deliveryAddress || 'N/A',
      'Total Amount': order.totalAmount,
      'Status': order.status,
      'Payment ID': order.paymentId || 'N/A',
      'Date': new Date(order.createdAt).toLocaleDateString('en-IN')
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const newOrders = useMemo(() => orders.filter(o => o.status === 'pending'), [orders]);

  const stats = useMemo(() => [
     { label: 'Total Products', value: products.length, icon: Package, color: 'bg-blue-500' },
     { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'bg-green-500' },
     { label: 'Revenue (Completed)', value: `₹${orders.reduce((sum, order) => sum + (order.status === 'completed' ? parseFloat(order.totalAmount || 0) : 0), 0).toFixed(2)}`, icon: DollarSign, color: 'bg-purple-500' },
     { label: 'Pending Orders', value: newOrders.length, icon: Info, color: 'bg-orange-500' }
  ], [products, orders, newOrders]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (productCategoryFilter !== 'All') {
      result = result.filter(p => p.category === productCategoryFilter);
    }
    if (searchTerm && activeTab === 'products') {
        const lowerSearchTerm = searchTerm.toLowerCase().trim();
        if (!lowerSearchTerm) return result;
        result = result.filter(p =>
            p.name?.toLowerCase().includes(lowerSearchTerm) ||
            p.teluguName?.toLowerCase().includes(lowerSearchTerm) ||
            p.id?.toLowerCase().includes(lowerSearchTerm)
        );
    }
    return result;
  }, [products, productCategoryFilter, searchTerm, activeTab]);

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (activeTab === 'allOrders' && orderStatusFilter !== 'All') {
        result = result.filter(o => o.status === orderStatusFilter);
    }

    if (orderSearchTerm && (activeTab === 'newOrders' || activeTab === 'allOrders')) {
      const lowerSearchTerm = orderSearchTerm.toLowerCase().trim();
      if (!lowerSearchTerm) return result;

      result = result.filter(o => {
        const detailsMatch = o.customerName?.toLowerCase().includes(lowerSearchTerm) ||
                              o.customerEmail?.toLowerCase().includes(lowerSearchTerm) ||
                              o.customerPhone?.includes(lowerSearchTerm) ||
                              o.deliveryAddress?.toLowerCase().includes(lowerSearchTerm) ||
                              o.id.toString().includes(lowerSearchTerm) ||
                              o.paymentId?.toLowerCase().includes(lowerSearchTerm);

        const itemsMatch = o.items?.some(item =>
          item.productName?.toLowerCase().includes(lowerSearchTerm)
        );
        return detailsMatch || itemsMatch;
      });
    }
    return result;
  }, [orders, orderStatusFilter, orderSearchTerm, activeTab]);

  const ordersToDisplay = activeTab === 'newOrders' ? newOrders : filteredOrders;

  return (
    <>
      <Dialog {...dialog} />
      <audio ref={audioRef} src="https://res.cloudinary.com/duhabjmtf/video/upload/v1760451952/order.mp3" preload="auto" />
      
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; } 
        .admin-container { min-height: 100vh; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; } 
        .admin-header { background: linear-gradient(135deg, #ffd54f 0%, #ffb300 100%); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); padding: 1.5rem 0; } 
        .header-content { max-width: 1400px; margin: 0 auto; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; } 
        .brand-section { display: flex; flex-direction: column; align-items: center; flex: 1; } 
        .brand-logo { height: 60px; width: auto; margin-bottom: 0.5rem; } 
        .admin-title { font-size: 1.5rem; font-weight: 700; color: #185e20; font-family: 'Georgia', serif; letter-spacing: 0.5px; text-align: center; } 
        .header-actions { display: flex; align-items: center; gap: 0.5rem; } 
        .refresh-button { background-color: rgba(255,255,255,0.2); border: 1px solid rgba(0,0,0,0.1); color: #185e20; padding: 0.5rem; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer; } 
        .refresh-button:hover:not(:disabled) { background-color: rgba(255,255,255,0.4); } 
        .refresh-button:disabled { opacity: 0.5; cursor: not-allowed; } 
        .refresh-button.loading svg { animation: spin 1s linear infinite; } 
        @keyframes spin { to { transform: rotate(360deg); } } 
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .pulse-animation { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .content-wrapper { max-width: 1400px; margin: 0 auto; padding: 2rem; } 
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; } 
        .stat-card { background: white; border-radius: 0.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 1.5rem; transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; } 
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.07); } 
        .stat-content { display: flex; align-items: center; justify-content: space-between; } 
        .stat-info p { font-size: 0.9rem; color: #6b7280; margin-bottom: 0.5rem; } 
        .stat-value { font-size: 1.75rem; font-weight: 600; color: #111827; } 
        .stat-icon { padding: 0.75rem; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; } 
        .bg-blue-500 { background-color: #ecf3fe; color: #3b82f6; } 
        .bg-green-500 { background-color: #e7f7f1; color: #10b981;} 
        .bg-purple-500 { background-color: #f3eefe; color: #8b5cf6;} 
        .bg-orange-500 { background-color: #fff6e9; color: #f59e0b;} 
        .main-card { background: white; border-radius: 0.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 1.5rem; overflow: hidden; } 
        .tabs-container { border-bottom: 1px solid #e5e7eb; } 
        .tabs { display: flex; overflow-x: auto; } 
        .tab-button { padding: 1rem 1.5rem; font-size: 0.9rem; font-weight: 500; border: none; background: none; border-bottom: 3px solid transparent; color: #6b7280; cursor: pointer; transition: all 0.2s; white-space: nowrap; display: inline-flex; align-items: center; gap: 0.3rem;} 
        .tab-button:hover { color: #374151; background-color: #f9fafb; } 
        .tab-button.active { color: #185e20; border-bottom-color: #185e20; font-weight: 600; } 
        .tab-badge { background-color: #ef4444; color: white; font-size: 0.7rem; font-weight: 600; padding: 0.1rem 0.4rem; border-radius: 999px; margin-left: 0.4rem; line-height: 1; } 
        .tab-content { padding: 1.5rem; } 
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; } 
        .section-title { font-size: 1.3rem; font-weight: 600; color: #111827; } 
        .btn { padding: 0.5rem 1rem; border-radius: 0.375rem; border: none; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 0.5rem; line-height: 1.2; box-shadow: 0 1px 2px rgba(0,0,0,0.05); } 
        .btn-primary { background-color: #185e20; color: white; } 
        .btn-primary:hover:not(:disabled) { background-color: #104216; } 
        .btn-export { background-color: #059669; color: white; } 
        .btn-export:hover:not(:disabled) { background-color: #047857; } 
        .table-container { overflow-x: auto; } 
        table { width: 100%; border-collapse: collapse; } 
        thead { background-color: #f3f4f6; } 
        th { padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 600; color: #4b5563; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; } 
        th.text-right { text-align: right; } 
        tbody tr { border-bottom: 1px solid #e5e7eb; transition: background-color 0.15s ease-in-out;} 
        tbody tr:hover { background-color: #f9fafb; } 
        td { padding: 0.75rem 1rem; font-size: 0.875rem; color: #374151; vertical-align: middle; } 
        .product-info { display: flex; align-items: center; gap: 0.75rem; } 
        .product-image { width: 40px; height: 40px; border-radius: 0.375rem; object-fit: cover; border: 1px solid #e5e7eb; flex-shrink: 0; } 
        .product-name { font-weight: 500; color: #1f2937; line-height: 1.3;} 
        .product-desc { font-size: 0.8rem; color: #6b7280; } 
        .action-buttons { display: flex; gap: 0.5rem; justify-content: flex-end; } 
        .icon-button { background: none; border: none; cursor: pointer; padding: 0.25rem; transition: color 0.2s; color: #6b7280; } 
        .icon-button:hover { color: #1f2937; } 
        .icon-blue:hover { color: #1d4ed8; } 
        .icon-red:hover { color: #b91c1c; } 
        .empty-state { text-align: center; padding: 3rem; color: #6b7280; } 
        .modal-overlay { position: fixed; inset: 0; background-color: rgba(17, 24, 39, 0.6); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 1rem; z-index: 1000; overflow-y: auto; } 
        .modal { background: white; border-radius: 0.75rem; max-width: 700px; width: 100%; padding: 0; max-height: 90vh; overflow: hidden; margin: 1rem auto; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); display: flex; flex-direction: column; } 
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #e5e7eb; flex-shrink: 0; } 
        .modal-title { font-size: 1.15rem; font-weight: 600; color: #111827; } 
        .close-button { background: none; border: none; color: #9ca3af; cursor: pointer; padding: 0.25rem; } 
        .close-button:hover { color: #4b5563; } 
        .modal-body { padding: 1.5rem; overflow-y: auto; flex-grow: 1; } 
        .form-group { margin-bottom: 1rem; } 
        .form-label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem; } 
        .form-input, .form-select { width: 100%; padding: 0.6rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s; } 
        .form-input:focus, .form-select:focus { border-color: #185e20; box-shadow: 0 0 0 2px rgba(24, 94, 32, 0.2); } 
        textarea.form-input { resize: vertical; min-height: 60px; } 
        .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; } 
        .form-row-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; } 
        .price-info { font-size: 0.75rem; color: #6b7280; font-style: italic; margin-top: 0.25rem; } 
        .modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb; background-color: #f9fafb; flex-shrink: 0; } 
        .btn-secondary { padding: 0.6rem 1.2rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: white; color: #374151; cursor: pointer; font-weight: 500;} 
        .btn-secondary:hover { background-color: #f3f4f6; } 
        .btn-submit { padding: 0.6rem 1.2rem; border-radius: 0.375rem; border: none; background-color: #185e20; color: white; cursor: pointer; font-weight: 500;} 
        .btn-submit:hover:not(:disabled) { background-color: #104216; } 
        .btn-submit:disabled { background-color: #ccc; cursor: not-allowed; } 
        .filter-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; } 
        .filter-left { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; } 
        .filter-right { display: flex; gap: 1rem; align-items: center;} 
        .filter-label { font-weight: 500; color: #374151; font-size: 0.875rem; } 
        .filter-select { padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem; background-color: white; } 
        .status-select { padding: 0.25rem 0.5rem; border-radius: 0.375rem; border: 1px solid #d1d5db; background-color: white; cursor: pointer; font-weight: 500; font-size: 0.8rem; appearance: none; background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>'); background-repeat: no-repeat; background-position: right 0.5rem center; background-size: 1em; padding-right: 2rem;} 
        .order-details { background-color: #f8f9fa; padding: 1rem; margin-top: 0; border-top: 1px solid #e5e7eb; } 
        .order-items-grid { display: grid; gap: 0.75rem; margin-top: 0.5rem; } 
        .order-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: white; border-radius: 0.375rem; border: 1px solid #e5e7eb; font-size: 0.875rem; } 
        .item-info { flex: 1; margin-right: 1rem;} 
        .item-name { font-weight: 600; color: #1f2937; } 
        .item-details { color: #6b7280; font-size: 0.8rem; margin-top: 0.2rem; } 
        .item-price { font-weight: 600; color: #3b82f6; white-space: nowrap; } 
        .expand-button { background: none; border: none; color: #3b82f6; cursor: pointer; font-size: 0.8rem; font-weight: 500; padding: 0; display: inline-flex; align-items: center; gap: 0.2rem;} 
        .expand-button:hover { text-decoration: underline; } 
        .order-count { font-size: 0.875rem; color: #6b7280; font-weight: 500; white-space: nowrap; } 
        .customer-info { display: flex; flex-direction: column; gap: 0.1rem; } 
        .customer-name { font-weight: 600; color: #1f2937; } 
        .customer-detail { font-size: 0.8rem; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; } 
        .customer-address { font-size: 0.8rem; color: #6b7280; white-space: normal; word-wrap: break-word; max-width: 300px; line-height: 1.4; }
        .dialog-modal { background-color: white; border-radius: 0.75rem; max-width: 400px; width: 90%; padding: 2rem; text-align: center; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); } 
        .dialog-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; } 
        .dialog-title { font-size: 1.25rem; font-weight: 600; color: #111827; margin-bottom: 0.5rem; } 
        .dialog-message { font-size: 0.875rem; color: #6b7280; margin-bottom: 1.5rem; } 
        .dialog-actions { display: flex; gap: 0.75rem; justify-content: center; } 
        .bg-green-100 { background-color: #d1fae5; } 
        .text-green-800 { color: #065f46; } 
        .bg-red-100 { background-color: #fee2e2; } 
        .text-red-800 { color: #991b1b; } 
        .bg-yellow-100 { background-color: #fef3c7; } 
        .text-yellow-800 { color: #92400e; } 
        .bg-green-600 { background-color: #059669; color: white; } 
        .bg-red-600 { background-color: #dc2626; color: white; } 
        .hover\\:bg-green-700:hover { background-color: #047857; }
        .hover\\:bg-red-700:hover { background-color: #b91c1c; }
        .payment-status { font-size: 0.75rem; font-weight: 500; padding: 0.2rem 0.5rem; border-radius: 999px; display: inline-block; white-space: nowrap; } 
        .search-input-container { position: relative; display: inline-block; } 
        .search-input { padding: 0.5rem 0.75rem; padding-right: 2.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem; width: 300px; } 
        .search-clear-button { position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9ca3af; padding: 0.25rem;} 
        .search-clear-button:hover { color: #6b7280; } 
        .stock-status { font-weight: 500; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; white-space: nowrap; text-align: center; display: inline-block; min-width: 80px;} 
        .stock-in { background-color: #dcfce7; color: #166534; border: 1px solid #86efac; } 
        .stock-low { background-color: #fef9c3; color: #a16207; border: 1px solid #fde047; } 
        .stock-out { background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; } 
        @media (max-width: 768px) { 
          .admin-title { font-size: 1.25rem; } 
          .brand-logo { height: 50px; } 
          .header-content { flex-direction: row; gap: 0.5rem; padding: 0 1rem; } 
          .brand-section { order: 2; } 
          .header-actions { order: 3; } 
          .content-wrapper { padding: 1rem; } 
          .stats-grid { grid-template-columns: 1fr 1fr; } 
          .stat-value { font-size: 1.5rem; } 
          .section-header { flex-direction: column; align-items: flex-start; gap: 0.75rem;} 
          .filter-row { flex-direction: column; align-items: flex-start; } 
          .modal { max-width: 95%; margin: 1rem; } 
          .dialog-modal { max-width: 90%; } 
          .search-input { width: 100%; } 
        }
      `}</style>

      <div className="admin-container">
        <div className="admin-header">
          <div className="header-content">
            <div style={{ width: '60px' }}></div>
            <div className="brand-section">
              <img src="https://res.cloudinary.com/duhabjmtf/image/upload/v1760451952/Amogam_Final_bp90ft.png" alt="Logo" className="brand-logo"/>
              <h1 className="admin-title">Admin Dashboard</h1>
            </div>
            <div className="header-actions">
              <button onClick={() => handleRefresh(true)} disabled={isRefreshing} className={`refresh-button ${isRefreshing ? 'loading' : ''}`} title="Refresh Data">
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="content-wrapper">
          <div className="stats-grid">
             {stats.map((stat, idx) => ( 
               <div key={idx} className="stat-card"> 
                 <div className="stat-content"> 
                   <div className="stat-info"> 
                     <p>{stat.label}</p> 
                     <div className="stat-value">{stat.value}</div> 
                   </div> 
                   <div className={`stat-icon ${stat.color}`}> 
                     <stat.icon size={20} /> 
                   </div> 
                 </div> 
               </div> 
             ))}
          </div>

          <div className="main-card">
            <div className="tabs-container">
              <div className="tabs">
                <button onClick={() => { setActiveTab('newOrders'); setOrderSearchTerm(''); }} className={`tab-button ${activeTab === 'newOrders' ? 'active' : ''} ${hasNewOrders ? 'pulse-animation' : ''}`}>
                  <Info size={14}/> New Orders
                  {newOrders.length > 0 && <span className="tab-badge">{newOrders.length}</span>}
                </button>
                <button onClick={() => { setActiveTab('allOrders'); setOrderSearchTerm(''); }} className={`tab-button ${activeTab === 'allOrders' ? 'active' : ''}`}>
                  <ShoppingCart size={14}/> All Orders
                </button>
                <button onClick={() => { setActiveTab('products'); setSearchTerm(''); }} className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}>
                   <Package size={14}/> Products
                </button>
              </div>
            </div>

            <div className="tab-content">
              {activeTab === 'products' && (
                <>
                  <div className="section-header">
                    <h2 className="section-title">Manage Products</h2>
                    <button onClick={() => openProductModal()} className="btn btn-primary"><Plus size={16} /> Add Product</button>
                  </div>
                  <div className="filter-row">
                      <div className="filter-left">
                          <div className="filter-container" style={{ marginBottom: 0 }}>
                              <label htmlFor="category-filter" className="filter-label">Category:</label>
                              <select id="category-filter" className="filter-select" value={productCategoryFilter} onChange={(e) => setProductCategoryFilter(e.target.value)}>
                                  <option value="All">All</option>
                                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                              </select>
                          </div>
                      </div>
                      <div className="filter-right search-input-container">
                          <input type="text" placeholder="Search ID, Name..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                          {searchTerm && ( <button onClick={() => setSearchTerm('')} className="search-clear-button" title="Clear search"><XCircle size={16}/></button> )}
                      </div>
                  </div>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th> <th>Category</th> <th>Base Price</th>
                          <th>Stock Count</th> <th>Stock Status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr key={product.id}>
                            <td>
                               <div className="product-info">
                                <img className="product-image" src={product.image || 'https://via.placeholder.com/40'} alt={product.name} onError={(e) => e.target.src='https://via.placeholder.com/40'}/> 
                                <div>
                                    <div className="product-name">{product.name}</div>
                                    <div className="product-desc">{product.teluguName}</div>
                                </div>
                                </div>
                            </td>
                            <td>{product.category}</td>
                            <td>₹{parseFloat(product.basePrice || 0).toFixed(2)}</td>
                            <td>{product.stock}</td>
                            <td>
                              <span className={`stock-status ${
                                product.stock <= 0 ? 'stock-out' :
                                product.stock <= LOW_STOCK_THRESHOLD ? 'stock-low' : 'stock-in'
                              }`}>
                                {product.stock <= 0 ? 'Out of Stock' :
                                product.stock <= LOW_STOCK_THRESHOLD ? 'Low Stock' : 'In Stock'}
                              </span>
                            </td>
                            <td>
                                <div className="action-buttons">
                                <button onClick={() => openProductModal(product)} className="icon-button" title="Edit Product"><Edit2 size={18} className="icon-blue"/></button>
                                <button onClick={() => handleDelete(product.id)} className="icon-button" title="Delete Product"><Trash2 size={18} className="icon-red"/></button>
                                </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                     {filteredProducts.length === 0 && <div className="empty-state">No products found matching filters.</div>}
                  </div>
                </>
              )}

              {(activeTab === 'newOrders' || activeTab === 'allOrders') && (
                <>
                  <div className="section-header">
                    <h2 className="section-title">{activeTab === 'newOrders' ? 'New & Pending Orders' : 'All Orders'}</h2>
                    <span className="order-count">Showing {ordersToDisplay.length} order(s)</span>
                  </div>
                  <div className="filter-row">
                      <div className="filter-left">
                        {activeTab === 'allOrders' && (
                            <div className="filter-container" style={{ marginBottom: 0 }}>
                              <label htmlFor="status-filter" className="filter-label">Status:</label>
                              <select id="status-filter" className="filter-select" value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)}>
                                <option value="All">All</option>
                                {orderStatuses.map(status => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
                              </select>
                            </div>
                        )}
                      </div>
                      <div className="filter-right">
                           <div className="search-input-container">
                              <input type="text" placeholder="Search by name, phone, location, order #..." className="search-input" value={orderSearchTerm} onChange={(e) => setOrderSearchTerm(e.target.value)}/>
                               {orderSearchTerm && ( <button onClick={() => setOrderSearchTerm('')} className="search-clear-button" title="Clear search"><XCircle size={16}/></button> )}
                           </div>
                           {activeTab === 'allOrders' && ( <button onClick={exportToExcel} className="btn btn-export" title="Export filtered orders to CSV"> <FileDown size={16} /> Export </button> )}
                      </div>
                  </div>
                  <div className="table-container">
                    <table>
                      <thead>
                         <tr>
                            <th>Order Details</th> <th>Customer</th> <th>Amount & Payment</th>
                            <th>Status</th> <th>Date</th> <th className="text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                        {ordersToDisplay.map((order) => (
                          <React.Fragment key={order.id}>
                            <tr>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  <span className="product-name">#{order.id}</span>
                                  <button className="expand-button" onClick={() => toggleOrderDetails(order.id)}>
                                    {expandedOrderId === order.id ? <ChevronUp size={14}/> : <ChevronDown size={14}/> }
                                    {expandedOrderId === order.id ? 'Hide Items' : 'View Items'}
                                  </button>
                                </div>
                              </td>
                              <td>
                                <div className="customer-info">
                                  <span className="customer-name">{order.customerName || 'N/A'}</span>
                                  <span className="customer-detail" title={order.customerEmail}>📧 {order.customerEmail || 'N/A'}</span>
                                  <span className="customer-detail">📞 {order.customerPhone || 'N/A'}</span>
                                  <span className="customer-address" title={order.deliveryAddress}>
                                    📍 {order.deliveryAddress || 'N/A'}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '1rem' }}>
                                    ₹{parseFloat(order.totalAmount || 0).toFixed(2)}
                                  </span>
                                  {order.status === 'completed' || order.status === 'delivered' || order.status === 'shipped' ? (
                                    <span className="payment-status" style={{ background: '#d1fae5', color: '#065f46' }}>Paid</span>
                                  ) : order.status === 'failed' ? (
                                    <span className="payment-status" style={{ background: '#fee2e2', color: '#991b1b' }}>Failed</span>
                                   ) : (
                                    <span className="payment-status" style={{ background: '#fef3c7', color: '#92400e' }}>
                                        {order.paymentId ? 'Paid (Processing)' : 'Not Paid'}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <select className="status-select" value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}>
                                  {orderStatuses.map(status => (
                                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <div style={{ whiteSpace: 'nowrap' }}>
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </div>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <button onClick={() => handleDeleteOrder(order.id)} className="icon-button" title="Delete Order">
                                    <Trash2 size={18} className="icon-red"/>
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {expandedOrderId === order.id && (
                              <tr>
                                <td colSpan="6" style={{ padding: 0 }}>
                                  <div className="order-details">
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                                      Order Items ({order.items?.length || 0})
                                    </h4>
                                    <div className="order-items-grid">
                                      {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                                        order.items.map((item, index) => (
                                          <div key={`${order.id}-${item.productId || index}-${item.size}`} className="order-item">
                                            <div className="item-info">
                                              <div className="item-name">{item.productName || 'Product Name Missing'}</div>
                                              <div className="item-details">
                                                Qty: {item.quantity || 1} • Size: {item.size || 'N/A'} • Unit Price: ₹{parseFloat(item.price || 0).toFixed(2)}
                                              </div>
                                            </div>
                                            <div className="item-price">
                                              ₹{((item.quantity || 1) * (item.price || 0)).toFixed(2)}
                                            </div>
                                          </div>
                                        ))
                                      ) : ( <p style={{ textAlign: 'center', color: '#6b7280', padding: '1rem' }}>No item details available.</p> )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                    {ordersToDisplay.length === 0 && (
                      <div className="empty-state">
                        <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                          {activeTab === 'newOrders' ? 'No new orders requiring action.' : 'No orders match the current filters.'}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={closeProductModal} className="close-button"><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-row"> 
                <div className="form-group"> 
                  <label className="form-label">Product ID</label> 
                  <input type="text" name="id" value={formData.id} className="form-input" disabled /> 
                </div> 
                <div className="form-group"> 
                  <label className="form-label">Category *</label> 
                  <select name="category" value={formData.category} onChange={handleInputChange} className="form-select" disabled={!!editingProduct}> 
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)} 
                  </select> 
                </div> 
              </div>
              <div className="form-row"> 
                <div className="form-group"> 
                  <label className="form-label">Product Name *</label> 
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" required /> 
                </div> 
                <div className="form-group"> 
                  <label className="form-label">Telugu Name *</label> 
                  <input type="text" name="teluguName" value={formData.teluguName} onChange={handleInputChange} className="form-input" required/> 
                </div> 
              </div>
              <div className="form-group"> 
                <label className="form-label">Description *</label> 
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="2" className="form-input" required/> 
              </div>
              <div className="form-group"> 
                <label className="form-label">Telugu Description *</label> 
                <textarea name="teluguDescription" value={formData.teluguDescription} onChange={handleInputChange} rows="2" className="form-input" required/> 
              </div>
              <div className="form-row"> 
                <div className="form-group"> 
                  <label className="form-label">Base Price (for 1KG) *</label> 
                  <input type="number" name="basePrice" value={formData.basePrice} onChange={handleInputChange} step="0.01" className="form-input" required placeholder="e.g., 400.00"/> 
                  <div className="price-info">Enter 1KG price, others auto-calculate</div> 
                </div> 
                <div className="form-group"> 
                  <label className="form-label">Unit *</label> 
                  <input type="text" name="unit" value={formData.unit} onChange={handleInputChange} className="form-input" required placeholder="e.g., 1KG, 500g, Each"/> 
                </div> 
              </div>
              <div className="form-row-3"> 
                <div className="form-group"> 
                  <label className="form-label">250g Price (Optional)</label> 
                  <input type="number" name="price250g" value={formData.price250g} onChange={handleInputChange} step="0.01" className="form-input" /> 
                </div> 
                <div className="form-group"> 
                  <label className="form-label">500g Price (Optional)</label> 
                  <input type="number" name="price500g" value={formData.price500g} onChange={handleInputChange} step="0.01" className="form-input" /> 
                </div> 
                <div className="form-group"> 
                  <label className="form-label">1KG Price (Auto)</label> 
                  <input type="number" name="price1kg" value={formData.price1kg} onChange={handleInputChange} step="0.01" className="form-input" readOnly/> 
                </div> 
              </div>
              <div className="form-group"> 
                <label className="form-label">Image URL *</label> 
                <input type="url" name="image" value={formData.image} onChange={handleInputChange} className="form-input" placeholder="https://..." required/> 
                {formData.image && <img src={formData.image} alt="Preview" style={{maxWidth: '100px', maxHeight: '100px', marginTop:'0.5rem', borderRadius:'0.25rem', border:'1px solid #eee'}} onError={(e) => e.target.style.display='none'} onLoad={(e) => e.target.style.display='block'} />}
              </div>
              <div className="form-group"> 
                <label className="form-label">Stock Count *</label> 
                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="form-input" required min="0"/> 
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={closeProductModal} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSubmit} className="btn btn-submit" disabled={isRefreshing}>
                {isRefreshing ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;