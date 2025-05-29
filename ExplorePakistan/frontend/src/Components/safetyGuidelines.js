import React, { useState, useEffect } from 'react';
import { ShoppingCart, BarChart, Shield, Home, Clock, Heart, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './safetyGuidelines.css';
import axios from 'axios';

const SafetyGuidelines = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname.toLowerCase();
  const [cart, setCart] = React.useState([]);
  
  // Hardcoded emergency contacts
  const emergencyContacts = [
    { id: "1", title: "Police", number: "15" },
    { id: "2", title: "Ambulance", number: "1122" },
    { id: "3", title: "Tourism Police", number: "+92-310-5888888" },
    { id: "4", title: "Fire Brigade", number: "16" },
    { id: "5", title: "Tourist Helpline", number: "+92-51-9204444" }
  ];
  
  const [guidelines, setGuidelines] = useState({
    "General Safety": [],
    "Health Precautions": [],
    "Transportation Safety": [],
    "Cultural Awareness": []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSafetyData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/safety');
        if (response.data) {
          setGuidelines(response.data.guidelines || {
            "General Safety": [],
            "Health Precautions": [],
            "Transportation Safety": [],
            "Cultural Awareness": []
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching safety guidelines:', error);
        setLoading(false);
      }
    };
    fetchSafetyData();
  }, []);

  if (loading) return <div className="loading">Loading safety guidelines...</div>;

  return (
    <div className="main-container">
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
        
        <div className="safety-guidelines">
          <h2 className="section-title">SAFETY GUIDELINES</h2>
          
          <div className="guidelines-container">
            {Object.entries(guidelines).map(([category, items]) => (
              <div className="guideline-category" key={category}>
                <h3 className="guideline-heading">{category}</h3>
                <ul className="guideline-list">
                  {items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="emergency-contacts">
            <h3 className="guideline-heading">Emergency Contacts</h3>
            <div className="contact-cards">
              {emergencyContacts.map((contact) => (
                <div className="contact-card" key={contact.id}>
                  <h4>{contact.title}</h4>
                  <p className="contact-number">{contact.number}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyGuidelines;