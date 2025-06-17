export const apiUtils = {
    handleResponse: async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
      }
      return await response.json();
    },
  
    getAuthHeader: () => {
      const cookies = document.cookie.split(';').map(c => c.trim());
      const token = cookies.find(c => c.startsWith('adminToken='));
      return token ? { Authorization: `Bearer ${token.split('=')[1]}` } : {};
    }
  };