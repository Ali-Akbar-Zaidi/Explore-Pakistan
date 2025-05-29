import React, { useState, useEffect } from 'react';
import './adminUsers.css';
import { Home, Shield, BarChart2, Users, Map, Gift, Search, Trash2, Edit, UserX, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/adminApi';

const AdminUsers = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname.toLowerCase();

  // State for user list
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await api.fetchUsers();
        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.trim() === '') {
        try {
          const data = await api.fetchUsers();
          setFilteredUsers(data);
        } catch (err) {
          setError(err.message);
        }
      } else {
        try {
          const data = await api.searchUsers(searchTerm);
          setFilteredUsers(data);
        } catch (err) {
          setError(err.message);
        }
      }
    };
    
    const timer = setTimeout(() => {
      searchUsers();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle direct user deletion from list
  const handleListDelete = async (uid) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await api.deleteUser(uid);
        
        if (result.status === 'success') {
          // Update the users list
          const updatedUsers = users.filter(user => user.uid !== uid);
          setUsers(updatedUsers);
          setFilteredUsers(filteredUsers.filter(user => user.uid !== uid));
          alert(result.message);
        }
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Toggle user status
  const toggleUserStatus = async (uid) => {
    try {
      const result = await api.toggleUserStatus(uid);
      
      if (result.status === 'success') {
        // Update the users list
        const updatedUsers = users.map(user => {
          if (user.uid === uid) {
            return { ...user, status: result.newStatus };
          }
          return user;
        });
        
        setUsers(updatedUsers);
        setFilteredUsers(
          filteredUsers.map(user => {
            if (user.uid === uid) {
              return { ...user, status: result.newStatus };
            }
            return user;
          })
        );
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle user edit (to be implemented)
  const handleEditUser = (user) => {
    // Implement edit functionality
    console.log('Edit user:', user);
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="nav-items">
          <button className={`sidebar-button ${currentPath === '/adminDashBoard' ? 'active' : ''}`} onClick={() => navigate('/adminDashBoard')}>
            <Home className="icon" />
            <span className="label">Dashboard</span>
          </button>
          <button className={`sidebar-button ${currentPath === '/adminUsers' ? 'active' : ''}`} onClick={() => navigate('/adminUsers')}>
            <Users className="icon" />
            <span className="label">Users</span>
          </button>
          <button className={`sidebar-button ${currentPath === '/adminDestinations' ? 'active' : ''}`} onClick={() => navigate('/adminDestinations')}>
            <Map className="icon" />
            <span className="label">Destinations</span>
          </button>
          <button className={`sidebar-button ${currentPath === '/adminSouvenirs' ? 'active' : ''}`} onClick={() => navigate('/adminSouvenirs')}>
            <Gift className="icon" />
            <span className="label">Souvenirs</span>
          </button>
          <button
              className={`sidebar-button ${currentPath.includes('adminsafety') ? 'active' : ''}`}
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
          <h1 className="title">USER MANAGEMENT</h1>
        </div>

        {/* Full width user list section */}
        <div className="users-list-container full-width">
          <div className="chart-header">
            <h2 className="chart-title">User List</h2>
            <div className="search-wrapper">
              <div className="search-bar">
                <Search className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="bookings-table users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th></th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.uid || user.id} className={user.status === 'Inactive' ? 'inactive-user' : ''}>
                    <td>#{user.uid || user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`status-badge ${user.status ? user.status.toLowerCase() : ''}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.joinDate}</td>
                    <td className="action-buttons">
                      <button 
                        className="action-btn status-btn"
                        onClick={() => toggleUserStatus(user.uid || user.id)}
                        title={user.status === 'Active' ? "Deactivate User" : "Activate User"}
                      >
                        {user.status === 'Active' ? 
                          <UserX className="action-icon" /> : 
                          <UserCheck className="action-icon" />
                        }
                      </button>
                      <button 
                        className="action-btn edit-btn"
                        title="Edit User"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="action-icon" />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleListDelete(user.uid || user.id)}
                        title="Delete User"
                      >
                        <Trash2 className="action-icon" />
                      </button>
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

export default AdminUsers;