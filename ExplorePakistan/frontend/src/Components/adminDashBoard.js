import React, { useState, useEffect } from 'react';
import './adminDashBoard.css';
import { Home, BarChart2, Users,Shield , Map, Gift, DollarSign, Briefcase, PieChart, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, Line, BarChart, Bar, Cell, Pie } from 'recharts';
import { fetchUserStats, fetchMonthlySignups } from './adminService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname.toLowerCase();

  // Sample data for graphs and stats
  const [stats, setStats] = useState({
    totalUsers: 25,
    totalBookings: 1,
    totalRevenue: 500,
    activeDestinations: 8
  });

  const [recentBookings, setRecentBookings] = useState([
    {
      id: 1,
      user: "John Smith",
      destination: "Lahore",
      date: "April 20, 2025",
      amount: 480
    },
    {
      id: 2,
      user: "Sarah Johnson",
      destination: "Hunza Valley",
      date: "April 22, 2025",
      amount: 600
    },
    {
      id: 3,
      user: "Michael Chen",
      destination: "Swat Valley",
      date: "April 23, 2025",
      amount: 405
    },
    {
      id: 4,
      user: "Aisha Khan",
      destination: "Karachi",
      date: "April 24, 2025",
      amount: 435
    }
  ]);

  // State for signup statistics
  const [signupData, setSignupData] = useState([
    { month: 'Nov', signups: 15 },
    { month: 'Dec', signups: 22 },
    { month: 'Jan', signups: 18 },
    { month: 'Feb', signups: 27 },
    { month: 'Mar', signups: 35 },
    { month: 'Apr', signups: 42 }
  ]);

  // State for selected time period
  const [signupPeriod, setSignupPeriod] = useState('6months');

  // Data for travel plans statistics
  const travelPlansData = [
    { destination: "Hunza Valley", bookings: 138, color: "#FF6384" },
    { destination: "Lahore", bookings: 126, color: "#36A2EB" },
    { destination: "Swat Valley", bookings: 97, color: "#FFCE56" },
    { destination: "Islamabad", bookings: 83, color: "#4BC0C0" },
    { destination: "Karachi", bookings: 72, color: "#9966FF" }
  ];

  const monthlyBookings = [
    { month: "Nov", bookings: 42 },
    { month: "Dec", bookings: 56 },
    { month: "Jan", bookings: 35 },
    { month: "Feb", bookings: 61 },
    { month: "Mar", bookings: 79 },
    { month: "Apr", bookings: 92 }
  ];

  // Calculate percentage change in signups from last month
  const calculateSignupGrowth = (data) => {
    if (data.length < 2) return 0;
    
    const currentMonth = data[data.length - 1].signups;
    const previousMonth = data[data.length - 2].signups;
    
    if (previousMonth === 0) return 100; // If previous month was 0, show 100% growth
    
    return Math.round(((currentMonth - previousMonth) / previousMonth) * 100);
  };

  // Fetch user stats and signup data
  useEffect(() => {
    const loadUserStats = async () => {
      try {
        const userStatsData = await fetchUserStats();
        
        if (userStatsData) {
          // Update total users count
          setStats(prevStats => ({
            ...prevStats,
            totalUsers: userStatsData.totalUsers || prevStats.totalUsers
          }));
          
          // Update signup data if available
          if (userStatsData.monthlySignups && userStatsData.monthlySignups.length > 0) {
            setSignupData(userStatsData.monthlySignups);
          }
        }
      } catch (error) {
        console.error("Failed to load user statistics:", error);
      }
    };
    
    loadUserStats();
  }, []);

  // Handle signup period change
  const handleSignupPeriodChange = async (e) => {
    const period = e.target.value;
    setSignupPeriod(period);
    
    // Convert selection to number of months
    let months = 6;
    switch (period) {
      case '12months':
        months = 12;
        break;
      case 'year':
        months = new Date().getMonth() + 1; // Months since beginning of year
        break;
      default:
        months = 6;
    }
    
    try {
      const data = await fetchMonthlySignups(months);
      if (data && data.length > 0) {
        setSignupData(data);
      }
    } catch (error) {
      console.error("Failed to fetch monthly signups:", error);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PKR' }).format(amount);
  };

  return (
    <div className="main-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="nav-items">
          <button
            className={`sidebar-button ${currentPath === '/adminDashBoard' ? 'active' : ''}`}
            onClick={() => navigate('/adminDashBoard')}
          >
            <Home className="icon" />
            <span className="label">Dashboard</span>
          </button>

          <button
            className={`sidebar-button ${currentPath === '/adminUsers' ? 'active' : ''}`}
            onClick={() => navigate('/adminUsers')}
          >
            <Users className="icon" />
            <span className="label">Users</span>
          </button>

          <button
            className={`sidebar-button ${currentPath === '/adminDestinations' ? 'active' : ''}`}
            onClick={() => navigate('/adminDestinations')}
          >
            <Map className="icon" />
            <span className="label">Destinations</span>
          </button>

          <button
            className={`sidebar-button ${currentPath === '/adminSouvenirs' ? 'active' : ''}`}
            onClick={() => navigate('/adminSouvenirs')}
          >
            <Gift className="icon" />
            <span className="label">Souvenirs</span>
          </button>
          <button
              className={`sidebar-button ${currentPath === '/adminSafetyGuidelines' ? 'active' : ''}`}
              onClick={() => navigate('/adminSafetyGuidelines')}
            >
              <Shield className="icon" />
              <span className="label">Safety</span>
            </button>
        </div>
      </div>
     

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1 className="title">ADMIN DASHBOARD</h1>
          
        </div>

      

        {/* Charts Section - UPDATED */}
        <div className="charts-section">
          {/* Signup Report Chart */}
          <div className="chart-container">
            <div className="chart-header">
              <h2 className="chart-title">User Signup Report</h2>
              <div className="chart-actions">
                <select 
                  className="chart-select"
                  value={signupPeriod}
                  onChange={handleSignupPeriodChange}
                >
                  <option value="6months">Last 6 Months</option>
                  <option value="12months">Last 12 Months</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
            <div className="chart-content">
              <div className="chart-visualization">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={signupData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <Line 
                      type="monotone" 
                      dataKey="signups" 
                      stroke="#22c55e" 
                      strokeWidth={3} 
                      dot={{ r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-info">
                <div className="info-item">
                  <TrendingUp className={`info-icon ${calculateSignupGrowth(signupData) >= 0 ? 'positive' : 'negative'}`} />
                  <div className="info-content">
                    <h4 className="info-value">{calculateSignupGrowth(signupData) >= 0 ? '+' : ''}{calculateSignupGrowth(signupData)}%</h4>
                    <p className="info-label">from last month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Recent Bookings */}
        <div className="table-section">
          <div className="table-header">
            <h2 className="table-title">Recent Bookings</h2>
            <button className="view-all-button">View All</button>
          </div>

          <div className="table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>User</th>
                  <th>Destination</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>#{booking.id.toString().padStart(4, '0')}</td>
                    <td>{booking.user}</td>
                    <td>{booking.destination}</td>
                    <td>{booking.date}</td>
                    <td>{formatCurrency(booking.amount)}</td>
                    <td>
                      <span className="status-badge confirmed">Confirmed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;