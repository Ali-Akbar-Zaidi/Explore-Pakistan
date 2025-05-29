const API_BASE_URL = 'http://localhost:8080/api/destinations';

export const getAllDestinations = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch destinations');
    }
    const data = await response.json();
    return data.map(dest => ({
      ...dest,
      activities: Array.isArray(dest.activities) ? dest.activities : [],
      tags: Array.isArray(dest.tags) ? dest.tags : []
    }));
  } catch (error) {
    console.error('Error fetching destinations:', error);
    throw error;
  }
};

export const addDestination = async (destination) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...destination,
        activities: Array.isArray(destination.activities) ? destination.activities : [],
        tags: Array.isArray(destination.tags) ? destination.tags : [],
        pricePerDay: parseFloat(destination.pricePerDay),
        rating: parseFloat(destination.rating)
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add destination');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding destination:', error);
    throw error;
  }
};