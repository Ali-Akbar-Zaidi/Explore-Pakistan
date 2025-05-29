import React, { useState, useEffect } from 'react';
import './destinations.css';
// Explicitly import all icons to avoid any issues
import { ShoppingCart, BarChart, Shield, Home, Clock, Heart, Gift, Search, MapPin, Star, Plus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080/api/destinations';

const Destinations = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname.toLowerCase();

  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");

  // Fetch destinations from API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Failed to fetch destinations');
        const data = await response.json();
        setDestinations(data);
        setFilteredDestinations(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        // Fallback to sample data if API fails
        const sampleData = [
          {
            id: 1,
            name: "Lahore",
            description: "Cultural hub with rich history and amazing food",
            image: "/api/placeholder/400/320",
            rating: 4.7,
            pricePerDay: 120,
            activities: ["City Tour", "Food Street Experience", "Lahore Fort Visit", "Shopping in Anarkali"],
            region: "Punjab",
            tags: ["historical", "city", "cultural"]
          },
          {
            id: 2,
            name: "Hunza Valley",
            description: "Breathtaking mountain landscapes and serene environment",
            image: "/api/placeholder/400/320",
            rating: 4.9,
            pricePerDay: 150,
            activities: ["Hiking", "Boat Ride at Attabad Lake", "Baltit Fort Visit", "Local Cuisine Experience"],
            region: "Gilgit-Baltistan",
            tags: ["mountains", "nature", "adventure"]
          },
          {
            id: 3,
            name: "Swat Valley",
            description: "The Switzerland of Pakistan with lush green meadows",
            image: "/api/placeholder/400/320",
            rating: 4.8,
            pricePerDay: 135,
            activities: ["Kalam Visit", "Mahodand Lake Trek", "White Water Rafting", "Local Cuisine"],
            region: "Khyber Pakhtunkhwa",
            tags: ["mountains", "nature", "adventure"]
          },
          {
            id: 4,
            name: "Karachi",
            description: "Bustling metropolis with beautiful beaches and seafood",
            image: "/api/placeholder/400/320",
            rating: 4.5,
            pricePerDay: 145,
            activities: ["Clifton Beach Visit", "Port Grand", "National Museum", "Boat Trip"],
            region: "Sindh",
            tags: ["city", "beach", "metropolitan"]
          },
          {
            id: 5,
            name: "Islamabad",
            description: "Green and peaceful capital city with modern infrastructure",
            image: "/api/placeholder/400/320",
            rating: 4.6,
            pricePerDay: 130,
            activities: ["Faisal Mosque", "Margalla Hills Trek", "Daman-e-Koh", "Pakistan Monument"],
            region: "Federal Territory",
            tags: ["city", "modern", "peaceful"]
          },
          {
            id: 6,
            name: "Murree",
            description: "Popular hill station with pine forests and cool climate",
            image: "/api/placeholder/400/320",
            rating: 4.4,
            pricePerDay: 110,
            activities: ["Mall Road", "Chair Lift", "Pindi Point", "Kashmir Point"],
            region: "Punjab",
            tags: ["mountains", "hill station", "family"]
          }
        ];
        setDestinations(sampleData);
        setFilteredDestinations(sampleData);
        setIsLoading(false);
        console.warn("Using sample data due to API error:", err.message);
      }
    };

    fetchDestinations();

    // Load cart from localStorage
    const savedCart = localStorage.getItem('travelCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart data:", error);
        localStorage.removeItem('travelCart');
      }
    }
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PKR' }).format(amount);
  };

  // Handle search and filters
  useEffect(() => {
    let results = destinations;
    
    if (searchQuery) {
      results = results.filter(dest => 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.activities.some(activity => activity.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (selectedRegion !== "All") {
      results = results.filter(dest => dest.region === selectedRegion);
    }
    
    if (selectedTag !== "All") {
      results = results.filter(dest => dest.tags.includes(selectedTag));
    }
    
    setFilteredDestinations(results);
  }, [searchQuery, selectedRegion, selectedTag, destinations]);

  // Add destination to cart
  const addToCart = (destination) => {
    if (cart.some(item => item.id === destination.id)) {
      setNotificationMessage(`${destination.name} is already in your budget!`);
    } else {
      const updatedCart = [...cart, destination];
      setCart(updatedCart);
      setNotificationMessage(`${destination.name} added to your budget!`);
      localStorage.setItem('travelCart', JSON.stringify(updatedCart));
    }
    
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Get unique regions and tags for filters
  const regions = ["All", ...new Set(destinations.map(dest => dest.region))];
  const tags = ["All", ...new Set(destinations.flatMap(dest => dest.tags))];

  if (isLoading) return <div className="main-container">Loading destinations...</div>;

  return (
    <div className="main-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="nav-items">
          <button
            className={`sidebar-button ${currentPath === '/dashboard' ? 'active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            <Home className="icon" />
            <span className="label">Dashboard</span>
          </button>

          <button
            className={`sidebar-button ${currentPath === '/history' ? 'active' : ''}`}
            onClick={() => navigate('/history')}
          >
            <Clock className="icon" />
            <span className="label">History</span>
          </button>

          <button
            className={`sidebar-button ${currentPath === '/budget' ? 'active' : ''}`}
            onClick={() => navigate('/budget')}
          >
            <ShoppingCart className="icon" />
            <span className="cart-button-container">
              <span className="label">Budget</span>
              {cart.length > 0 && <span className="sidebar-cart-count">{cart.length}</span>}
            </span>
          </button>

          <button
            className={`sidebar-button ${currentPath === '/destinations' ? 'active' : ''}`}
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

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1 className="title">DESTINATIONS</h1>
          <div className="cart-container">
            <button className="cart-button" onClick={() => navigate('/budget')} aria-label="View Budget">
              <ShoppingCart size={24} />
              {cart.length > 0 && <span className="cart-count" key={cart.length}>{cart.length}</span>}
            </button>
          </div>
        </div>

        <div className="destinations-section">
          {/* Search and Filter Bar */}
          <div className="search-filter-container">
            <div className="search-bar">
              <Search className="search-icon" />
              <input 
                type="text" 
                placeholder="Search destinations, activities..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filters">
              <div className="filter-group">
                <label htmlFor="region-filter">Region:</label>
                <select 
                  id="region-filter" 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="filter-select"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="tag-filter">Category:</label>
                <select 
                  id="tag-filter" 
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="filter-select"
                >
                  {tags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="error-message">
              <p>Error fetching destinations: {error}</p>
              <p>Showing sample data instead.</p>
            </div>
          )}

          {/* Notification */}
          {showNotification && (
            <div className="notification">
              {notificationMessage}
            </div>
          )}

          {/* Destination Cards Grid */}
          <div className="destinations-grid">
            {filteredDestinations.length > 0 ? (
              filteredDestinations.map(destination => (
                <div key={destination.id} className="destination-card">
                  <div className="card-image">
                    <img src={destination.image} alt={destination.name} />
                    <div className="card-rating">
                      <Star className="star-icon" />
                      <span>{destination.rating}</span>
                    </div>
                    <button 
                      className="quick-add-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(destination);
                      }}
                      title="Add to Budget"
                    >
                      <Plus className="plus-icon" />
                    </button>
                  </div>
                  
                  <div className="card-content">
                    <div className="card-header">
                      <h3 className="card-title">{destination.name}</h3>
                      <div className="card-location">
                        <MapPin className="location-icon" />
                        <span>{destination.region}</span>
                      </div>
                    </div>
                    
                    <p className="card-description">{destination.description}</p>
                    
                    <div className="card-tags">
                      {destination.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                    
                    <div className="card-activities">
                      <h4>Popular Activities:</h4>
                      <ul className="activities-list">
                        {destination.activities.slice(0, 3).map((activity, index) => (
                          <li key={index}>{activity}</li>
                        ))}
                        {destination.activities.length > 3 && <li>+{destination.activities.length - 3} more</li>}
                      </ul>
                    </div>
                    
                    <div className="card-footer">
                      <div className="card-price">
                        <span className="price-label">From</span>
                        <span className="price-value">{formatCurrency(destination.pricePerDay)}</span>
                        <span className="price-period">/ day</span>
                      </div>
                      
                      <button 
                        className="add-to-cart-button"
                        onClick={() => addToCart(destination)}
                      >
                        <Plus className="add-icon" />
                        <span>Add to Budget</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No destinations found matching your search criteria.</p>
                <button 
                  className="reset-button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedRegion("All");
                    setSelectedTag("All");
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

export default Destinations;