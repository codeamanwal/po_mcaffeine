export const warehouseService = {
    async getAll() {
      try {
        const response = await fetch('/api/admin/warehouses');
        if (!response.ok) throw new Error('Failed to fetch warehouses');
        return await response.json();
      } catch (error) {
        console.error('Warehouse fetch error:', error);
        throw error;
      }
    },
  
    async create(warehouseData) {
      try {
        const response = await fetch('/api/admin/warehouses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(warehouseData),
        });
        if (!response.ok) throw new Error('Failed to create warehouse');
        return await response.json();
      } catch (error) {
        console.error('Warehouse create error:', error);
        throw error;
      }
    }
  };