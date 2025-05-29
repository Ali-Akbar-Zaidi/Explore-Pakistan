// Admin API Service
const API_BASE_URL = "http://localhost:8080";

export const fetchUserStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/user-stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch user statistics');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
};

export const fetchMonthlySignups = async (months = 6) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/monthly-signups?months=${months}`);
    if (!response.ok) {
      throw new Error('Failed to fetch monthly signups');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching monthly signups:", error);
    throw error;
  }
};