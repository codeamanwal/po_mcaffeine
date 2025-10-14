'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('logs', 'shipmentOrderId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('logs', 'shipmentOrderId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false,
    });
  }
};