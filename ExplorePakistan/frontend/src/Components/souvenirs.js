import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './souvenirs.css';

import { ShoppingCart,BarChart,Shield, Home, Clock, Heart, Gift, Search, MapPin, Plus, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Souvenirs = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname.toLowerCase();
  const [souvenirs, setSouvenirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredItems, setFilteredItems] = useState([]);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [souvenirsRes, tagsRes] = await Promise.all([
          axios.get('http://localhost:8080/api/souvenirs'),
          axios.get('http://localhost:8080/api/souvenirs/tags')
        ]);
        
        const transformedData = transformBackendData(souvenirsRes.data);
        setSouvenirs(transformedData);
        setAllTags(tagsRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const transformBackendData = (backendData) => {
    const provinces = [...new Set(backendData.map(item => item.province))];
    
    return provinces.map(province => ({
      province,
      items: backendData
        .filter(item => item.province === province)
        .map(item => ({
          id: item.souvenirName,
          name: item.souvenirName,
          description: item.description,
          location: item.location,
          price: item.estimatedPrice,
          tags: item.tags || []
        }))
    }));
  };

  useEffect(() => {
    if (souvenirs.length === 0) return;

    const allItems = souvenirs.flatMap(province => 
      province.items.map(item => ({ ...item, province: province.province }))
    );

    let results = allItems;

    if (searchQuery) {
      results = results.filter(item =>
        (item.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (item.description?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (item.location?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      );
    }

    if (selectedProvince !== "All") {
      results = results.filter(item => item.province === selectedProvince);
    }

    if (selectedCategory !== "All") {
      results = results.filter(item => item.tags.includes(selectedCategory));
    }

    setFilteredItems(results);
  }, [searchQuery, selectedProvince, selectedCategory, souvenirs]);

  const provinces = ["All", "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balouchistan", "Gilgit Baltistan"];
  const categories = ["All", ...allTags];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) return <div className="loading">Loading souvenirs...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="main-container">
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="nav-items">
            <button
              className={`sidebar-button ${currentPath.includes('dashboard') ? 'active' : ''}`}
              onClick={() => navigate('/dashboard')}
            >
              <Home className="icon" />
              <span className="label">Dashboard</span>
            </button>

            <button
              className={`sidebar-button ${currentPath.includes('history') ? 'active' : ''}`}
              onClick={() => navigate('/history')}
            >
              <Clock className="icon" />
              <span className="label">History</span>
            </button>

            <button
              className={`sidebar-button ${currentPath.includes('budget') ? 'active' : ''}`}
              onClick={() => navigate('/budget')}
            >
              <ShoppingCart className="icon" />
              <span className="label">Budget</span>
            </button>

            <button
              className={`sidebar-button ${currentPath.includes('destinations') ? 'active' : ''}`}
              onClick={() => navigate('/destinations')}
            >
              <Heart className="icon" />
              <span className="label">Destinations</span>
            </button>

          <button
            className={`sidebar-button ${currentPath === '/souvenirs' ? 'active' : ''}`}
            onClick={() => navigate('/souvenirs')}
          >
            <Gift className="icon" />
            <span className="label">Souvenirs</span>
          </button>
          <button
            className={`sidebar-button ${currentPath === '/reports' ? 'active' : ''}`}
            onClick={() => navigate('/reports')}
          >
            <BarChart className="icon" />
            <span className="label">Reports</span>
          </button>
          <button
              className={`sidebar-button ${currentPath === '/safety-guidelines' ? 'active' : ''}`}
              onClick={() => navigate('/safety-guidelines')}
            >
              <Shield className="icon" />
              <span className="label">Safety</span>
            </button>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="header">
          <h1 className="title">TRADITIONAL SOUVENIRS</h1>
          <button className="cart-button" onClick={() => navigate('/budget')}>
            <ShoppingCart className="icon" />
          </button>
        </div>

        <div className="souvenirs-section">
          <div className="search-filter-container">
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search souvenirs, crafts, locations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filters">
              <div className="filter-group">
                <label htmlFor="province-filter">Province:</label>
                <select 
                  id="province-filter" 
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="filter-select"
                >
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="category-filter">Category:</label>
                <select 
                  id="category-filter" 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="souvenirs-grid">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div key={item.id} className="souvenir-card">
                  <div className="card-content">
                    <div className="card-header">
                      <h3 className="card-title">{item.name}</h3>
                      <div className="card-location">
                        <MapPin className="location-icon" />
                        <span>{item.province}</span>
                      </div>
                    </div>
                    
                    <p className="card-description">{item.description}</p>
                    
                    <div className="card-tags">
                      {item.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                    
                    <div className="card-finder">
                      <h4>Where to Find:</h4>
                      <p className="location-info">{item.location}</p>
                    </div>
                    
                    <div className="card-footer">
                      <div className="card-price">
                        <span className="price-label">From</span>
                        <span className="price-value">{formatCurrency(item.price)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No souvenirs found matching your search criteria.</p>
                <button 
                  className="reset-button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedProvince("All");
                    setSelectedCategory("All");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Souvenirs;
