import React, { useState, useEffect } from 'react';
import './budgetCalculator.css';
import { ShoppingCart, BarChart, Shield, Home, Clock, Heart, Gift, Trash2, Plus, Minus, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from "./firebaseConfig";
// API base URL - change this to match your backend URL
const API_BASE_URL = 'http://localhost:8080/api/budget-calculations';

const BudgetCalculator = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname.toLowerCase(); // Highlight active icon

  // State for thank you message and rating popup
  const [showThankYou, setShowThankYou] = useState(false);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // Initialize userId as null

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setUserId(user.uid); // Set userId from the authenticated user
        } else {
          console.error("User is not authenticated");
          setError("User is not authenticated. Please log in.");
        }
      } catch (err) {
        console.error("Failed to fetch user ID:", err);
        setError("Failed to fetch user ID. Please try again.");
      }
    };

    fetchUserId();
  }, []);

  // Ensure cart items are initialized with valid data
  const [cartItems, setCartItems] = useState([]);

  // Ensure cart items are loaded and validated properly with fallback logic
  useEffect(() => {
    const savedCart = localStorage.getItem('travelCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        const validatedCart = parsedCart.map(item => {
          const dailyExpenses = item.pricePerDay || 0; // Default pricePerDay to 0 if missing
          return {
            ...item,
            destination: item.destination || item.name || "Explore Destination", // Use `name` if `destination` is missing
            accommodation: item.accommodation || "Luxury Hotel", // Fallback for accommodation
            transportType: item.transportType || "Explore Pakistan Travel & Tours", // Fallback for transport type
            activities: item.activities && item.activities.length > 0 ? item.activities : ["Local Activities Provided"], // Fallback for activities
            duration: item.duration || 1, // Default duration to 1 if missing
            pricePerDay: dailyExpenses, // Default pricePerDay to 0 if missing
            accommodationCost: item.accommodationCost || dailyExpenses / 2, // Fallback to half of daily expenses
            transportCost: item.transportCost || 1000, // Default transportCost to 0 if missing
            activityCosts: item.activityCosts || dailyExpenses / 5 // Fallback to one fifth of daily expenses
          };
        });
        setCartItems(validatedCart);
      } catch (error) {
        console.error("Failed to parse cart data:", error);
        localStorage.removeItem('travelCart');
      }
    }
  }, []);

  // Saved budget calculations from backend
  const [savedCalculations, setSavedCalculations] = useState([]);

  // Load user's saved calculations on component mount
  useEffect(() => {
    fetchUserCalculations();
  }, []);

  // Fetch user's saved budget calculations
  const fetchUserCalculations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/user/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setSavedCalculations(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch user calculations:", err);
      setError("Failed to load saved calculations. Please try again later.");
      setLoading(false);
    }
  };

  // Calculate temporary budget without saving
  const calculateTemporaryBudget = async () => {
    try {
      // Convert cart items to format expected by backend
      const destinationIds = cartItems.map(item => item.destination);
      
      // Calculate average daily allowance from all items
      const totalDailyExpenses = cartItems.reduce((sum, item) => sum + item.pricePerDay, 0);
      const avgDailyAllowance = totalDailyExpenses / cartItems.length;
      
      // Sum up all durations
      const totalDuration = cartItems.reduce((sum, item) => sum + item.duration, 0);
      
      // Sum up all costs
      const totalAccommodation = cartItems.reduce((sum, item) => sum + item.accommodationCost, 0);
      const totalTransport = cartItems.reduce((sum, item) => sum + item.transportCost, 0);
      const totalActivities = cartItems.reduce((sum, item) => sum + item.activityCosts, 0);
      
      const budgetData = {
        userId: userId,
        destinationIds: destinationIds,
        dailyAllowance: avgDailyAllowance,
        tripDurationDays: totalDuration,
        accommodationCost: totalAccommodation,
        transportCost: totalTransport,
        activityCosts: totalActivities,
        notes: `Trip to ${destinationIds.join(', ')}`
      };
      
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetData)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Calculated budget:", result);
      setLoading(false);
      return result.totalBudget;
      
    } catch (err) {
      console.error("Failed to calculate budget:", err);
      setError("Failed to calculate budget. Please try again.");
      setLoading(false);
      return null;
    }
  };

  // Save budget calculation to backend
  const saveBudgetCalculation = async () => {
    try {
      // Convert cart items to format expected by backend
      const destinationIds = cartItems.map(item => item.destination);
      
      // Calculate average daily allowance from all items
      const totalDailyExpenses = cartItems.reduce((sum, item) => sum + item.pricePerDay, 0);
      const avgDailyAllowance = totalDailyExpenses / cartItems.length;
      
      // Sum up all durations
      const totalDuration = cartItems.reduce((sum, item) => sum + item.duration, 0);
      
      // Sum up all costs
      const totalAccommodation = cartItems.reduce((sum, item) => sum + item.accommodationCost, 0);
      const totalTransport = cartItems.reduce((sum, item) => sum + item.transportCost, 0);
      const totalActivities = cartItems.reduce((sum, item) => sum + item.activityCosts, 0);
      
      const budgetData = {
        userId: userId,
        destinationIds: destinationIds,
        dailyAllowance: avgDailyAllowance,
        tripDurationDays: totalDuration,
        accommodationCost: totalAccommodation,
        transportCost: totalTransport,
        activityCosts: totalActivities,
        notes: `Trip to ${destinationIds.join(', ')}`
      };
      
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetData)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const savedCalculation = await response.json();
      setSavedCalculations([savedCalculation, ...savedCalculations]);
      setLoading(false);
      
      return savedCalculation;
      
    } catch (err) {
      console.error("Failed to save budget calculation:", err);
      setError("Failed to save budget calculation. Please try again.");
      setLoading(false);
      return null;
    }
  };

  // Delete a saved calculation
  const deleteSavedCalculation = async (calculatorId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${calculatorId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Remove from local state
      setSavedCalculations(savedCalculations.filter(calc => calc.calculatorId !== calculatorId));
      setLoading(false);
      
    } catch (err) {
      console.error("Failed to delete calculation:", err);
      setError("Failed to delete calculation. Please try again.");
      setLoading(false);
    }
  };

  // Function to calculate subtotal for an item
  const calculateItemTotal = (item) => {
    const dailyCost = item.pricePerDay * item.duration;
    return dailyCost + item.accommodationCost + item.transportCost + item.activityCosts;
  };

  // Function to calculate the cart total
  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  // Function to handle quantity changes
  const handleDurationChange = (id, increment) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newDuration = Math.max(1, item.duration + increment);
          return { ...item, duration: newDuration };
        }
        return item;
      })
    );
  };

  // Function to remove item from cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Currency formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PKR' }).format(amount);
  };

  // Handle checkout process
  const handleCheckout = async () => {
    try {
      // Save the calculation to the backend
      const savedCalculation = await saveBudgetCalculation();

      if (savedCalculation) {
        alert('Your budget has been saved successfully!'); // Notify the user

        // Save travel plan using the API
        const travelPlanData = {
          userId: userId,
          destination: savedCalculation.destinationIds.join(', '),
          startDate: new Date().toISOString(), // Placeholder start date
          endDate: new Date().toISOString(), // Placeholder end date
          durationDays: savedCalculation.tripDurationDays,
          highlights: [], // Add highlights if available
          rating: 0, // Default rating
          imageUrls: [],
          notes: savedCalculation.notes,
        };

        const response = await fetch(`${API_BASE_URL}/save-travel-plan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(travelPlanData),
        });

        if (!response.ok) {
          throw new Error('Failed to save travel plan');
        }

        setShowThankYou(true);

        // Show rating popup after 2 seconds
        setTimeout(() => {
          setShowRatingPopup(true);
        }, 2000);
      }
    } catch (err) {
      console.error('Error during checkout:', err);
      setError('Failed to complete checkout. Please try again.');
    }
  };

  // Handle rating submission
  const handleRatingSubmit = () => {
    // Here you would normally send the rating to your backend
    console.log(`User submitted rating: ${rating} stars`);
    
    // Close all modals
    setShowThankYou(false);
    setShowRatingPopup(false);
    
    // Optional: Reset cart or navigate somewhere else
    // setCartItems([]);
    // navigate('/dashboard');
  };

  // Handle rating close without submission
  const handleRatingClose = () => {
    setShowThankYou(false);
    setShowRatingPopup(false);
  };

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
          <h1 className="title">BUDGET CALCULATOR</h1>
          <button className="cart-button">
            <ShoppingCart className="icon" />
            <span className="cart-count">{cartItems.length}</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)} className="close-error">×</button>
          </div>
        )}
        
        {/* Loading Indicator */}
        {loading && (
          <div className="loading-indicator">
            Processing your request...
          </div>
        )}

        <div className="budget-section">
          <div className="budget-container">
            <div className="budget-header">
              <h2 className="section-title">TRIP BUDGET ESTIMATOR</h2>
            </div>
            
            {/* Travel Cart */}
            <div className="cart-table-container">
              <table className="cart-table">
                <thead className="table-header">
                  <tr>
                    <th className="text-left">Destination</th>
                    <th className="text-center">Duration (Days)</th>
                    <th className="text-left">Accommodation</th>
                    <th className="text-left">Transport</th>
                    <th className="text-center">Cost Per Day</th>
                    <th className="text-right">Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="cart-item">
                      <td className="destination-cell">
                        <div className="destination-name">{item.destination}</div>
                        <div className="activities-list">
                          Activities: {item.activities.join(", ")}
                        </div>
                      </td>
                      <td className="duration-cell">
                        <div className="duration-controls">
                          <button 
                            onClick={() => handleDurationChange(item.id, -1)}
                            className="counter-button"
                            disabled={item.duration <= 1}
                          >
                            <Minus className="counter-icon" />
                          </button>
                          <span className="duration-value">{item.duration}</span>
                          <button 
                            onClick={() => handleDurationChange(item.id, 1)}
                            className="counter-button"
                          >
                            <Plus className="counter-icon" />
                          </button>
                        </div>
                      </td>
                      <td>{item.accommodation}</td>
                      <td>{item.transportType}</td>
                      <td className="text-center">{formatCurrency(item.pricePerDay)}</td>
                      <td className="item-total">{formatCurrency(calculateItemTotal(item))}</td>
                      <td className="remove-cell">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="remove-button"
                        >
                          <Trash2 className="remove-icon" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cartItems.length === 0 && (
                    <tr className="empty-cart">
                      <td colSpan="7">
                        Your travel cart is empty. Add destinations to calculate your budget.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Cost Summary Section */}
            <div className="cost-summary-section">
              <div className="cost-breakdown">
                <h3 className="summary-title">Cost Breakdown</h3>
                
                {cartItems.map((item) => (
                  <div key={item.id} className="breakdown-item">
                    <h4 className="breakdown-title">{item.destination}</h4>
                    <div className="breakdown-details">
                      <div className="breakdown-row">
                        <span>Daily Expenses ({item.duration} days × {formatCurrency(item.pricePerDay)})</span>
                        <span>{formatCurrency(item.duration * item.pricePerDay)}</span>
                      </div>
                      <div className="breakdown-row">
                        <span>Accommodation</span>
                        <span>{formatCurrency(item.accommodationCost)}</span>
                      </div>
                      <div className="breakdown-row">
                        <span>Transportation</span>
                        <span>{formatCurrency(item.transportCost)}</span>
                      </div>
                      <div className="breakdown-row">
                        <span>Activities</span>
                        <span>{formatCurrency(item.activityCosts)}</span>
                      </div>
                      <div className="breakdown-row subtotal">
                        <span>Subtotal</span>
                        <span>{formatCurrency(calculateItemTotal(item))}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total Summary */}
              <div className="total-summary">
                <h3 className="summary-title">Total Summary</h3>
                
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(calculateCartTotal())}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (5%)</span>
                    <span>{formatCurrency(calculateCartTotal() * 0.05)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Service Fee</span>
                    <span>{formatCurrency(50)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>{formatCurrency(calculateCartTotal() * 1.05 + 50)}</span>
                  </div>
                  
                  <button className="checkout-button" onClick={handleCheckout} disabled={loading || cartItems.length === 0}>
                    {loading ? 'Processing...' : 'Proceed to Checkout'}
                  </button>
                  
                  <button className="add-more-button"
                  onClick={() => navigate('/destinations')}>
                    Add More Destinations
                  </button>

                  <button className="save-calculation-button"
                  onClick={saveBudgetCalculation} disabled={loading || cartItems.length === 0}>
                    Save Calculation
                  </button>
                </div>
              </div>
            </div>

            {/* Saved Calculations Section */}
            {savedCalculations.length > 0 && (
              <div className="saved-calculations-section">
                <h3 className="section-title">Saved Calculations</h3>
                <div className="saved-items-container">
                  {savedCalculations.map((calc) => (
                    <div key={calc.calculatorId} className="saved-calculation-item">
                      <div className="saved-item-header">
                        <h4>{calc.notes || `Trip (${calc.calculatorId.substring(0, 8)})`}</h4>
                        <button 
                          onClick={() => deleteSavedCalculation(calc.calculatorId)}
                          className="delete-saved-button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="saved-item-details">
                        <div className="saved-item-row">
                          <span>Destinations:</span>
                          <span>{calc.destinationIds.join(', ')}</span>
                        </div>
                        <div className="saved-item-row">
                          <span>Duration:</span>
                          <span>{calc.tripDurationDays} days</span>
                        </div>
                        <div className="saved-item-row">
                          <span>Total Budget:</span>
                          <span>{formatCurrency(calc.totalBudget)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thank You Message Overlay */}
      {showThankYou && (
        <div className="modal-overlay">
          <div className="thank-you-modal">
            <h2>Thank You For Your Purchase!</h2>
            <p>Your trip has been booked successfully.</p>
            <p>We've sent a confirmation to your email.</p>
          </div>
        </div>
      )}

      {/* Rating Popup */}
      {showRatingPopup && (
        <div className="modal-overlay">
          <div className="rating-modal">
            <div className="rating-header">
              <h2>Rate Our App</h2>
              <button className="close-button" onClick={handleRatingClose}>
                <X size={24} />
              </button>
            </div>
            <p>How would you rate your experience with our travel budget calculator?</p>
            
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  fill={(hoverRating || rating) >= star ? "#FFD700" : "none"}
                  stroke={(hoverRating || rating) >= star ? "#FFD700" : "#6B7280"}
                  className="star-icon"
                />
              ))}
            </div>
            
            <div className="rating-feedback">
              <textarea 
                placeholder="Tell us what you liked or how we can improve..." 
                rows="4"
                className="feedback-textarea"
              ></textarea>
            </div>
            
            <button 
              className="submit-rating-button"
              onClick={handleRatingSubmit}
              disabled={rating === 0}
            >
              Submit Rating
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetCalculator;