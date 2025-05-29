import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import './userDashBoard.css';
import { BarChart,ShoppingCart, Shield, Home, Clock, Heart, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExplorePakistan = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname.toLowerCase();
  const [cart, setCart] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAge, setUserAge] = useState(null);

  // Function to load recommendations
  const loadRecommendations = async (age) => {
    try {
      // Default to age 25 if no age is provided (shows general recommendations)
      const requestAge = age || 25;
      const response = await fetch(`http://localhost:8080/api/recommendations/age/${requestAge}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching recommendations: ${response.statusText}`);
      }
      
      let data = await response.json();
      
      // If we need exactly 2 recommendations, slice the array
      if (data.length > 2) {
        // Get featured recommendations first
        const featured = data.filter(rec => rec.featured);
        const nonFeatured = data.filter(rec => !rec.featured);
        
        // Prioritize featured recommendations
        data = [...featured, ...nonFeatured].slice(0, 2);
      } else if (data.length === 0) {
        // If no recommendations match the age, get general top recommendations
        const topResponse = await fetch('http://localhost:8080/api/recommendations/top/2');
        if (topResponse.ok) {
          data = await topResponse.json();
        }
      }
      
      setRecommendations(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
      setError(err.message);
      setLoading(false);
      
      // Set default recommendations in case of error
      setRecommendations([
        {
          id: 1,
          name: "LAHORE",
          description: "Experience the cultural heart of Pakistan with historic monuments, vibrant food streets, and the magnificent Badshahi Mosque."
        },
        {
          id: 2,
          name: "ISLAMABAD",
          description: "Visit Pakistan's beautiful capital city with its stunning Faisal Mosque, lush green Margalla Hills, and modern cityscape."
        }
      ]);
    }
  };

  // Load user data and recommendations when component mounts
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Get user data from Firebase Realtime Database
        const db = getDatabase();
        const userRef = ref(db, 'users/' + user.uid);
        
        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              if (userData.age) {
                setUserAge(parseInt(userData.age));
                loadRecommendations(parseInt(userData.age));
              } else {
                // If no age found, load default recommendations
                loadRecommendations();
              }
            } else {
              // No user data found, load default recommendations
              loadRecommendations();
            }
          })
          .catch((error) => {
            console.error("Error getting user data:", error);
            loadRecommendations();
          });
      } else {
        // No authenticated user, load default recommendations
        loadRecommendations();
        navigate('/login'); // Redirect to login if not authenticated
      }
    });

    // Load cart from localStorage
    const savedCart = localStorage.getItem('travelCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart data:", error);
      }
    }

    // Cleanup subscription
    return () => unsubscribe();
  }, [navigate]);

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
          <h1 className="title">EXPLORE PAKISTAN</h1>
          <div className="cart-container">
            <button className="cart-button" onClick={() => navigate('/budget')}>
              <ShoppingCart className="icon" />
              {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
            </button>
          </div>
        </div>

        <div className="recommendation-section">
          <div className="recommendation-box">
            <h2 className="section-title">RECOMMENDATIONS FOR YOU</h2>

            <div className="cards">
              {loading ? (
                <p>Loading recommendations...</p>
              ) : error ? (
                <p>Error loading recommendations. Showing default suggestions.</p>
              ) : (
                recommendations.map(recommendation => (
                  <div key={recommendation.id} className="city-card">
                    <div className="card-content">
                      <h3 className="city-name">{recommendation.name}</h3>
                      <p className="description">
                        {recommendation.description}
                      </p>
                      <button 
                        className="explore-button" 
                        onClick={() => navigate('/destinations')}
                      >
                        Explore Destinations
                      </button>
                    </div>
                  </div>
                ))
              )}
              
              {/* If no recommendations were fetched, show default cards */}
              {!loading && !error && recommendations.length === 0 && (
                <>
                  <div className="city-card">
                    <div className="card-content">
                      <h3 className="city-name">LAHORE</h3>
                      <p className="description">
                        Experience the cultural heart of Pakistan with historic monuments,
                        vibrant food streets, and the magnificent Badshahi Mosque.
                      </p>
                      <button 
                        className="explore-button" 
                        onClick={() => navigate('/destinations')}
                      >
                        Explore Destinations
                      </button>
                    </div>
                  </div>

                  <div className="city-card">
                    <div className="card-content">
                      <h3 className="city-name">ISLAMABAD</h3>
                      <p className="description">
                        Visit Pakistan's beautiful capital city with its stunning Faisal Mosque,
                        lush green Margalla Hills, and modern cityscape.
                      </p>
                      <button 
                        className="explore-button" 
                        onClick={() => navigate('/destinations')}
                      >
                        Explore Destinations
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* About Us Section - Unchanged */}
        <div className="about-us-section recommendation-box">
          <h2 className="section-title">ABOUT US</h2>
          
          <div className="about-content">
            <p className="description">
              It is created by a group of students from FAST-NUCES, Lahore, Pakistan.
              We are passionate about travel and want to share our love for Pakistan with the world.
              It is our 4th semester project for the course of Software Design and Architecture.
            </p>
            
            <div className="team-container">
              <h3 className="team-title">The group members are:</h3>
              <div className="team-grid">
                <div className="team-member">
                  <span className="member-name">Hadi Ali Akbar</span>
                  <span className="member-id">23L-3023</span>
                </div>
                <div className="team-member">
                  <span className="member-name">Hassaan bin Saqib</span>
                  <span className="member-id">23L-3039</span>
                </div>
                <div className="team-member">
                  <span className="member-name">Umer Naseer</span>
                  <span className="member-id">23L-3040</span>
                </div>
                <div className="team-member">
                  <span className="member-name">Wzeea Sajid</span>
                  <span className="member-id">23L-3046</span>
                </div>
                <div className="team-member">
                  <span className="member-name">Maryam Irshad</span>
                  <span className="member-id">23L-3093</span>
                </div>
                <div className="team-member">
                  <span className="member-name">Abdul Hannan</span>
                  <span className="member-id">23L-3106</span>
                </div>
              </div>
            </div>
            
            <p className="description">
              We have made this app to help people plan their trip to Pakistan's famous and beautiful locations. 
              Explore the cultural richness, breathtaking landscapes, and vibrant cities of Pakistan with ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePakistan;