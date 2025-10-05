'use strict';

export default {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn('shipment_orders', 'deliveryType', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('shipment_orders', 'deliveryType');
  }
};
