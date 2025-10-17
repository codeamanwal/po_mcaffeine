'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const tableName = 'shipment_orders';

     const dialect = queryInterface.sequelize.getDialect()
    let jsonType ;
    if (dialect === 'postgres') {
      jsonType = Sequelize.ARRAY(Sequelize.STRING);
    } else {
      // For MySQL 
      jsonType = Sequelize.JSON;
    }

    await queryInterface.addColumn(tableName, 'allAppointmentDate', {
      type: jsonType,
      allowNull: true,
    });

    await queryInterface.addColumn(tableName, 'appointmentRemarks', {
      type: jsonType,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    const tableName = 'shipment_orders';
    await queryInterface.removeColumn(tableName, 'allAppointmentDate');
    await queryInterface.removeColumn(tableName, 'appointmentRemarks');
  }
};
