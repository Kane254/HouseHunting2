import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Change this URL to match your exact running backend port!
const API_BASE_URL = 'https://localhost:5055/api/houses'; 

function App() {
  const [houses, setHouses] = useState([]);
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch houses based on filter inputs
  const fetchHouses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL, {
        params: { location, type, maxPrice }
      });
      setHouses(response.data);
    } catch (error) {
      console.error("Error pulling house data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Run a default fetch when the app boots up
  useEffect(() => {
    fetchHouses();
  }, []);

  return (
    <div className="app-container">
      <header className="hero-section">
        <h1>Find Your Next Home</h1>
        <p>Skip the footwork. Search vacant listings instantly.</p>
        
        {/* Search Bar / Filters */}
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

      {/* Main Results Grid */}
      <main className="results-container">
        {loading ? (
          <div className="spinner">Searching available units...</div>
        ) : houses.length === 0 ? (
          <p className="no-results">No vacant houses match your criteria. Try adjusting filters.</p>
        ) : (
          <div className="house-grid">
            {houses.map((house) => (
              <div key={house.id} className="house-card">
                <div className="image-placeholder">
                  {house.images && house.images.length > 0 ? (
                    <img src={house.images[0].imageUrl} alt="House unit" />
                  ) : (
                    <span className="no-img-text">🏠 No Image Available</span>
                  )}
                </div>
                <div className="house-info">
                  <span className="house-tag">{house.type}</span>
                  <h3>{house.property?.name || "Standard Apartment"}</h3>
                  <p className="location-text">📍 {house.property?.location || "Unknown Location"}</p>
                  <p className="description-text">{house.description}</p>
                  <div className="card-footer">
                    <span className="price">KES {parseFloat(house.pricePerMonth).toLocaleString()}/mo</span>
                    <button className="view-btn">View Details</button>
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