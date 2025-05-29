import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminSouvenirs.css';
import { ShoppingCart, Shield, Home, Users, Map, Gift, Search, MapPin, Plus, Trash2, X, Check, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminSouvenirs = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname.toLowerCase();
  const [souvenirs, setSouvenirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredItems, setFilteredItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [allTags, setAllTags] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [nameExistsError, setNameExistsError] = useState(false);

  const [newSouvenir, setNewSouvenir] = useState({
    name: "",
    description: "",
    location: "",
    price: "",
    province: "",
    tags: []
  });


const [tagInput, setTagInput] = useState("");  // Existing line
const [tagError, setTagError] = useState(false);  // Add this right after

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

  useEffect(() => {
    fetchData();
  }, []);

  const checkNameExists = (name) => {
    return souvenirs.some(province => 
      province.items.some(item => item.name.toLowerCase() === name.toLowerCase())
    );
  };

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
      province.items.map(item => ({...item, province: province.province}))
    );
    
    let results = allItems;
    
    if (searchQuery) {
      results = results.filter(item => 
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()))
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

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setNameExistsError(false);
    }
    if (name === "price") {
      // Prevent negative numbers and handle as string
      const numValue = Math.max(0, Number(value));
      setNewSouvenir(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? "" : numValue.toString()
      }));
      return;
    }
    setNewSouvenir(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const addTag = () => {
    if (tagInput.trim() && !newSouvenir.tags.includes(tagInput.trim())) {
      setNewSouvenir(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setNewSouvenir(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleAddSouvenir = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    setNameExistsError(false);
    setTagError(false);

    const priceValue = Math.round(Number(newSouvenir.price));
      // Validate all fields
  if (!newSouvenir.name || !newSouvenir.description || !newSouvenir.location || 
    !newSouvenir.price || !newSouvenir.province) {
  showNotification("Please fill all required fields", "error");
  setIsAdding(false);
  return;
}

if (newSouvenir.tags.length === 0) {
  setTagError(true);
  showNotification("Please add at least one tag", "error");
  setIsAdding(false);
  return;
}

if (checkNameExists(newSouvenir.name)) {
  setNameExistsError(true);
  showNotification("A souvenir with this name already exists", "error");
  setIsAdding(false);
  return;
}

if (isNaN(priceValue) || priceValue <= 0) {
  showNotification("Please enter a valid price", "error");
  setIsAdding(false);
  return;
}
    try {
      await axios.post('http://localhost:8080/api/souvenirs', {
        souvenirName: newSouvenir.name,
        description: newSouvenir.description,
        location: newSouvenir.location,
        estimatedPrice: parseFloat(newSouvenir.price),
        province: newSouvenir.province,
        tags: newSouvenir.tags
      });
  
      // Reset form first
      setNewSouvenir({
        name: "",
        description: "",
        location: "",
        price: "",
        province: "",
        tags: []
      });
      setTagInput("");
      setNameExistsError(false);
      
      // Then close modal
      setShowModal(false);
      
      // Then fetch new data and show notification
      await fetchData();
      showNotification("Souvenir added successfully", "success");
    } catch (err) {
      showNotification(`Error: ${err.response?.data?.message || err.message}`, "error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (item) => {
    try {
      await axios.delete(`http://localhost:8080/api/souvenirs/${item.id}`);
      await fetchData();
      showNotification("Souvenir deleted successfully", "success");
    } catch (err) {
      showNotification(`Error: ${err.response?.data?.message || err.message}`, "error");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="main-container">
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="nav-items">
            <button
              className={`sidebar-button ${currentPath.includes('admindashboard') ? 'active' : ''}`}
              onClick={() => navigate('/adminDashboard')}
            >
              <Home className="icon" />
              <span className="label">Dashboard</span>
            </button>

            <button
              className={`sidebar-button ${currentPath.includes('adminusers') ? 'active' : ''}`}
              onClick={() => navigate('/adminUsers')}
            >
              <Users className="icon" />
              <span className="label">Users</span>
            </button>

            <button
              className={`sidebar-button ${currentPath.includes('admindestinations') ? 'active' : ''}`}
              onClick={() => navigate('/adminDestinations')}
            >
              <Map className="icon" />
              <span className="label">Destinations</span>
            </button>

            <button
              className={`sidebar-button ${currentPath.includes('adminsouvenirs') ? 'active' : ''}`}
              onClick={() => navigate('/adminSouvenirs')}
            >
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
      </div>

      <div className="main-content">
        <div className="header">
          <h1 className="title">SOUVENIRS MANAGEMENT</h1>
        </div>

        <div className="action-bar">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search souvenirs..." 
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
          
          <button className="add-button" onClick={() => setShowModal(true)}>
            <Plus className="icon" />
            <span>Add Souvenir</span>
          </button>
        </div>

        {notification.show && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        <div className="admin-souvenirs-grid">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item.id} className="admin-souvenir-card">
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
                      <span className="price-value">{formatCurrency(item.price)}</span>
                    </div>
                    
                    <div className="admin-actions">
                      <button 
                        className="delete-button"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 className="trash-icon" />
                      
                      </button>
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Souvenir</h2>
              <button className="close-button" onClick={() => {
  setShowModal(false);
  setNameExistsError(false);
  setNewSouvenir({
    name: "",
    description: "",
    location: "",
    price: "",
    province: "",
    tags: []
  });
  setTagInput("");
}}>
  <X className="icon" />
</button>
            </div>
            <form onSubmit={handleAddSouvenir} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Souvenir Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newSouvenir.name}
                    onChange={handleInputChange}
                    required
                    className={nameExistsError ? "error-input" : ""}
                  />
                  {nameExistsError && (
                    <p className="error-message">A souvenir with this name already exists</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="province">Province *</label>
                  <select
                    id="province"
                    name="province"
                    value={newSouvenir.province}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Province</option>
                    {provinces.filter(p => p !== "All").map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="price">Price (PKR) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="1"
                    step="1"
                    value={newSouvenir.price}
                    onChange={handleInputChange}
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value) {
                        setNewSouvenir(prev => ({
                          ...prev,
                          price: Math.round(Number(value)).toString()
                        }));
                      }
                    }}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={newSouvenir.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="location">Where to Find *</label>
                <textarea
                  id="location"
                  name="location"
                  value={newSouvenir.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group full-width">
                <label>Tags *</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                      setTagError(false);
                    }}
                    list="availableTags"
                    className={tagError ? "error-input" : ""}
                  />
                  <datalist id="availableTags">
                    {allTags.map(tag => (
                      <option key={tag} value={tag} />
                    ))}
                  </datalist>
                  <button type="button" onClick={addTag}>
                    <Tag className="icon" />
                  </button>
                </div>
                {tagError && (
                 <p className="error-message">Please add at least one tag</p>
                )}
                <div className="tags-list">
                  {newSouvenir.tags.map((tag, index) => (
                    <div key={index} className="tag">
                      <span>{tag}</span>
                      <button type="button" onClick={() => removeTag(index)}>
                        <X className="icon" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={() => {
                    setShowModal(false);
                    setNameExistsError(false);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button" disabled={isAdding}>
                  {isAdding ? 'Adding...' : (
                    <>
                      <Check className="icon" />
                      Add Souvenir
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSouvenirs;