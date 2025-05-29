import React, { useState, useEffect } from 'react';
import './adminSafetyGuidelines.css';
import { Home, Users, Map, Gift, Shield, Search, Trash2, Edit, Plus, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminSafetyGuidelines = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname.toLowerCase();
  
  // Hardcoded emergency contacts
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: "1", title: "Police", number: "15" },
    { id: "2", title: "Ambulance", number: "1122" },
    { id: "3", title: "Tourism Police", number: "+92-310-5888888" },
    { id: "4", title: "Fire Brigade", number: "16" },
    { id: "5", title: "Tourist Helpline", number: "+92-51-9204444" }
  ]);

  const [guidelines, setGuidelines] = useState({});
  const [loading, setLoading] = useState(true);
  
  // States for editing
  const [editingCategory, setEditingCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingItem, setEditingItem] = useState({ category: "", index: -1, text: "" });
  const [editingContact, setEditingContact] = useState({ id: "", title: "", number: "" });
  
  // State for deletion confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    type: "",
    category: "",
    index: -1,
    id: ""
  });
  
  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Fetch guidelines data from backend
  useEffect(() => {
    const fetchSafetyData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/safety');
        if (response.data) {
          setGuidelines(response.data.guidelines || {});
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching safety guidelines:', error);
        setLoading(false);
      }
    };
    fetchSafetyData();
  }, []);

  // Filter guidelines based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCategories(Object.keys(guidelines));
    } else {
      const results = Object.keys(guidelines).filter(category => {
        if (category.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true;
        }
        return guidelines[category].some(item => 
          item.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredCategories(results);
    }
  }, [searchTerm, guidelines]);

  // Save all changes to backend (only guidelines)
  const saveAllChanges = async () => {
    try {
      await axios.post('http://localhost:8080/api/safety', {
        guidelines
        // No longer sending emergencyContacts to backend
      });
      alert("All changes saved successfully!");
    } catch (error) {
      alert("Error saving changes: " + error.message);
    }
  };
  
  // Functions for category management
  const addCategory = () => {
    if (newCategoryName.trim() !== "" && !guidelines[newCategoryName]) {
      setGuidelines({
        ...guidelines,
        [newCategoryName]: []
      });
      setNewCategoryName("");
    }
  };
  
  const confirmDeleteCategory = (category) => {
    setDeleteConfirmation({
      show: true,
      type: "category",
      category: category,
      index: -1,
      id: ""
    });
  };
  
  const deleteCategory = () => {
    const { category } = deleteConfirmation;
    const updatedGuidelines = { ...guidelines };
    delete updatedGuidelines[category];
    setGuidelines(updatedGuidelines);
    setDeleteConfirmation({
      show: false,
      type: "",
      category: "",
      index: -1,
      id: ""
    });
  };
  
  const startEditingCategory = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category);
  };
  
  const saveEditedCategory = () => {
    if (newCategoryName.trim() !== "" && newCategoryName !== editingCategory) {
      const updatedGuidelines = { ...guidelines };
      updatedGuidelines[newCategoryName] = [...updatedGuidelines[editingCategory]];
      delete updatedGuidelines[editingCategory];
      setGuidelines(updatedGuidelines);
    }
    setEditingCategory("");
    setNewCategoryName("");
  };
  
  // Functions for guideline item management
  const addItem = (category) => {
    setEditingItem({ category, index: -1, text: "" });
  };
  
  const saveItem = () => {
    if (editingItem.text.trim() !== "") {
      const updatedGuidelines = { ...guidelines };
      
      if (editingItem.index === -1) {
        updatedGuidelines[editingItem.category] = [...updatedGuidelines[editingItem.category], editingItem.text];
      } else {
        updatedGuidelines[editingItem.category][editingItem.index] = editingItem.text;
      }
      
      setGuidelines(updatedGuidelines);
      setEditingItem({ category: "", index: -1, text: "" });
    }
  };
  
  const confirmDeleteItem = (category, index) => {
    setDeleteConfirmation({
      show: true,
      type: "item",
      category: category,
      index: index,
      id: ""
    });
  };
  
  const deleteItem = () => {
    const { category, index } = deleteConfirmation;
    const updatedGuidelines = { ...guidelines };
    updatedGuidelines[category] = updatedGuidelines[category].filter((_, i) => i !== index);
    setGuidelines(updatedGuidelines);
    setDeleteConfirmation({
      show: false,
      type: "",
      category: "",
      index: -1,
      id: ""
    });
  };
  
  const startEditingItem = (category, index, text) => {
    setEditingItem({ category, index, text });
  };
  
  // Functions for emergency contact management
  const addEmergencyContact = () => {
    setEditingContact({ 
      id: Date.now().toString(), 
      title: "", 
      number: "" 
    });
  };
  
  const saveEmergencyContact = () => {
    if (editingContact.title.trim() !== "" && editingContact.number.trim() !== "") {
      if (editingContact.id === "") {
        // Add new contact
        setEmergencyContacts([
          ...emergencyContacts,
          { 
            id: Date.now().toString(),
            title: editingContact.title, 
            number: editingContact.number 
          }
        ]);
      } else {
        // Update existing contact
        setEmergencyContacts(
          emergencyContacts.map(contact => 
            contact.id === editingContact.id 
              ? { ...contact, title: editingContact.title, number: editingContact.number } 
              : contact
          )
        );
      }
      setEditingContact({ id: "", title: "", number: "" });
    }
  };
  
  const confirmDeleteContact = (id) => {
    setDeleteConfirmation({
      show: true,
      type: "contact",
      category: "",
      index: -1,
      id: id
    });
  };
  
  const deleteContact = () => {
    const { id } = deleteConfirmation;
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
    setDeleteConfirmation({
      show: false,
      type: "",
      category: "",
      index: -1,
      id: ""
    });
  };
  
  const startEditingContact = (contact) => {
    setEditingContact({ 
      id: contact.id, 
      title: contact.title, 
      number: contact.number 
    });
  };

  if (loading) return <div className="loading">Loading safety guidelines...</div>;

  return (
    <div className="main-container">
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

      <div className="main-content">
        <div className="header">
          <h1 className="title">SAFETY GUIDELINES MANAGEMENT</h1>
          <button className="save-all-button" onClick={saveAllChanges}>
            <Save className="icon" />
            Save All Changes
          </button>
        </div>
        
        <div className="admin-safety-content">
          <div className="chart-container categories-container">
            <div className="chart-header">
              <h2 className="chart-title">Safety Guidelines</h2>
              <div className="search-wrapper">
                <div className="search-bar">
                  <input 
                    type="text" 
                    placeholder="Search guidelines..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="add-category-form">
              <input
                type="text"
                placeholder="New Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="admin-input"
              />
              <button className="admin-button add-button" onClick={addCategory}>
                <Plus size={16} /> Add Category
              </button>
            </div>
            
            <div className="guidelines-accordion">
              {filteredCategories.map((category) => (
                <div className="accordion-item" key={category}>
                  <div className="accordion-header">
                    {editingCategory === category ? (
                      <div className="edit-category-form">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="admin-input"
                        />
                        <div className="form-actions">
                          <button 
                            className="admin-button save-button"
                            onClick={saveEditedCategory}
                          >
                            <Save size={16} />
                          </button>
                          <button 
                            className="admin-button cancel-button"
                            onClick={() => {
                              setEditingCategory("");
                              setNewCategoryName("");
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3>{category}</h3>
                        <div className="header-actions">
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => startEditingCategory(category)}
                            title="Edit Category"
                          >
                            <Edit size={18} className="action-icon" />
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => confirmDeleteCategory(category)}
                            title="Delete Category"
                          >
                            <Trash2 size={18} className="action-icon" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="accordion-content">
                    <ul className="guideline-list">
                      {guidelines[category]?.map((item, index) => (
                        <li key={index} className="guideline-item">
                          {editingItem.category === category && editingItem.index === index ? (
                            <div className="edit-item-form">
                              <input
                                type="text"
                                value={editingItem.text}
                                onChange={(e) => setEditingItem({...editingItem, text: e.target.value})}
                                className="admin-input"
                              />
                              <div className="form-actions">
                                <button className="admin-button save-button" onClick={saveItem}>
                                  <Save size={16} />
                                </button>
                                <button 
                                  className="admin-button cancel-button"
                                  onClick={() => setEditingItem({ category: "", index: -1, text: "" })}
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <span className="item-text">{item}</span>
                              <div className="item-actions">
                                <button 
                                  className="action-btn edit-btn sm-btn"
                                  onClick={() => startEditingItem(category, index, item)}
                                  title="Edit Item"
                                >
                                  <Edit size={14} className="action-icon" />
                                </button>
                                <button 
                                  className="action-btn delete-btn sm-btn"
                                  onClick={() => confirmDeleteItem(category, index)}
                                  title="Delete Item"
                                >
                                  <Trash2 size={14} className="action-icon" />
                                </button>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                    
                    {editingItem.category === category && editingItem.index === -1 ? (
                      <div className="add-item-form">
                        <input
                          type="text"
                          placeholder="New guideline item"
                          value={editingItem.text}
                          onChange={(e) => setEditingItem({...editingItem, text: e.target.value})}
                          className="admin-input"
                        />
                        <div className="form-actions">
                          <button className="admin-button save-button" onClick={saveItem}>
                            <Save size={16} /> Save
                          </button>
                          <button 
                            className="admin-button cancel-button"
                            onClick={() => setEditingItem({ category: "", index: -1, text: "" })}
                          >
                            <X size={16} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        className="add-item-button"
                        onClick={() => addItem(category)}
                      >
                        <Plus size={16} /> Add Item
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-container contacts-container">
            <div className="chart-header">
              <h2 className="chart-title">Emergency Contacts</h2>
              
            </div>
            
            {editingContact.id !== "" && (
              <div className="edit-contact-form">
                <div className="form-group">
                  <label htmlFor="contactTitle">Title</label>
                  <input
                    type="text"
                    id="contactTitle"
                    placeholder="Contact Title"
                    value={editingContact.title}
                    onChange={(e) => setEditingContact({...editingContact, title: e.target.value})}
                    className="admin-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contactNumber">Number</label>
                  <input
                    type="text"
                    id="contactNumber"
                    placeholder="Contact Number"
                    value={editingContact.number}
                    onChange={(e) => setEditingContact({...editingContact, number: e.target.value})}
                    className="admin-input"
                  />
                </div>
                <div className="form-actions">
                  <button className="admin-button save-button" onClick={saveEmergencyContact}>
                    <Save size={16} /> Save
                  </button>
                  <button 
                    className="admin-button cancel-button"
                    onClick={() => setEditingContact({ id: "", title: "", number: "" })}
                  >
                    <X size={16} /> Cancel
                  </button>
                </div>
              </div>
            )}
            
            <div className="contact-cards">
              {emergencyContacts.map((contact) => (
                <div className="contact-card" key={contact.id}>
                  {editingContact.id === contact.id ? (
                    <div className="edit-contact-form">
                      <div className="form-group">
                        <label htmlFor={`editTitle${contact.id}`}>Title</label>
                        <input
                          type="text"
                          id={`editTitle${contact.id}`}
                          value={editingContact.title}
                          onChange={(e) => setEditingContact({...editingContact, title: e.target.value})}
                          className="admin-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`editNumber${contact.id}`}>Number</label>
                        <input
                          type="text"
                          id={`editNumber${contact.id}`}
                          value={editingContact.number}
                          onChange={(e) => setEditingContact({...editingContact, number: e.target.value})}
                          className="admin-input"
                        />
                      </div>
                      <div className="form-actions">
                        <button className="admin-button save-button" onClick={saveEmergencyContact}>
                          <Save size={16} /> Save
                        </button>
                        <button 
                          className="admin-button cancel-button"
                          onClick={() => setEditingContact({ id: "", title: "", number: "" })}
                        >
                          <X size={16} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="contact-info">
                        <h4>{contact.title}</h4>
                        <p className="contact-number">{contact.number}</p>
                      </div>
                      <div className="contact-actions">
                      
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            
           
          </div>
        </div>
        
        {deleteConfirmation.show && (
          <div className="confirmation-dialog">
            <div className="dialog-content">
              <h3>Confirm Deletion</h3>
              
              {deleteConfirmation.type === "category" && (
                <>
                  <p>Are you sure you want to delete this category and all its guidelines?</p>
                  <div className="item-to-delete">
                    <strong>{deleteConfirmation.category}</strong>
                    <p className="item-count">
                      {guidelines[deleteConfirmation.category]?.length || 0} guidelines will be removed
                    </p>
                  </div>
                </>
              )}
              
              {deleteConfirmation.type === "item" && (
                <>
                  <p>Are you sure you want to delete this guideline?</p>
                  <div className="item-to-delete">
                    <strong>"{guidelines[deleteConfirmation.category]?.[deleteConfirmation.index]}"</strong>
                    <p className="category-name">From: {deleteConfirmation.category}</p>
                  </div>
                </>
              )}
              
              {deleteConfirmation.type === "contact" && (
                <>
                  <p>Are you sure you want to delete this emergency contact?</p>
                  <div className="item-to-delete">
                    {emergencyContacts.find(c => c.id === deleteConfirmation.id) && (
                      <>
                        <strong>{emergencyContacts.find(c => c.id === deleteConfirmation.id).title}</strong>
                        <p className="contact-number">
                          {emergencyContacts.find(c => c.id === deleteConfirmation.id).number}
                        </p>
                      </>
                    )}
                  </div>
                </>
              )}
              
              <div className="warning-message">
                <p><strong>Warning:</strong> This action cannot be undone.</p>
              </div>
              
              <div className="dialog-actions">
                <button 
                  className="cancel-btn" 
                  onClick={() => setDeleteConfirmation({
                    show: false,
                    type: "",
                    category: "",
                    index: -1,
                    id: ""
                  })}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-delete-btn" 
                  onClick={() => {
                    if (deleteConfirmation.type === "category") {
                      deleteCategory();
                    } else if (deleteConfirmation.type === "item") {
                      deleteItem();
                    } else if (deleteConfirmation.type === "contact") {
                      deleteContact();
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSafetyGuidelines;