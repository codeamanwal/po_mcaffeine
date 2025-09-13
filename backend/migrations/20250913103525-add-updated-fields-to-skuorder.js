'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const tableName = 'sku_orders';

    await queryInterface.addColumn(tableName, 'updatedQty', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn(tableName, 'updatedGmv', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn(tableName, 'updatedPoValue', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    const tableName = 'sku_orders';
    await queryInterface.removeColumn(tableName, 'updatedQty');
    await queryInterface.removeColumn(tableName, 'updatedGmv');
    await queryInterface.removeColumn(tableName, 'updatedPoValue');
  }
};
