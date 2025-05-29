import React, { useState } from 'react';
import { ShoppingCart, Shield, Home, Clock, Heart, Gift, BarChart } from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import './reports.css';
import { useNavigate } from 'react-router-dom';
const Reports = () => {
  const [activeTab, setActiveTab] = useState('popular');
  const [cart] = useState([]);
    const navigate = useNavigate();
    const currentPath = window.location.pathname.toLowerCase();

  // Dummy data for charts
  const popularDestinations = [
    { name: 'Lahore', visitors: 4200 },
    { name: 'Islamabad', visitors: 3800 },
    { name: 'Karachi', visitors: 3500 },
    { name: 'Murree', visitors: 2900 },
    { name: 'Swat', visitors: 2700 },
    { name: 'Hunza', visitors: 2500 }
  ];
  
  const seasonalTrends = [
    { month: 'Jan', visitors: 1500 },
    { month: 'Feb', visitors: 1700 },
    { month: 'Mar', visitors: 2100 },
    { month: 'Apr', visitors: 2400 },
    { month: 'May', visitors: 2700 },
    { month: 'Jun', visitors: 3200 },
    { month: 'Jul', visitors: 3800 },
    { month: 'Aug', visitors: 3600 },
    { month: 'Sep', visitors: 3100 },
    { month: 'Oct', visitors: 2600 },
    { month: 'Nov', visitors: 2200 },
    { month: 'Dec', visitors: 1800 }
  ];
  
  const ratingAnalysis = [
    { name: '5 Stars', value: 42 },
    { name: '4 Stars', value: 28 },
    { name: '3 Stars', value: 18 },
    { name: '2 Stars', value: 8 },
    { name: '1 Star', value: 4 }
  ];
  
  const travelHistory = [
    { destination: 'Lahore', date: '2023-06-15', duration: 5 },
    { destination: 'Islamabad', date: '2023-08-22', duration: 3 },
    { destination: 'Murree', date: '2023-12-10', duration: 2 },
    { destination: 'Swat', date: '2024-02-18', duration: 4 },
    { destination: 'Hunza', date: '2024-03-05', duration: 7 }
  ];

  const COLORS = ['#059669', '#10b981', '#34d399', '#86efac', '#bbf7d0'];
  
  
 
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
          <h1 className="title">TRAVEL REPORTS</h1>
          <div className="cart-container">
            <button className="cart-button" onClick={() => navigate('/budget')}>
              <ShoppingCart className="icon" />
              {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === 'popular' ? 'active' : ''}`}
            onClick={() => setActiveTab('popular')}
          >
            Popular Destinations
          </button>
          <button 
            className={`tab-button ${activeTab === 'seasonal' ? 'active' : ''}`}
            onClick={() => setActiveTab('seasonal')}
          >
            Seasonal Trends
          </button>
          <button 
            className={`tab-button ${activeTab === 'ratings' ? 'active' : ''}`}
            onClick={() => setActiveTab('ratings')}
          >
            Rating Analysis
          </button>
          <button 
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Travel History
          </button>
        </div>

        {/* Charts */}
        <div className="reports-section recommendation-box">
          <h2 className="section-title">
            {activeTab === 'popular' && 'POPULAR DESTINATIONS'}
            {activeTab === 'seasonal' && 'SEASONAL TRENDS'}
            {activeTab === 'ratings' && 'RATING ANALYSIS'}
            {activeTab === 'history' && 'YOUR TRAVEL HISTORY'}
          </h2>

          <div className="chart-container">
            {activeTab === 'popular' && (
              <div className="chart">
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsBarChart data={popularDestinations} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#dcfce7', borderColor: '#86efac' }}
                      cursor={{ fill: 'rgba(134, 239, 172, 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="visitors" name="Number of Visitors" fill="#059669" />
                  </RechartsBarChart>
                </ResponsiveContainer>
                <div className="chart-description">
                  <p>This chart shows the most popular destinations in Pakistan based on visitor numbers. Lahore leads with the highest number of visitors, followed by Islamabad and Karachi.</p>
                </div>
              </div>
            )}

            {activeTab === 'seasonal' && (
              <div className="chart">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={seasonalTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#dcfce7', borderColor: '#86efac' }}
                      cursor={{ stroke: '#059669' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="visitors" name="Monthly Visitors" stroke="#059669" strokeWidth={2} dot={{ r: 6, fill: '#059669' }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="chart-description">
                  <p>Tourism in Pakistan peaks during summer months (June-August) when weather is most favorable for travel. Winter months (December-February) see the lowest visitor numbers except for winter sports destinations.</p>
                </div>
              </div>
            )}

            {activeTab === 'ratings' && (
              <div className="chart">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={ratingAnalysis}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {ratingAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#dcfce7', borderColor: '#86efac' }}
                      formatter={(value) => [`${value} Reviews`, 'Count']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="chart-description">
                  <p>A significant majority of travelers rate their experiences in Pakistan positively, with 70% giving 4-5 star ratings. This high satisfaction rate reflects the country's hospitality, scenic beauty, and cultural experiences.</p>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="history-content">
                <div className="travel-history-chart">
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart 
                      data={travelHistory}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      barSize={40}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="destination" />
                      <YAxis label={{ value: 'Duration (Days)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#dcfce7', borderColor: '#86efac' }}
                        cursor={{ fill: 'rgba(134, 239, 172, 0.1)' }}
                        formatter={(value, name) => [`${value} days`, 'Duration']}
                      />
                      <Bar dataKey="duration" name="Days Spent" fill="#059669" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="reports-section recommendation-box tips-section">
          <h2 className="section-title">TRAVEL INSIGHTS</h2>
          <div className="tips-content">
            <div className="tip-card">
              <div className="tip-header">Best Time to Visit</div>
              <p>The best time to visit Pakistan depends on the region. Northern areas are best from May to October, while southern regions are ideal from November to March.</p>
            </div>
            <div className="tip-card">
              <div className="tip-header">Travel Budget</div>
              <p>Plan a daily budget of PKR 5,000-10,000 ($20-40) for budget travelers, and PKR 15,000-25,000 ($60-100) for mid-range accommodations and experiences.</p>
            </div>
            <div className="tip-card">
              <div className="tip-header">Local Transportation</div>
              <p>Public transport is inexpensive but can be crowded. Consider hiring a private driver for long distances or using ride-sharing apps in major cities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;