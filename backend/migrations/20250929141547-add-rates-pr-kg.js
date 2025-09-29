'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const tableName = 'shipment_orders';

    await queryInterface.addColumn(tableName, 'rpk', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    
  },

  async down(queryInterface, Sequelize) {
    const tableName = 'shipment_orders';
    await queryInterface.removeColumn(tableName, 'rpk');
  }
};