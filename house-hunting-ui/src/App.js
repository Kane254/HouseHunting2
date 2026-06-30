import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login'; // Import our new login component
import Register from './Register'; // Import our new register component
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [houses, setHouses] = useState([]);
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if credentials are saved in browser cache when the application boots
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5183/api/houses', {
        params: { location, type, maxPrice }
      });
      
      // CRITICAL: Ensure it says response.data here!
      setHouses(response.data); 
      
      console.log("Data from backend:", response.data); // Add this temporary log
    } catch (error) {
      console.error("Error pulling house data:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
// Find where this check lives in App.js (around line 38) and update it:
  const [isRegistering, setIsRegistering] = useState(false);

  if (!user) {
    if (isRegistering) {
      return (
        <Register 
          onRegisterSuccess={(loggedInUser) => setUser(loggedInUser)} 
          onToggleToLogin={() => setIsRegistering(false)} 
        />
      );
    }
    
    return (
      <Login 
        onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} 
        onToggleToRegister={() => setIsRegistering(true)} 
      />
    );
  }
  // ELSE, SHOW THE HOUSE PORTAL
  return (
    <div className="app-container">
      <nav className="navbar">
        <span>Logged in as: <strong>{user.name} ({user.role})</strong></span>
        <button onClick={handleLogout} className="logout-btn">Log Out</button>
      </nav>

      <header className="hero-section">
        <h1>Find Your Next Home</h1>
        <p>Skip the footwork. Search vacant listings instantly.</p>
        
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="e.g., Westlands, Kilimani..." 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All House Types</option>
            <option value="Bedsitter">Bedsitter</option>
            <option value="1-Bedroom">1-Bedroom</option>
            <option value="2-Bedroom">2-Bedroom</option>
            <option value="Studio">Studio</option>
          </select>
          <input 
            type="number" 
            placeholder="Max Budget (KES)" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <button onClick={fetchHouses}>Search</button>
        </div>
      </header>

      {/* Main Results Grid Container */}
      <main className="results-container">
        {loading ? (
          <div className="spinner">Searching available units...</div>
        ) : houses.length === 0 ? (
          <div className="no-results">No vacant houses found. Click Search to fetch all.</div>
        ) : (
          <div className="house-grid">
            {houses && houses.map((house) => (
              <div key={house.id} className="house-card">
                <div className="house-info">
                  {/* 1. Double check these match the exact casing from your Network tab! */}
                  <span className="house-tag">{house.type || "Rental"}</span>
                  <h3>Unit {house.unitNumber || "N/A"}</h3>
                  <p className="description-text">{house.description || "No description provided."}</p>
                  <div className="card-footer">
                    {/* 2. Using a fallback (|| 0) prevents the UI from breaking if price is missing */}
                    <span className="price">KES {(house.pricePerMonth || 0).toLocaleString()}/mo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;