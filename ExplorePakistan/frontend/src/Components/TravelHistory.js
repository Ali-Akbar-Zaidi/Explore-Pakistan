import React, { useState, useEffect } from 'react';
import './TravelHistory.css';
import { ShoppingCart, Shield, Home, Clock, Heart, Gift, Calendar, MapPin, BarChart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TravelHistory = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname.toLowerCase();
  const [cart, setCart] = useState([]);
  const [travelHistories, setTravelHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isBudgetSaved, setIsBudgetSaved] = useState(false);
  const [savedTravelPlans, setSavedTravelPlans] = useState([]);
  const [destinations, setDestinations] = useState([]);

  // Corrected URL construction for API calls
  const baseUrl = "http://localhost:8080";

  // Added logic to define `userId` from authentication or a placeholder
  const userId = "current-user-id"; // Replace with actual logic to fetch user ID, e.g., from auth context

  // Updated logic to fetch and display all destinations from the budget calculator in the travel history page
  useEffect(() => {
    const fetchTravelHistories = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        const response = await fetch(`${baseUrl}/api/travel-histories/user/${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch travel histories');
        }

        const data = await response.json();

        if (data.length === 0) {
          setError('');
        } else {
          // Transform data into the correct format
          const formattedHistories = data.map((history) => ({
            destinations: history.destinationIds.join(', '),
            subtotal: history.subtotal,
            durationDays: history.tripDurationDays,
          }));
          setTravelHistories(formattedHistories);
        }
      } catch (err) {
        setError('Error fetching travel histories: ' + err.message);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchTravelHistories();
  }, [userId]);

  // Removed unnecessary call to the "save travel plans" API in the fetch logic
  useEffect(() => {
    const fetchTravelHistories = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/travel-histories`);

        if (!response.ok) {
          throw new Error('Failed to fetch travel histories');
        }

        const data = await response.json();
        setTravelHistories(data); // Update travel histories with fetched data
      } catch (err) {
        console.error('Error fetching travel histories:', err);
      }
    };

    fetchTravelHistories();
  }, []);

  // Fetch saved travel plans from the backend and display them on the Travel History page
  useEffect(() => {
    const fetchSavedTravelPlans = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/budget-calculations`);

        if (!response.ok) {
          throw new Error('Failed to fetch saved travel plans');
        }

        const data = await response.json();
        setTravelHistories(data); // Update travel histories with saved travel plans
      } catch (err) {
        console.error('Error fetching saved travel plans:', err);
      }
    };

    fetchSavedTravelPlans();
  }, []);

  // Function to add a new travel history
  const addTravelHistory = async (newHistory) => {
    try {
      const response = await fetch(`${baseUrl}/api/travel-histories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHistory),
      });

      if (!response.ok) {
        throw new Error('Failed to add travel history');
      }

      const createdHistory = await response.json();
      setTravelHistories([createdHistory, ...travelHistories]);
      showNotificationMessage('Travel history added successfully!');
    } catch (err) {
      showNotificationMessage('Error adding travel history: ' + err.message);
      console.error('Error adding travel history:', err);
    }
  };

  // Function to delete a travel history
  const deleteTravelHistory = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/api/travel-histories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete travel history');
      }

      setTravelHistories(travelHistories.filter(history => history.id !== id));
      showNotificationMessage('Travel history deleted successfully!');
    } catch (err) {
      showNotificationMessage('Error deleting travel history: ' + err.message);
      console.error('Error deleting travel history:', err);
    }
  };

  // Added logic to fetch and display travel history data after a budget is stored
  const saveBudget = async (budgetData) => {
    try {
      const response = await fetch(`${baseUrl}/api/budget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetData),
      });

      if (!response.ok) {
        throw new Error('Failed to save budget');
      }

      setIsBudgetSaved(true); // Mark budget as saved
      showNotificationMessage('Budget saved successfully!');

      // Fetch travel history after saving the budget
      const travelHistoryResponse = await fetch(`${baseUrl}/api/travel-histories`);
      if (!travelHistoryResponse.ok) {
        throw new Error('Failed to fetch travel histories');
      }

      const travelHistoryData = await travelHistoryResponse.json();
      setTravelHistories(travelHistoryData); // Update the state with fetched travel histories
    } catch (err) {
      showNotificationMessage('Error: ' + err.message);
      console.error('Error:', err);
    }
  };

  // Function to submit the rating and fetch saved travel plans
  const submitRating = async (ratingData) => {
    try {
      const response = await fetch(`${baseUrl}/api/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      showNotificationMessage('Rating submitted successfully!');

      // Fetch saved travel plans after submitting the rating
      const plansResponse = await fetch(`${baseUrl}/api/saved-travel-plans`);
      if (!plansResponse.ok) {
        throw new Error('Failed to fetch saved travel plans');
      }

      const plansData = await plansResponse.json();
      setSavedTravelPlans(plansData);
    } catch (err) {
      showNotificationMessage('Error: ' + err.message);
      console.error('Error:', err);
    }
  };

  // Helper function to show notification
  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Updated the center box to retrieve and display all destinations from the database
  useEffect(() => {
    const fetchAllDestinations = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/destinations`); // Replace with the correct API endpoint for fetching destinations

        if (!response.ok) {
          throw new Error('Failed to fetch destinations');
        }

        const data = await response.json();
        setDestinations(data); // Update state with fetched destinations
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError('Failed to load destinations.');
      }
    };

    fetchAllDestinations();
  }, []);

  // Updated layout to display destination names in a grid and rearranged sections
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
            <span className="label">Budget</span>
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
          <h1 className="title">TRAVEL HISTORY</h1>
           <div className="cart-container">
                      <button className="cart-button" onClick={() => navigate('/budget')}>
                        <ShoppingCart className="icon" />
                        {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
                      </button>
                    </div>
        </div>

        {/* Saved Travel Plans Section */}
        <div className="history-section">
          <div className="history-box">
            <h2 className="section-title">YOUR SAVED TRAVEL PLANS</h2>
            <div className="history-items">
              {savedTravelPlans.map((plan) => (
                <div key={plan.id} className="history-card">
                  <div className="card-details">
                    <h3 className="trip-city">{plan.city}</h3>
                    <p className="trip-date">{plan.date}</p>
                    <p className="trip-highlights">{plan.highlights.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="destinations-grid">
          {destinations.length > 0 ? (
            destinations.map((destination, index) => (
              <div key={index} className="destination-box">
                <h3>{destination.name}</h3>
              </div>
            ))
          ) : null}
        </div>

        {/* Removed the 'Your Travel History' box */}
      </div>
    </div>
  );
};

export default TravelHistory;