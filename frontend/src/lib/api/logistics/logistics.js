export const logisticsService = {
    async getAll() {
      try {
        const response = await fetch('/api/admin/logistics');
        if (!response.ok) throw new Error('Failed to fetch logistics');
        return await response.json();
      } catch (error) {
        console.error('Logistics fetch error:', error);
        throw error;
      }
    },
  
    async create(logisticsData) {
      try {
        const response = await fetch('/api/admin/logistics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logisticsData),
        });
        if (!response.ok) throw new Error('Failed to create logistics');
        return await response.json();
      } catch (error) {
        console.error('Logistics create error:', error);
        throw error;
      }
    }
  };