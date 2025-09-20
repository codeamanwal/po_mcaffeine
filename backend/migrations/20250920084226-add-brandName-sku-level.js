'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('sku_orders', 'brandName', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Unknown',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('sku_orders', 'brandName');
  },
};
