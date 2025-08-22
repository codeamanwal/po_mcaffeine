'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const tableName = 'shipment_orders';

    await queryInterface.addColumn(tableName, 'allAppointmentDate', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });

    await queryInterface.addColumn(tableName, 'appointmentRemarks', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    const tableName = 'shipment_orders';
    await queryInterface.removeColumn(tableName, 'allAppointmentDate');
    await queryInterface.removeColumn(tableName, 'appointmentRemarks');
  }
};
