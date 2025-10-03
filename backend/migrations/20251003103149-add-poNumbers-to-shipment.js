'use strict';

export default {
  async up(queryInterface, Sequelize) {
    const dialect = queryInterface.sequelize.getDialect();

    let poNumbersType;

    if (dialect === 'postgres') {
      poNumbersType = Sequelize.ARRAY(Sequelize.STRING);
    } else {
      // For MySQL 
      poNumbersType = Sequelize.JSON;
    }

    await queryInterface.addColumn('shipment_orders', 'poNumbers', {
      type: poNumbersType,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('shipment_orders', 'poNumbers');
  }
};
