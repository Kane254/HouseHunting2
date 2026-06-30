import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLoginSuccess, onToggleToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Send credentials to the backend
      const response = await axios.post('http://127.0.0.1:5183/api/auth/login', {
        email,
        password
      });

      // Save user session credentials to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Trigger the app state layout change
      onLoginSuccess(response.data.user);

    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Login failed.');
      } else {
        setError('Cannot connect to authentication server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Sign in to manage your house listings</p>

        {error && <div className="error-banner">⚠️ {error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="name@rentals.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      </div>
    <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
    Don't have an account yet?{' '}
    <span 
        onClick={onToggleToRegister} 
        style={{ color: '#1e3c72', cursor: 'pointer', fontWeight: 'bold' }}
    >
        Create an account
    </span>
    </p>
    </div>
  );
}

export default Login;