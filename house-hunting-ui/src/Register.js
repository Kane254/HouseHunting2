import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Reuses your clean login-card layouts!

function Register({ onRegisterSuccess, onToggleToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Tenant');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:5183/api/auth/register', {
        name,
        email,
        password,
        role,
        phoneNumber
      });

      // Save credentials straight into the cache session storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Propagate state update up to App.js
      onRegisterSuccess(response.data.user);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Registration failed.');
      } else {
        setError('Cannot connect to registration server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '450px' }}>
        <h2>Create Account</h2>
        <p>Join HouseHunting to find or manage rentals</p>

        {error && <div className="error-banner">⚠️ {error}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name / Business Name</label>
            <input 
              type="text" 
              required 
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              required 
              placeholder="e.g., +254712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Account Type</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Tenant">Looking for a house (Tenant)</option>
              <option value="Landlord">Listing properties (Landlord)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              placeholder="Create strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <span 
            onClick={onToggleToLogin} 
            style={{ color: '#1e3c72', cursor: 'pointer', fontWeight: 'bold', decoration: 'underline' }}
          >
            Sign In here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;