import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // --- Read password from environment variable ---
  // Use a default value if the environment variable is not set during development
  const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'admin12'; // Fallback added

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Password entered:', password);
    console.log('Expected password:', ADMIN_PASSWORD);
    console.log('Passwords match:', password === ADMIN_PASSWORD);
    
    if (password === ADMIN_PASSWORD) {
      setError('');
      console.log('Login successful, setting session storage');
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      if (onLoginSuccess) { // Check if the prop exists before calling
        console.log('Calling onLoginSuccess');
        onLoginSuccess();
      }
      console.log('Navigating to /admin');
      navigate('/admin', { replace: true });
    } else {
      console.log('Login failed - incorrect password');
      setError('Incorrect password. Please try again.');
      setPassword(''); // Clear password field on error
    }
  };

  return (
    <>
      <style>{`
        /* --- Keep ALL Login Page Styles --- */
        .login-container { display: flex; align-items: center; justify-content: center; min-height: 100vh; background-color: #fdf8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
        .login-card { background: white; padding: 3rem; border-radius: 1rem; box-shadow: 0 10px 30px -15px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
        .login-logo { width: 100px; height: auto; margin: 0 auto 1.5rem; }
        .login-title { font-size: 1.5rem; font-weight: 600; color: #185e20; margin-bottom: 0.5rem; }
        .login-subtitle { color: #6b7280; margin-bottom: 2rem; }
        .login-form .form-group { margin-bottom: 1.5rem; text-align: left; }
        .login-form .form-label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem; }
        .login-form .form-input { width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; }
        .login-form .form-input:focus { border-color: #185e20; outline: none; box-shadow: 0 0 0 2px rgba(24, 94, 32, 0.2); }
        .login-button { width: 100%; padding: 0.75rem 1rem; border: none; border-radius: 0.5rem; background-color: #185e20; color: white; font-size: 1rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s; }
        .login-button:hover { background-color: #104216; }
        .error-message { color: #dc2626; font-size: 0.875rem; margin-top: 1.5rem; font-weight: 500; }
      `}</style>
      <div className="login-container">
        <div className="login-card">
          <img src="https://res.cloudinary.com/duhabjmtf/image/upload/v1760451952/Amogam_Final_bp90ft.png" alt="Logo" className="login-logo" />
          <h1 className="login-title">Admin Access</h1>
          <p className="login-subtitle">Please enter your password to continue.</p>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="login-button">Login</button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;