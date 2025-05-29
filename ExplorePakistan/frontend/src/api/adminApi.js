const API_BASE_URL = 'http://localhost:8080/api/admin/users';

export const fetchUsers = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch users');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const searchUsers = async (term) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search?term=${encodeURIComponent(term)}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to search users');
    }
    return response.json();
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

export const deleteUser = async (uid) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${uid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete user');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const toggleUserStatus = async (uid) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${uid}/toggle-status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to toggle user status');
    }
    
    return data;
  } catch (error) {
    console.error('Error toggling user status:', error);
    throw error;
  }
};

export const updateUser = async (uid, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update user');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUserByDetails = async (name, email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete-by-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete user by details');
    }
    
    console.log('Delete user by details response:', data); // Add logging to see response
    return data;
  } catch (error) {
    console.error('Error deleting user by details:', error);
    throw error;
  }
};